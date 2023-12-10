---
layout: post
title:  "Chrome extension difficulty: MV2 vs MV3 comparison"
date:   2023-12-10 00:00:00 +0530
categories: tech
permalink: /blog/chrome-extension-mv2-mv3
---

Chrome extensions are required to migrate to Manifest V3 by June 2024[^1]. Many new features have been added till Chrome 120 to support this migration[^2]. In this post, we will compare the implementation difficulty of four example use cases in Manifest V2 and in Manifest V3.

## Introduction

Chrome extensions enable developers to extend the web platform with custom styling and/or custom interactivity [^3]. This implies that Chrome extension developers are usually Web Developers, as they can write the necessary JavaScript, CSS, and HTML. When the Chrome extension platform uses the basic Web APIs[^apis], then the existing Web Developers can easily contribute to the Chrome extension platform.

<!--This is a net win for all participants: 

- web developers can quickly publish extensions to reach new users and monetize their work,
- users can access vast numbers of extensions to customize their browsing experience,
- Chrome can make a commission on the extension sales (although this was discontinued a few years ago) [^4]

The further the Chrome extensions platform diverges from Web fundamentals, the higher it raises the barrier to entry for Web Developers.-->

## Manifest V2

There are only two key components in the Manifest V2 platform: a background page and a content script. The background page:

- is a single instance that runs in the *background* of the Chrome browser. It starts when the Chrome browser starts, and is destroyed only when the Chrome process exits.
- is a *page* with DOM API access
- is a high-privilege context: here, you can store user data, run business logic, and access all `chrome.*` APIs.

On the other hand, the content script:

- has access to the target web page *content* (such as the DOM on youtube.com) and can manipulate it,
- is a short-lived *script*, so it dies out when that Chrome tab is closed.
- is a low-privilege context: mostly executes instructions that it receives from the background page via messaging.

### Four example use cases with the background page

Using the Manifest V2 background page, let us see how to implement the following four example use cases:

#### Handling global session state

To create global state per new browser session, we can put a global variable at the top of our JavaScript file, and read/write to it, like so:

```javascript
// at the start of our file
let isUserLoggedIn = false;

// ...read the state anywhere
if (isUserLoggedIn) { /* do something */ }
else { /* do something else */ }

// ...update the state from anywhere
onAuthStateChanged((user) => {
  if (user) { isUserLoggedIn = true; }
  else { isUserLoggedIn = false; }
});
```

#### Using setInterval or setTimeout

This is easy to do in a background page:

```javascript
const interval = setInterval(() => {
  // my logic here
}, 60 * 1000); // runs once a minute

// ...if later needed to clear
clearInterval(interval);
```

Note that timers in background pages are subject to timer throttling, like any backgrounded tab. This doesn't affect intervals for a minute or higher.

#### DOM API access

The background page can access any DOM API, like so:

```javascript
// ...read/write persisted storage
localStorage.setItem('key', 'value');
const value = localStorage.getItem('key');

// ...manipulate the user clipboard
document.execCommand('paste', false);

// ...play audio
new Audio('file.mp3').play();

// ...check the user OS
navigator.appVersion.includes('Win')
```

Note that these are perhaps the most basic Web APIs. Imagine your first `index.js` and `index.html` project: it is likely you used one or more of these APIs.

#### Multi-process synchronization

There is only one JavaScript process - the background page. It can manage the entire extension, and run all the tasks on its own. Therefore, there is no synchronization overhead between multiple processes.

<!--More importantly, we can **import any code snippet originally written for the Web platform**, and easily create a Chrome extension [!ref](cover exceptions) with that code. -->

Overall, we observe that Manifest V2 supports the most basic Web API features in a consistent manner, enabling web developers to get started easily.

## Manifest V3

Manifest V3 splits the background page into two separate processes: a service worker and an offscreen document.

The **extension service worker** is slightly similar to the Web API's service worker. In particular, the extension service worker[^sw]:

- is a single instance process, that is responsible for managing the entire extension
- cannot access any DOM API
- is loaded only on demand - for example, when responding to an event
- is unloaded after 30 seconds (though some exceptions are available[^lifetime]) of inactivity

The **offscreen document** is identical to the background page - except it cannot access `chrome.*` APIs [^offscreen].

The extension service worker can perform many tasks on its own. However, when it needs to play audio, access the clipboard, run DOM operations, etc. (an in-exhaustive list is available[^list]) - then it should message the offscreen document to perform that task. The offscreen document will then send a response back to the service worker.

