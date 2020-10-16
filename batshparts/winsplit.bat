

REM extract Info-zip unzip.exe
REM echo %uzoffset% %uzsize% %selfpath% %phiwTemp%
POWERSHELL -c ^
$fi=[System.IO.File]::OpenRead('%selfpath%');^
$fo=[System.IO.File]::OpenWrite('%phiwTemp%\bin\unzip.exe');^
$buf = New-Object byte[] 4096;^
$_ = $fi.Seek(%uzoffset%, 0);^
$size = %uzsize%;^
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
$fo.Close();