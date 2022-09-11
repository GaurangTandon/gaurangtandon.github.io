$ErrorActionPreference = "Stop"; # stop on firt error

echo "Step 0. Print PS version"
(Get-Host).Version 

echo "Step 1. generate input of one million numbers"
$file = "input.txt"

1000000 | Set-Content $file # insert count
1..1000000 | Add-Content $file # insert the numbers

echo "Step 2. compile both files"
cmd /c 'call "D:\VSC2019\VC\Auxiliary\Build\vcvars64.bat" && cl A_freopen.cpp /std:c++17 /O2'
cmd /c 'call "D:\VSC2019\VC\Auxiliary\Build\vcvars64.bat" && cl A_get_content.cpp /std:c++17 /O2'

echo "Step 3. Measure time taken"
Measure-Command { .\A_freopen.exe > output_freopen.txt }
Measure-Command { Get-Content $file | .\A_get_content.exe > output_get_content.txt }

echo "Step 4. Make sure outputs match"
cat output_freopen.txt
cat output_get_content.txt