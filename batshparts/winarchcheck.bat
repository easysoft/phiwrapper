
REM determine architecture
FOR /F "tokens=1-3 delims= " %%a IN ('REG QUERY "HKLM\Hardware\Description\System\CentralProcessor\0" /V Identifier') DO (
  SET "arch=%%c"
)
