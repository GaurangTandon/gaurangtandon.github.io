---
layout: post
title:  "Why is it so hard to read a million numbers in PowerShell?"
subtitle: "Or why you should double-check that StackOverflow answer"
date:   2022-09-11 12:20:52 +0530
categories: powershell mistakes
---

## Introduction

This is a short story of how a slow PowerShell command led me to its .NET internals.

I have to run an executable file with dedicated input and output files. For context, this executable is compiled from C++ (can also use Python), and it will read a million numbers from an input file and then output their sum to another file. I prefer to use I/O redirection for this task as its semantically most correct in this context.

In Linux, I would simply do `.\A.out < .\A.in > .\A.out`. However, the input redirect (`<`) operator is "reserved for future use", even in PS7! They probably just forgot to implement it haha.

Either way, I google for alternatives and find the [first StackOverflow answer](https://stackoverflow.com/a/11788475/2181238). Happily, I run its suggested command:

```powershell
Get-Content .\A.in | .\A.exe > .\A.out
```

Now, pause and think. What can go wrong here? The PowerShell gurus probably know the answer, and should jump to the conclusion. But the Linux/macOS users should read on for an interesting investigation.

## What went wrong

This command took a **whopping 15 seconds**! Clearly, no modern CPU should take 15 seconds to sum up a million numbers. So how did this happen?

## Hypotheses

Arithmetic is very fast for fast CPUs. So, there **has** to be an issue with the I/O redirection being too slow. To test that, I wrote a different C program that uses `freopen` to redirect the input file to stdin. This program only took 0.36seconds, neat!

What if the issue is some weird MSVC implementation issue? So, I re-wrote the same program in Python, with similar timing results (slower with `Get-Content`, faster otherwise).

## Analyzing the StackOverflow answer

It is clear that Get-Content is taking too long. But how can it be slow? The answer we ~~copied~~ read had over hundred upvotes, was over a decade old, and was viewed at least 70k times. It also had a comment explaining `Get-Content` sends the pipes the lines one by one.

Let's at least check if that is true. A program that reads the first ten lines of the file should exit instantly. Here's a sample:

```python
accumulated_input = ""
for _ in range(10):
  accumulated_input += input() + "\n"
print(accumulated_input)
```

We run this with `Get-Content .\input.txt | python3 .\code.py`. The program instantly prints the first ten lines!

Now we know that the StackOverflow answer is correct. What then is really wrong with `Get-Content`?

## Found the issue!

`Get-Content` itself is just **incredibly** slow. It is silly and annoying that it is aliased to `cat` in PowerShell, because `cat` on Linux is significantly faster (`cat input.txt | python3 code.py` finishes in half a second).

Searching for "why is powershell get-content so slow" reveals [this blog](https://joelitechlife.ca/2022/06/08/powershell-get-content-slow/) that attempts to demystify the lacklustre speed. `Get-Content` adds a bunch of metadata to the data it reads. Because it reads one line at a time, it adds metadata to every line it reads. For a file with a million lines, this metadata addition becomes painfully slow.

So, let's run the following:

`Get-Content .\A.in -ReadCount 1000 | .\A.exe > .\A.out`

This is faster than our original code, but still takes over **three seconds** to complete. Interestingly, increasing the `ReadCount` slows the program even further.

## Diving into .NET internals

[**What is PowerShell?**](https://docs.microsoft.com/en-us/powershell/scripting/overview?view=powershell-7.2) Primarily, it is a scripting language "built on the .NET Common Language Runtime (CLR). All inputs and outputs are .NET objects".

`Get-Content` is a high-level function exposed to us, that is unusable for larger files and has no other high-level alternatives. So, we dive into the .NET internal classes.

There are various `Read` methods in `System.IO.File`, such as: `ReadAllBytes`, `ReadAllLines`, `ReadLines`, however, the method most relevant to us is: [`System.IO.File\]::ReadAllText`](https://docs.microsoft.com/en-us/dotnet/api/system.io.file.readalltext?view=net-6.0). This method simply "opens a text file, reads all the text in the file into a string, and then closes the file". For even larger files, this may not fit into the memory. However, for only a million numbers, this is good enough. So, we now run:

```powershell
Measure-Command { [System.IO.File]::ReadAllText('A.in') | .\A.exe > A.out }
```

This **completes in 0.3seconds**, just as fast as our Linux counterpart! 🎉

## Conclusion

Always double check StackOverflow answers for critical cases. This answer cost me one problem out of four in Hacker Cup 2022. To be clear, the answer was not wrong, just my expectations from it were different. Fortunately, I qualified the round either way ^_^

## References

I have attached the sample programs in my [GitHub repository here](https://github.com/gaurangtandon/gaurangtandon.github.io/blob/master/codes/powershell-redirection). Details and instructions to reproduce results are in the README there.

TODO:
- [ ] double check final fix
- [ ] research more what other people saying about get-content slowness
- [ ] comment on that stackoverflow answer with my findings
- [ ] fix program filenames
- [ ] post to HN