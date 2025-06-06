@echo off
echo 正在启动图书管理系统...

REM 检查Java是否安装
java -version >nul 2>&1
if errorlevel 1 (
    echo 错误：未检测到Java，请安装JDK 11或更高版本
    pause
    exit /b 1
)

REM 检查Maven是否安装
mvn -version >nul 2>&1
if errorlevel 1 (
    echo 错误：未检测到Maven，请安装Maven
    pause
    exit /b 1
)

REM 检查MySQL是否运行
mysql --version >nul 2>&1
if errorlevel 1 (
    echo 错误：未检测到MySQL，请安装MySQL并确保服务正在运行
    pause
    exit /b 1
)

REM 检查Tomcat是否安装
if not exist "%CATALINA_HOME%\bin\startup.bat" (
    echo 错误：未检测到Tomcat，请设置CATALINA_HOME环境变量
    pause
    exit /b 1
)

echo 正在构建项目...
call mvn clean package

if errorlevel 1 (
    echo 错误：项目构建失败
    pause
    exit /b 1
)

echo 正在部署到Tomcat...
copy /Y target\library-management-system-1.0-SNAPSHOT.war "%CATALINA_HOME%\webapps\library-management-system.war"

echo 正在启动Tomcat...
call "%CATALINA_HOME%\bin\startup.bat"

echo 等待系统启动...
timeout /t 10 /nobreak

echo 系统已启动！
echo 请访问：http://localhost:8080/library-management-system/
echo.
echo 按任意键退出...
pause >nul 