Note that, in Manifest V2, the background page itself can manage all tasks on its own. However, in MV3, we need to setup a messaging channel between the extension service worker and the offscreen document to perform a few of these tasks.

### Four example use cases with the extension service workers:

Let us now again see how to implement the same four example use cases, using an extension service worker this time:

<!--This setup complicates Chrome extension development. In the following sections, I demonstrate how the new "recommended" approach is neither ergonomic nor familiar to existing web developers.-->

<!--### Service worker as an additional concept

The service worker doesn't have access to any DOM APIs and it can be killed and be restarted by the browser on certain events. This distinction can potentially trip up many Web Developers who just want to create a simple Chrome extension. The term "service worker" itself is not common among beginner camps. <!--Ideally, this is an important concept that web developers should have practice with. Realistically though, web developers spend most of their time writing JavaScript in the frontend DOM context, or in the backend NodeJS context, but very rarely in the Service Worker context. -->

#### Handling global session state

As per the docs, we need to design our service worker to be "resilient against unexpected termination" [^lifetime]. This effectively prohibits storing global state in-memory.

Now, we need to use `chrome.storage` APIs, which are async and verbose:

```js
// ...writing a key
chrome.storage.local.set({ key: value }).then(() => {
  console.log('Value was set');

  // ...reading a key
  chrome.storage.local.get(["key"]).then((result) => {
    console.log("Value currently is " + result.key);
  });
});
```

#### Using setInterval or setTimeout

Any `setTimeout` or `setInterval` that is longer than thirty seconds can unexpectedly terminate. Now, we need to use the `chrome.alarms` API. To create the alarm, we run code like so [^alarms]:

```javascript
async function createAlarm() {
  const alarm = await chrome.alarms.get("my-alarm");

  if (!alarm) {
    await chrome.alarms.create({ periodInMinutes: 1 });
  }
}

createAlarm();
```

and then to handle when it is triggered:

```javascript
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'my-alarm') {
    // ...my logic here
  }
});
```

#### DOM API access

Any code that uses DOM APIs needs to run in the offscreen document. This introduces extra complexity, such as:

1. handling the creation of offscreen document[^lifecycle]
2. asynchronous message passing with the offscreen document. This entails that all functions in the call stack also need to be async.
3. ensuring the message to and the response from the offscreen document both are JSON serializable.

#### Multi-process synchronization

Now we need to split our business logic into two files that run in two separate processes. This introduces extra complexity, such as:

- What happens if the offscreen document runs into an async exception while responding to the service worker? [^message] Will the service worker then be unloaded after waiting over 30 seconds for a response?
- The code editor loses type-checking information on the data sent with the message, and the response received for the message.
- If we have multiple files being imported across the two files, we need to ensure that no code is unintentionally shared between the two processes. Otherwise, we can accidentally inflate our app's bundle size.

## Conclusion

This blog post is only a factual and in-exhaustive summary of changes from Manifest V2 to Manifest V3 for four specific use cases. The full reasoning behind the Manifest V3 migration is much more complex and out of scope for this blog post. The example use cases I have taken may not be relevant for your project. In other use cases, it may be possible that MV3 has improved the developer experience.

## References

[^1]: <https://developer.chrome.com/blog/resuming-the-transition-to-mv3>
[^2]: <https://developer.chrome.com/blog/chrome-120-beta-whats-new-for-extensions>
[^3]: <https://developer.chrome.com/docs/extensions/develop>
[^4]: <https://github.com/GoogleChrome/webstore-docs/blob/master/money.html#L57>
[^offscreen]: <https://developer.chrome.com/docs/extensions/reference/api/offscreen>
[^alarms]: <https://github.com/GoogleChrome/webstore-docs/blob/master/money.html#L57>
[^message]: this is in the case of an asynchronous messaging channel, which remains open until a response is received
[^apis]: <https://developer.mozilla.org/en-US/docs/Web/API>
[^lifecycle]: <https://developer.chrome.com/docs/extensions/reference/api/offscreen#maintain_the_lifecycle_of_an_offscreen_document>
[^lifetime]: <https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle#idle-shutdown>
[^sw]: <https://developer.chrome.com/docs/extensions/develop/concepts/service-workers>
[^list]: <https://developer.chrome.com/docs/extensions/reference/api/offscreen#type-Reason>