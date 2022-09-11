Logs on my machine:

```text
Step 0. Print PS version

Major  Minor  Build  Revision
-----  -----  -----  --------
7      2      2      -1
Step 1. generate input of one million numbers
Step 2. compile both files
**********************************************************************
** Visual Studio 2019 Developer Command Prompt v16.11.9
** Copyright (c) 2021 Microsoft Corporation
**********************************************************************
[vcvarsall.bat] Environment initialized for: 'x64'
Microsoft (R) C/C++ Optimizing Compiler Version 19.29.30139 for x64
Copyright (C) Microsoft Corporation.  All rights reserved.

A_freopen.cpp
D:\VSC2019\VC\Tools\MSVC\14.29.30133\include\ostream(357): warning C4530: C++ exception handler used, but unwind semantics are not enabled. Specify /EHsc
D:\VSC2019\VC\Tools\MSVC\14.29.30133\include\ostream(350): note: while compiling class 
template member function 'std::basic_ostream<char,std::char_traits<char>> &std::basic_ostream<char,std::char_traits<char>>::operator <<(__int64)'
A_freopen.cpp(16): note: see reference to function template instantiation 'std::basic_ostream<char,std::char_traits<char>> &std::basic_ostream<char,std::char_traits<char>>::operator <<(__int64)' being compiled
A_freopen.cpp(16): note: see reference to class template instantiation 'std::basic_ostream<char,std::char_traits<char>>' being compiled
Microsoft (R) Incremental Linker Version 14.29.30139.0
Copyright (C) Microsoft Corporation.  All rights reserved.

/out:A_freopen.exe
A_freopen.obj
**********************************************************************
** Visual Studio 2019 Developer Command Prompt v16.11.9
** Copyright (c) 2021 Microsoft Corporation
**********************************************************************
[vcvarsall.bat] Environment initialized for: 'x64'
Microsoft (R) C/C++ Optimizing Compiler Version 19.29.30139 for x64
Copyright (C) Microsoft Corporation.  All rights reserved.

A_get_content.cpp
D:\VSC2019\VC\Tools\MSVC\14.29.30133\include\ostream(357): warning C4530: C++ exception handler used, but unwind semantics are not enabled. Specify /EHsc
D:\VSC2019\VC\Tools\MSVC\14.29.30133\include\ostream(350): note: while compiling class 
template member function 'std::basic_ostream<char,std::char_traits<char>> &std::basic_ostream<char,std::char_traits<char>>::operator <<(__int64)'
A_get_content.cpp(14): note: see reference to function template instantiation 'std::basic_ostream<char,std::char_traits<char>> &std::basic_ostream<char,std::char_traits<char>>::operator <<(__int64)' being compiled
A_get_content.cpp(14): note: see reference to class template instantiation 'std::basic_ostream<char,std::char_traits<char>>' being compiled
Microsoft (R) Incremental Linker Version 14.29.30139.0
Copyright (C) Microsoft Corporation.  All rights reserved.

/out:A_get_content.exe
A_get_content.obj
Step 3. Measure time taken

Ticks             : 3626600
Days              : 0
Hours             : 0
Milliseconds      : 362
Minutes           : 0
Seconds           : 0
TotalDays         : 4.1974537037037E-06
TotalHours        : 0.000100738888888889
TotalMilliseconds : 362.66
TotalMinutes      : 0.00604433333333333
TotalSeconds      : 0.36266


Ticks             : 144807601
Days              : 0
Hours             : 0
Milliseconds      : 480
Minutes           : 0
Seconds           : 14
TotalDays         : 0.000167601390046296
TotalHours        : 0.00402243336111111
TotalMilliseconds : 14480.7601
TotalMinutes      : 0.241346001666667
TotalSeconds      : 14.4807601

Step 4. Make sure outputs match
500000500000
500000500000
```