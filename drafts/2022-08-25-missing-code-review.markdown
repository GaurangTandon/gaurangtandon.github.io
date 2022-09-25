---
layout: post
title:  "Draft: The missing feature from Code Review tools"
date:   2022-09-25 12:20:52 +0530
categories: tech
permalink: /blog/code-review-attention
---

Your colleague just sent you a twenty file changeset for review. You are busy ~~watching anime~~ working on your project, so what do you do? Sometimes, you may take shortcuts and then justify them to yourself! "I will review the main idea, the code is hopefully correct", "There are some tests, which could be incomplete but are probably not", "I trust my colleagues to write good code, even if I don't trust myself to do the same", "There was another assigned reviewer, who has already approved this changeset".

So you sprinkle a few comments as your "review", and then hit that shiny green "Approve" button! Within minutes, the changeset is merged, and an auto-deploy pipeline kicks in to deploy this code to production.

Think to yourself, would you be able to sleep peacefully at night, if there was a bug in that code? A logic error in an access check? An edge case in the API behavior? Possibly, a wrong database command may now be running on production due to the merge request that _you_ just approved.

However, such incomplete reviews are detrimental to the long term health of the codebase. We should use tools to our advantage, to ensure that reviewers are able to deliver their best.

## Tool proposal

TODO: screenshot of github and gitlab ui with my.

## Tool inspiration

TODO: Where is the stackoverflow official documentation on the fake posts they sprinkle in their review queues when you're on a review spree (or to catch a robo-reviewer)?

## How to make this tool

It seems to be impossible to make this tool using both platforms' integrations. They are more focused on running pipelines based on your commits, rather than modifying the UI of their platform (which to be fair, is hard to deliver securely via plugins). Making browser extensions for this is possible, however, not everyone on the team may have them installed.

The only way for this to be implemented is if GitLab and GitHub add this to their core product, as an opt-in flag per project.

## Conclusion

Don't get me wrong, I am not trying to bash reviewers. Reviewing code someone else wrote is a very difficult task (reviewing code you _yourself_ wrote an year ago is also difficult). Especially when reviewers receive a large changeset, that cannot be broken up into smaller parts. 

Regardless, every now and then a reviewer can slack, because they are human. This poses a risk to the codebase stability. Some of you may shy away or mentally shriek at this possibly. But, we should be aware of our shortcomings and try to reduce their impact, rather than shy away from them. And this blog post is an attempt to do just that.

<!-- Automated tests for lint/performance/correctness have not replaced the need for human supervision even in 2022. We still need humans to validate implementation edge cases, logical errors, code structure, etc. -->
<!-- Automated detection of reviews gone wrong? Detect two changes to a line within a week, each of the commits pointing to a merge request. This can only happen if 1. the second MR was blocked on the first MR 2. the second MR fixes a bug introduced the first MR, in which case the author/reviewer could have been more careful. -->