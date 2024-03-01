@ECHO OFF

:choice
set /P c=Do you want to check for updates?[Y/N]?
if /I "%c%" EQU "Y" goto :check
if /I "%c%" EQU "N" goto :start_mdt
goto :choice


:check
node check_update.js
echo "Checking for updates!"
pause

:start_mdt
node index.js
echo.
echo If you see this message, you need to either install Node.js (https://nodejs.org/en) and reboot or another error occurred 
PAUSE