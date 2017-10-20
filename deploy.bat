set datestr=%date%-%time:~0,2%-%time:~3,2%-%time:~6,2%
echo %datestr%
git add -A
git commit -m "%datestr%"
git push -u heroku master
pause
