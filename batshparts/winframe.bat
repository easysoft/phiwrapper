
@ECHO OFF
{if(config.prependHashbang) trawfile("hashbangdontpanic.bat")}

{trawfile("winarchcheck.bat")}
{for(var i=0; i<winvars.length; i++)\{file("winarchvars.bat", winvars[i])\}} ^
if (!$archsupport) \{ Write-Output "not support Windows on $arch arch, exiting."; EXIT; \} ^
function test_ts ^
\{ ^
    Param([string] $dst_file, [string] $src_file); ^
    if (Test-Path $dst_file) \{ ^
        $dst_date=Get-ItemProperty -Path $dst_file -Name LastWriteTime; ^
        $src_date=Get-ItemProperty -Path $src_file -Name LastWriteTime; ^
        $dst_date=$dst_date.LastWriteTime; ^
        $src_date=$src_date.LastWriteTime; ^
        $duration=New-TimeSpan -Start $dst_date -End $src_date;  ^
        $d=$duration.Days; ^
        $h=$duration.Hours; ^
        $m=$duration.Minutes; ^
        $s=$duration.Seconds; ^
        $ret=[int]$d*24*60*60+$h*60*60+$m*60+$s; ^
        return $ret; ^
    \} else \{ ^
        return [int]1; ^
    \} ^
    return [int]0; ^
\}; ^
$phiwTemp=$env:LOCALAPPDATA+\"/ztool/\"; ^
$phiwTempbin=$phiwTemp+\"bin/\";^
$isPathExist=Test-Path $phiwTempbin; ^
if ($isPathExist -ne \"True\") \{ mkdir $phiwTempbin; \} ^
$selfpath='%~dpnx0';^
{rawfile("winsplit.bat")}
$phiwTemp_psPath=$phiwTemp+$pspath; ^
$isPathExist=Test-Path $phiwTemp_psPath; ^
if ($isPathExist -ne \"True\") \{ mkdir $phiwTemp_psPath; \} ^
$bin_exe=$phiwTemp_psPath+$config.piPath+$cmdline; ^
$test_bin_ret=test_ts \"$bin_exe\" \"$selfpath\"; ^
if ($test_bin_ret -ne 0) \{ ^
taskkill /f /t /im \"$cmdline\" 2>nul; ^
cmd /c $unzip_exe -o -qq \"$selfpath\" \"$pspath*\" -d \"$phiwTemp\"; ^
(Get-ItemProperty -Path $bin_exe).LastWriteTime=(Get-ItemProperty -Path $selfpath -Name LastWriteTime).LastWriteTime; ^
\} ^
cmd /c $\{bin_exe\} %*;
goto :eof