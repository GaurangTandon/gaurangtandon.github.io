---
layout: post
title:  "Make it easy for me to review your code"
date:   2024-04-15 08:00:00 +0530
categories: tech
permalink: /blog/easy-code-review
---

Almost every software engineer - irrespective of their tech stack - writes code collaboratively via Git. They submit their fixes or features as changesets. One of their colleagues then reviews the changeset and approves or rejects it. This reviewer must approve your changeset before it can be merged and deployed.

The reviewer's job is tiring and thankless. They have to:

1. understand the context of your change, such as the issue at hand
2. review your design to ensure that no other design is more feasible
3. review the actual code to ensure it is a high-quality implementation
4. test the implementation to ensure it actually works

In this blog, I present specific and actionable suggestions, so you can make it easy for any reviewer to review your changeset. The **mantra** is to **reduce the diff and make it understandable**. All of the following suggestions directly implement this mantra.

## Reduce the diff

**tl;dr**: Reviewing 5 separate changesets is easier than one giant bundled changeset because smaller, focused changes are easier to understand, test, and validate. It reduces cognitive load, improves visibility into changes, and allows for more targeted feedback and testing.

### Do not make unrelated code changes

It is easy to accidentally bundle code formatting or code refactoring changes in your primary changeset. Note that any formatting or refactoring change should always be in its own separate changeset. Your primary changeset that implements a bugfix should never also be renaming multiple variables or changing indentations.

As a rule of thumb: **you can separate changesets by their effect on the application's function**. Any code refactor or formatting will likely be a non-functional changeset. Any bugfix or feature is likely a functional changeset. You should keep these changesets separate.

In practice, this separation makes the reviewer's task easy: _I know this changeset is only for code formatting, so any functional change is probably a mistake, and I should flag it._ 

### Focus each changeset on one specific issue

When working on one bugfix, it is easy to find more bugs on the same feature. The natural tendency is to bundle their bugfixes together in the changeset. After all, all the bugs are related to the same feature, and you fixed them around roughly the same time.

Practically, when all the bugfixes are bundled in one changeset, most code review tools (like in GitLab/GitHub) will present one large diff for all bugfixes together. This makes it difficult for the reviewer to understand which part of the diff corresponds to which bugfix.

You should put each bugfix in its own dedicated changeset, as this gives the reviewer (and you) the ability to reason about each bugfix independently.

As a rule of thumb, write a simple one-sentence summary of your changeset, and **if the changeset does more than just the summary, it should be split up.**

### Split large changesets into multiple sequential parts

Changesets that implement large features, such as a new user walkthrough, are very difficult to review. That is because often these changesets implement the core feature and also re-organize a lot of the related code. For example: they extract helper functions from existing code.

It usually makes sense to split out these reorganization changes into a dedicated changeset. This makes the reviewer's task easy, because 1. this is a non-functional changeset, and 2. it reduces the size of the primary changeset (which would now be just the core feature).

The rule of thumb I follow is: I first write the feature changeset fully. Once it is done, then I **extract the non-functional changes into a separate changeset and send that first**.

## Make the changeset understandable

**tl;dr:** Reviewing understandable changesets avoids needless asynchronous back-and-forth, and saves everyone time.

### Explain confusing changes

You should always explain any change that is not immediately obvious. This saves the reviewer time from having to ask you a question, and you from having to respond to it. In asynchronous/remote teams, this saves everyone time.

As a **rule of thumb**, **if I feel any part is confusing, I always explain it ahead of time**, because the reviewer is likely to find it confusing too.

<!-- ### Add in-code comments for explanations

The discussions on changesets may not persist in time. You might move platforms, prune older changesets, etc.

Generally, try to add explanations to the code itself, or to the commit messages. These explanations not only benefit the reviewer but also benefit the future code reader, who will also be likely looking for help. -->

### Explain alternative solutions for the same issue

The reviewer is also a subject matter expert just like you. They're likely to think of other solutions to the same issue. If you have also thought about them, you should make that clear in the changeset. Specifically: which other solutions did you implement, and why did they fall short of the proposed solution?

Without your explanation, the reviewer will just be confused: _Why didn't we implement solution X which appears much simpler?_

### Add tests

Tests help the reviewer understand how a given bug manifests in practice. Tests also give the reviewer confidence that your implementation does fix that bug. Finally, tests clarify your thought process, because they describe all the instances that you consider relevant to the bug. This allows the reviewer to suggest any new instance which should also be tested in this changeset.

## Conclusion

I hope you found the blog post useful. Feel free to reach out to me to continue the discussion.