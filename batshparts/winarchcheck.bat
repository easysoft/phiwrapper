POWERSHELL -c ^
$arch=Get-ItemProperty -Path HKLM:Hardware\Description\System\CentralProcessor\0 -Name Identifier; ^
if($arch -like \"*Intel64*\"){$arch=\"AMD64\"} ^