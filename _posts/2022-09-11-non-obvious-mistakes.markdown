---
layout: post
title:  "Why is it so hard to sum up a million numbers?"
date:   2022-09-11 12:20:52 +0530
categories: rust advent-of-code
---

Most mistakes we make are due to lack of coffee. Every once in a while, though, we'll discover a novel failure, that will make us jump out of our seat and share it with everyone else. This is one such mistake.

## Powershell input/output redirection

I intend to run an executable with dedicated input and output files. In Linux, I would simply do `.\A.exe < .\A.in > .\A.out`. However, the input redirect (`<`) operator is "reserved for future use", even in PS7! Looks like they just forgot to implement it.

Either way, I google for alternatives and find the [first StackOverflow answer](https://stackoverflow.com/a/11788475/2181238) that has over a hundred upvotes. It even has a highly upvoted comment: "Get-Content sends the lines it reads one by one through the pipeline" ([link](https://stackoverflow.com/questions/11447598/redirecting-standard-input-output-in-windows-powershell#comment104325903_11788475)), which is quite re-assuring as my input files do tend to be large. So, I run this command:

```powershell
cat .\A.in | .\A.exe < .\A.out
```

What can go wrong here?

<details>
The `Get-Content` program is **fifty times slower** than a regular program. How is this even possible though?
</details>