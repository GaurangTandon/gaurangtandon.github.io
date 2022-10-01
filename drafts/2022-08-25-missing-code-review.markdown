---
layout: post
title:  "Draft: The missing feature from Code Review tools"
date:   2022-09-25 12:20:52 +0530
categories: tech
permalink: /blog/code-review-attention
---

Your colleague just sent you a twenty file changeset for review. You are busy ~~watching anime~~ working on your project, so what do you do? Sometimes, you may take shortcuts and then justify them to yourself! "I will review the main idea, the code is hopefully correct", "There was another assigned reviewer, who has already approved this changeset", or my favorite: "I trust my colleagues to write good code, even if I don't trust myself to do the same".

So you sprinkle a few comments as your "review", and then hit approve! Within minutes, the changeset is merged, and the latest code is auto-deployed to production.

But would you be able to sleep peacefully at night, if there was a bug in that code? A logic error in a critical resource access check? An edge case in the API behavior? Possibly, a wrong database command may now be running on production, due to the merge request that _YOU_ just approved.

Such incomplete reviews are detrimental to the long term health of the codebase. What if there was a way to flag the sleepy reviewers?

## Review audits on StackOverflow

StackOverflow is a community-driven Q&A site. The community reviews the content on the website, such as answers by new users and suggested edits to existing content (here's the [full breakdown](https://stackoverflow.com/help/reviews-intro)). Their content review queue has many amazing, time-tested features, one of which is the [review audit](https://meta.stackexchange.com/questions/157121/what-are-review-tests-audits-and-how-do-they-work).

At any time, a reviewer is given a review audit challenge. These audits are disguised as regular community contributions, and designed to trick a tired reviewer into taking the wrong action. If they do take a wrong action, they see a giant warning:

> **STOP! Look and listen**
> This was an audit, designed to see if you were paying attention. **You didn't pass.**. There are no major problems with this question. &lt;Here's what you should have done instead&gt;
> Don't worry, we've already handled this post appropriately - but please take a minute to look over it closely, keeping in mind the guidance above.

Instead if they are paying attention and take the correct action, they are informed of the test, thanked for their time, and then moved on.

## Tool proposal

TODO: screenshot of github and gitlab ui with my.


## How to make this tool

It seems to be impossible to make this tool using both platforms' integrations. They are more focused on running pipelines based on your commits, rather than modifying the UI of their platform (which to be fair, is hard to deliver securely via plugins). Making browser extensions for this is possible, however, not everyone on the team may have them installed.

The only way for this to be implemented is if GitLab and GitHub add this to their core product, as an opt-in flag per project.

## Conclusion

Don't get me wrong, I am not trying to bash reviewers. Reviewing code someone else wrote is a very difficult task (reviewing code you _yourself_ wrote an year ago is also difficult). Especially when reviewers receive a large changeset, that cannot be broken up into smaller parts. 

Regardless, every now and then a reviewer can slack, because they are human. This poses a risk to the codebase stability. Some of you may shy away or mentally shriek at this possibly. But, we should be aware of our shortcomings and try to reduce their impact, rather than shy away from them. And this blog post is an attempt to do just that.

<!-- Automated tests for lint/performance/correctness have not replaced the need for human supervision even in 2022. We still need humans to validate implementation edge cases, logical errors, code structure, etc. -->
<!-- Automated detection of reviews gone wrong? Detect two changes to a line within a week, each of the commits pointing to a merge request. This can only happen if 1. the second MR was blocked on the first MR 2. the second MR fixes a bug introduced the first MR, in which case the author/reviewer could have been more careful. -->