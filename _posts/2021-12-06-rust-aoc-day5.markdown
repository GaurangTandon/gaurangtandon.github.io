---
layout: post
title:  "Draft: Rust AoC Day 5 explanation"
date:   2021-12-06 12:20:52 +0530
categories: rust advent-of-code
---

In this post, we will walk through [Tim Visee's solution](https://github.com/timvisee/advent-of-code-2021) to the day 5 Advent of Code Rust problem. The aim of this blog post is to not explain the solution to this problem, which is already explained in other blogs very well. Instead, I aim to explain the several idiomatic expressions in Tim's terse Rust code for folks new to Rust.

## Part One

### Tim's Code

#### `include_str!` and `include_bytes!`

These macros load the contents of a file into the codei, but at compile time itself! The variable will have a type `&'static str`! (see [docs](https://doc.rust-lang.org/stable/std/macro.include_str.html)) ADD NOTE ON SPACE REQUIREMENTS? Is it better to iterate line by line at runtime?

#### `nom`

`nom` is a [Rust crate](https://docs.rs/nom/6.2.1/nom/macro.named.html) for fast parsing of byte data. As we can see in [this commit](https://github.com/timvisee/advent-of-code-2021/commit/ef75c85f2621e570494f69755717ea1db2db0a15), using nom significantly sped up the code. How does it make this difference? 

The original code had three `split_once` calls and several `unwrap` and `parse` calls. Even in `--release` mode, the compiler cannot optimize away the safety checks and the bounds checks in these calls (see godbolt sample here). 

### TODO

So this is that blog I never ended up finishing.