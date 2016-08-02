#!/bin/bash
# Command line util to publish the documentation on ghpages
# @see https://jobandtalent.github.com/nevada
git pull
npm run doc
source=`pwd`
destination=`mktemp -d`
echo "Generating documentation in temporary folder $destination"
git clone -b gh-pages --single-branch --depth 1 git@github.com:jobandtalent/nevada.git $destination
cp -rf $source/dist/doc/* $destination"/"
cd $destination
git add .
git commit -m "Generating ghpages documentation"
echo "$destination"
git push origin gh-pages
