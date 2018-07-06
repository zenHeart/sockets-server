#!/bin/bash



# 修改此目录为共享插座对应家目录
projectPath=$(cd `dirname $0`/..; pwd)/docs;

umlPath=${projectPath}/graph/*.puml;
outputPath=${projectPath}/img;


plantuml -tsvg -r ${umlPath} -o ${outputPath}