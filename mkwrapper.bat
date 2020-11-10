@ECHO OFF

SET "interpreter=cscript.exe /nologo"
where node.exe > NUL && set "interpreter=node.exe"
%interpreter% wrapperwrapper.js