---
layout: post
title:  "Email is a great note-taking tool for debugging sessions"
date:   2023-12-31 00:00:00 +0530
categories: tech
permalink: /blog/note-taking-email
---

In my everyday job, I often have to reverse-engineer parts of a web app (like Google Docs) using its minified JavaScript files. These files have many levels of delegation, have timer-oriented code, and have weird data transformations. It is difficult to complete the reverse engineering in just one session. So, I must keep taking notes to remember all the tiny details and map out my progress.

If you have also been stuck in a similar debugging session, you would agree on the importance of note-taking. It helps you to track two primary parameters:

- what information is certainly known so far,
- what next steps we can take to extract more information

Now, the note-taking tool is insignificant compared to the skill in identifying those two parameters. But, the correct choice can still help you stay focused on the task at hand.

Back in the day, I wrote my debugging notes in Google Docs. Google Docs is great if you are working live with another team member. It is also great for writing colorful, “rich” debugging notes. If you prefer that kind of style, by all means, continue using it!

In this blog post, I will instead share an alternative: good old email. For solo debugging sessions, I have found email to be much better than Google Docs.

## How I use email for note-taking while debugging

Each debugging session belongs to one very long email thread, that is sent to my own email address. While debugging, I write my latest observations in the latest email draft. When I feel confident about these observations, I send the email (to myself), and then start the next draft in that same email thread. I repeat this until I find all the info that I need.

## Why I prefer email over Google Docs

### “Commit”ing notes helps enforce progress over time

Writing notes in an email thread helps the debugging session to “move forward in time”. You cannot edit any past notes, as they have been “committed” to the email thread - like code is committed to a repository. You can only ever update the latest email draft: this restriction helps you focus on debugging. Every new email you send counts as a new stepping stone, getting you closer towards the final solution.

In Google Docs, there is no perspective of how notes were taken over time. Sure, you can try to enforce this visually, by writing the notes sequentially. In practice, this is hard to enforce. It is easy to start editing the older notes in the Google Doc while debugging, which can lead to wasted effort. More on this in the next section.

### Focusing on the problem rather than the formatting

While in a debugging session, it is easy to get lost trying to make the notes in Google Docs “look good”. This might include:

1. cleaning up older notes in the light of latest observations,
2. putting bold or italics on certain phrases to draw attention to them
3. cleaning up the language and structure of the past sentences

None of this is useful when you’re already inside the debugging session. This distracts you from the core task of thinking about the potential solutions for the problem.

Email instead supports limited formatting, and it also prevents you from editing previously sent emails. This reduced area for exploration of the notes, forces you to explore the problem more.

In other words, the developer’s time is the most valuable and it is also the most limited. More time spent formatting the notes necessarily implies less time spent debugging the actual issue.

### Email separates ongoing debugging research from a postmortem report

When writing notes in Google Docs, the writer might want to start tidying them up to be ready for the final presentation in the team meeting. Intuitively, this makes sense: by putting in an incremental effort to prepare the presentation, you lighten the extra workload when the debugging session ends.

Although intuitive, this is counter-productive. You cannot know in advance if the current chain of thought is in the right direction. You might spend time fleshing out specific thoughts, only to realize later they don’t matter in the final solution. Moreover, this again distracts you from the core task of debugging.

## Conclusion

While debugging an issue, the primary aim for the engineer is to find a simple and reliable solution as soon as possible. While debugging, the engineer usually has a long train of thoughts, which should be written down, to help solidify those thoughts. A restrictive tool like email helps force the engineer to focus on debugging; whereas a free-form tool like Docs encourages exploration beyond what is necessary for the primary aim.