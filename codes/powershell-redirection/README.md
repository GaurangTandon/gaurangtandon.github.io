# Powershell redirection

Companion code for the blog post on the Powershell redirection issue.

To run both tests, run `.\test.ps1`. The result of running it on my machine is given in `.\logs.md`, so you can compare your results as well.

## Speed test

The two cpp files to be compared are in this directory (`A_*.cpp`).

The Get-Content approach uses 144807601 ticks, whereas freopen uses 3626600 ticks which is almost forty times faster.

## Speed test with Python

The two Python files to be compared are in this directory (`A_*.py`).

TODO: add tick data

## `Get-Content` test

`Get-Content .\input.txt | py .\B_input_read.py`