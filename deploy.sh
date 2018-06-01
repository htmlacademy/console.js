#!/usr/bin/env bash

PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')
curl -LOk https://github.com/htmlacademy/console.js/archive/gh-pages.zip
unzip ./gh-pages.zip
rm -rf ./console.js-gh-pages/$PACKAGE_VERSION
cp -r ./build ./console.js-gh-pages/$PACKAGE_VERSION
rm -rf ./console.js-gh-pages/latest
cp -r ./build ./console.js-gh-pages/latest
cp -r ./build/. ./console.js-gh-pages/
gh-pages -d ./console.js-gh-pages/
rm -rf ./console.js-gh-pages
rm -rf ./gh-pages.zip
