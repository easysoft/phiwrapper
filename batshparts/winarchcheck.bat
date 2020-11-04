
REM determine architecture
FOR /F "tokens=1-3 delims= " %%a IN ('REG QUERY "HKLM\Hardware\Description\System\CentralProcessor\0" /V Identifier') DO (
  SET "arch=%%c"
)

REM intel 64 shim
IF %arch%=="Intel64" SET arch="AMD64"
