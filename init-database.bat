@echo off
echo 正在初始化数据库...

REM 检查MySQL是否运行
mysql --version >nul 2>&1
if errorlevel 1 (
    echo 错误：未检测到MySQL，请安装MySQL并确保服务正在运行
    pause
    exit /b 1
)

REM 执行SQL脚本
echo 请输入MySQL root用户密码：
set /p MYSQL_PWD=

mysql -u root -p%MYSQL_PWD% < src\main\resources\init.sql

if errorlevel 1 (
    echo 错误：数据库初始化失败
    pause
    exit /b 1
)

echo 数据库初始化成功！
echo.
echo 按任意键退出...
pause >nul 