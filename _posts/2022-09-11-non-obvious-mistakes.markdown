---
layout: post
title:  "Why is it so hard to sum up a million numbers?"
date:   2022-09-11 12:20:52 +0530
categories: rust advent-of-code
---

Most mistakes we make are due to lack of coffee. Every once in a while, though, we'll discover a novel failure, that will make us jump out of our seat and share it with everyone else. This is one such mistake.

## Powershell input redirection

I intend to run an executable with dedicated input and output files. In Linux, I would simply do `.\A.exe < .\A.in > .\A.out`. However, the input redirect (`<`) operator is "reserved for future use", even in PS7! Looks like they just forgot to implement it.

Either way, I google for alternatives and find the [first StackOverflow answer](https://stackoverflow.com/a/11788475/2181238). It even has a highly upvoted comment: "Get-Content sends the lines it reads one by one through the pipeline" ([link](https://stackoverflow.com/questions/11447598/redirecting-standard-input-output-in-windows-powershell#comment104325903_11788475)), which is quite re-assuring as my input files do tend to be large. So, I run this command:

```powershell
Get-Content .\A.in | .\A.exe > .\A.out
```

What can go wrong here?

## What went wrong

The `Get-Content` invocation is at least **forty times slower** than it needs to be, taking an astounding 15 seconds on my machine. Clearly, a machine with Ryzen 5900HX should never take 15 seconds to sum up a million numbers. So how did this happen?

## Hypotheses analysis

Arithmetic is very fast for fast CPUs. So, there **has** to be an issue with the I/O redirection being too slow. To test that, I wrote a different C program that uses `freopen` to read the file. This program only took 0.36seconds total.

Further, to check that the issue was not some weird MSVC implementation issue, I re-wrote the same program in Python, with similar timing results.

## Rechecking the answer

But how can the input stream be slow? The answer we ~~copied~~ read had over hundred upvotes, was over a decade old, and was viewed at least 70k times. There was also a comment explaining `Get-Content` sends the lines one by one. Let's check if that is true for us.

First, we run `Measure-Command { Get-Content .\input.txt > check.txt }` to get the baseline performance of `Get-Content`. On my machine, this takes around 20 seconds to complete.

Now assume that we have to read and print only the first ten lines from this file. If `Get-Content` does send data line by line, this operation should complete instantly.  We write a simple Python program to check that:

```python
import time

accumulated_input = ""
start_time = time.time()
for _ in range(10):
  accumulated_input += input() + "\n"
end_time = time.time()
print("Time taken", end_time - start_time)
print(accumulated_input)
```

We run this with `Get-Content .\input.txt | py .\B_sleepy_read.py`. Surprisingly enough, the program instantly prints the first ten lines!

So, at least we now know that the StackOverflow is correct. What was wrong in our original programs then?

## Final reveal

Turns out it becomes slower if you tack a `> result.txt` at the end.
Final answer: `Get-Content` itself is just incredibly slow.

## Conclusion

Always double check StackOverflow answers for critical cases. This answer cost me one problem out of four in Hacker Cup 2022. To be clear, the answer was not wrong, just my expectations from it were (probably) out of place. Fortunately, I qualified the round either way ^_^

## References

I have attached the sample programs in my [GitHub repository here](https://github.com/gaurangtandon/gaurangtandon.github.io/blob/master/codes/powershell-redirection). Details and instructions to reproduce results are in the README there.