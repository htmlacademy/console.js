#!/usr/bin/env bash

only_exact=false
if ([ ! -z "$ONLY_VERSION" ] && [ $ONLY_VERSION == true ]);
then
  only_exact=true
fi

PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')
PACKAGE_MAJOR_MINOR_VERSION=$(echo $PACKAGE_VERSION | awk -F. '{ print $1"."$2 }')

curl -LOk https://github.com/htmlacademy/console.js/archive/gh-pages.zip
unzip -q ./gh-pages.zip # unzips directory console.js-gh-pages

# put content into version directory (update if already exists)
rm -rf ./console.js-gh-pages/$PACKAGE_VERSION
cp -r ./build ./console.js-gh-pages/$PACKAGE_VERSION

# put content into minor version directory (update if already exists)
rm -rf ./console.js-gh-pages/$PACKAGE_MAJOR_MINOR_VERSION
cp -r ./build ./console.js-gh-pages/$PACKAGE_MAJOR_MINOR_VERSION

# put contents into /latest directory
[ $only_exact != 'true' ] && rm -rf ./console.js-gh-pages/latest
[ $only_exact != 'true' ] && cp -r ./build/. ./console.js-gh-pages/latest/

# put contents into root directory (for compability reasons)
[ $only_exact != 'true' ] && cp -r ./build/. ./console.js-gh-pages/

# publish
gh-pages -d ./console.js-gh-pages/

# cleanup
rm -rf ./console.js-gh-pages
rm -rf ./gh-pages.zip
