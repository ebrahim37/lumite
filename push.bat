@echo off
call npm run build:ssg
git add --all
git commit -m "update"
git push -f https://github.com/beans42/lumite.git master