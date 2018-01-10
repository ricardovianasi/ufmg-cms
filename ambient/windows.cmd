<!-- : --- Self-Elevating Batch Script ---------------------------
@whoami /groups | find "S-1-16-12288" > nul && goto :admin
set "ELEVATE_CMDLINE=cd /d "%~dp0" & call "%~f0" %*"
cscript //nologo "%~f0?.wsf" //job:Elevate & exit /b

-->
<job id="Elevate"><script language="VBScript">
  Set objShell = CreateObject("Shell.Application")
  Set objWshShell = WScript.CreateObject("WScript.Shell")
  Set objWshProcessEnv = objWshShell.Environment("PROCESS")
  strCommandLine = Trim(objWshProcessEnv("ELEVATE_CMDLINE"))
  objShell.ShellExecute "cmd", "/c " & strCommandLine, "", "runas"
</script></job>
:admin -----------------------------------------------------------

@echo off
REM echo Running as elevated user.
REM echo Script file : %~f0
REM echo Arguments   : %*
REM echo Working dir : %cd%
echo.
echo Configurando váriavel de ambiente
SETX APPLICATION_ENV development
copy /y bin\jpegtran.exe %WINDIR%\system32
copy /y bin\optipng.exe %WINDIR%\system32
copy /y bin\pngquant.exe %WINDIR%\system32
echo Instalando/Atualizando NodeJS
msiexec.exe /i bin\node-v6.9.4-x64.msi /quiet
echo Instalando/Atualizando Git
bin\Git-2.11.0-64-bit.exe /SILENT /COMPONENTS="icons,ext\reg\shellhere,assoc,assoc_sh"
timeout /t 5 >null
echo Clonando UFMG-CMS...
"%ProgramFiles%\Git\cmd\git.exe" clone http://150.164.180.61:8789/web/ufmg-cms.git
cd ufmg-cms\
echo Instalando/Atualizando Bower e Gulp
start /wait cmd /c "npm i -g gulp-cli bower"
echo Instalando/Atualizando Dependências ..
start /wait cmd /c "npm i"
start /wait cmd /c "bower i"
start "" cmd /c "gulp dev"