#!/bin/sh
cd F:\项目\node博客\blog_1\logs
cp access.log $(data + %Y-%m-%d).access.log
echo "" > access.log