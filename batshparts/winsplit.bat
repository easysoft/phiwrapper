$unzip_exe=$phiwTempbin+\"unzip.exe\"; ^
$test_unzip_ret=test_ts \"$unzip_exe\" \"$selfpath\"; ^
if ($test_unzip_ret -ne 0) { ^
    $fi=[System.IO.File]::OpenRead($selfpath);^
    $fo=[System.IO.File]::OpenWrite($unzip_exe);^
    $buf = New-Object byte[] 4096;^
    $_ = $fi.Seek($uzoffset, 0);^
    $size = $uzsize;^
    $done = 0;^
    $toread = 4096;^
    do{^
        if($toread -gt ($size - $done)){^
            $toread = $size - $done;^
        }^
        $red = $fi.Read($buf, 0, $toread);^
        $fo.Write($buf,0,$red);^
        $done+=$red;^
    }while($red -eq 4096);^
    $fi.Close();^
    $fo.Close();^
    (Get-ItemProperty -Path $unzip_exe).LastWriteTime=(Get-ItemProperty -Path $selfpath -Name LastWriteTime).LastWriteTime; ^
} ^