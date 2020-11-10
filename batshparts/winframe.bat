
@ECHO OFF
{if(config.prependHashbang) trawfile("hashbangdontpanic.bat")}

: TODO: configurable
ECHO phiwrapper wrapped batsh at cmd

{trawfile("winarchcheck.bat")}

REM make up variables used later
{for(var i=0; i<winvars.length; i++)\{file("winarchvars.bat", winvars[i])\}}
IF NOT %archsupport%==ok ( ECHO not support Windows on %arch% arch, exiting. && EXIT )

REM accuire an unique temp dir path
:uniqLoop
SET "phiwTemp={echo(config.winTempDir)}"
IF EXIST "%phiwTemp%" GOTO :uniqLoop

REM create bin dir for unzip.exe
MKDIR %phiwTemp%\bin &&^

SET "selfpath=%~dpnx0" &&^
{rawfile("winsplit.bat")}

CD %phiwTemp% &&^
SET "Path=%phiwTemp%\bin;%Path%"

REM unzip psfiles
unzip.exe %selfpath% %pspath%/* -d extracting
MOVE extracting\%winpspath%\* {echo(config.psTarget.replace("/", "\\"))}

REM unzip pifiles
unzip.exe %selfpath% {echo(config.piPath)}/* -d extracting
MOVE {echo("extracting\\")}{echo(config.piPath.replace("/", "\\"))}\* {echo(config.piTarget.replace("/", "\\"))}

REM run target
%cmdline% &&^

REM clean
REM TODO: cli args
RD /S /Q %phiwTemp%
EXIT