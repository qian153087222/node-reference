#!/bin/sh
cd /node/blog1
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log