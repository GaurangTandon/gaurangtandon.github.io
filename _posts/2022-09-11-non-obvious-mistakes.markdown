---
layout: post
title:  "Why is it so hard to sum up a million numbers?"
date:   2022-09-11 12:20:52 +0530
categories: powershell mistakes
---

Most mistakes we make are due to lack of coffee. Every once in a while, though, we'll discover a novel failure, that will make us jump out of our seat and share it with everyone else. This is one such mistake.

## Powershell input redirection

I have to run an executable file with dedicated input and output files. In Linux, I would simply do `.\A.out < .\A.in > .\A.out`. However, the input redirect (`<`) operator is "reserved for future use", even in PS7! They probably just forgot to implement it.

Either way, I google for alternatives and find the [first StackOverflow answer](https://stackoverflow.com/a/11788475/2181238). Happily, I run its suggested command:

```powershell
Get-Content .\A.in | .\A.exe > .\A.out
```

What can go wrong here? The PowerShell gurus probably know the answer, and should jump to the conclusion. But here I have an interesting investigation for the Linux/macOS users like me.

## What went wrong

The `Get-Content` invocation takes a **whopping 15 seconds**! Clearly, no modern CPU should take 15 seconds to sum up a million numbers. So how did this happen?

## Hypotheses analysis

Arithmetic is very fast for fast CPUs. So, there **has** to be an issue with the I/O redirection being too slow. To test that, I wrote a different C program that uses `freopen` to redirect the input file to stdin. This program only took 0.36seconds, neat!

What if the issue is some weird MSVC implementation issue? So, I re-wrote the same program in Python, with similar timing results (slower with `Get-Content`, faster otherwise).

## Analyzing the StackOverflow answer

It is clear that Get-Content is taking too long. But how can it be slow? The answer we ~~copied~~ read had over hundred upvotes, was over a decade old, and was viewed at least 70k times. It also had a comment explaining `Get-Content` sends the pipes the lines one by one. Let's check if that is true.

<!-- First, we run `Measure-Command { Get-Content .\input.txt > check.txt }` to get the baseline performance of `Get-Content`. On my machine, this takes around 20 seconds to complete. -->

If `Get-Content` does pipe the data line by line, a program can read and write the first ten lines of the file instantly. We write a simple program to emulate that:

```python
accumulated_input = ""
for _ in range(10):
  accumulated_input += input() + "\n"
print(accumulated_input)
```

We run this with `Get-Content .\input.txt | py .\B_sleepy_read.py`. The program instantly prints the first ten lines!

Now we know that the StackOverflow answer is correct. What then is really wrong with `Get-Content`?

## Final reveal

`Get-Content` itself is just incredibly slow. It is silly that it is aliased to `cat` in PowerShell, because `cat` on Linux is significantly faster (`cat input.txt | python3 code.py` finishes in half a second).

Searching for "why is powershell get-content so slow" reveals [this blog](https://joelitechlife.ca/2022/06/08/powershell-get-content-slow/) that perfectly demystifies this. In brief, `Get-Content` adds a bunch of metadata to the data it reads. Because it reads one line at a time, it adds metadata to every line it reads. For a file with a million lines, this metadata-business becomes painfully slow.

To fix it, we can simply run:

`Get-Content .\A.in -ReadCount 1000 | .\A.exe > .\A.out`

And now this prints the sum of a million numbers less than a second.


## Conclusion

Always double check StackOverflow answers for critical cases. This answer cost me one problem out of four in Hacker Cup 2022. To be clear, the answer was not wrong, just my expectations from it were exaggerated. Fortunately, I qualified the round either way ^_^

## References

I have attached the sample programs in my [GitHub repository here](https://github.com/gaurangtandon/gaurangtandon.github.io/blob/master/codes/powershell-redirection). Details and instructions to reproduce results are in the README there.

TODO:
- [ ] double check final fix
- [ ] research more what other people saying about get-content slowness
- [ ] comment on that stackoverflow answer with my findings
- [ ] fix program filenames
- [ ] post to HN