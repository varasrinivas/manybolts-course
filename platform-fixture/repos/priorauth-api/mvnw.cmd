@REM Maven wrapper (Windows). Resolves from MAVEN_HOME, M2_HOME, then PATH.
@ECHO OFF
IF DEFINED MAVEN_HOME IF EXIST "%MAVEN_HOME%in\mvn.cmd" (
  CALL "%MAVEN_HOME%in\mvn.cmd" %*
  EXIT /B %ERRORLEVEL%
)
IF DEFINED M2_HOME IF EXIST "%M2_HOME%in\mvn.cmd" (
  CALL "%M2_HOME%in\mvn.cmd" %*
  EXIT /B %ERRORLEVEL%
)
WHERE mvn >NUL 2>NUL
IF %ERRORLEVEL% EQU 0 (
  mvn %*
  EXIT /B %ERRORLEVEL%
)
ECHO maven not found. Set MAVEN_HOME, or see scriptserify-fixture.sh for the offline path.
EXIT /B 127
