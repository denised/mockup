#!/bin/bash
################################################################################
# File:    builddocs.sh
# Purpose: Build and deploy the associated project.
#
# Based on:
# Original Authors: Michael Altfield <michael@michaelaltfield.net>
# Created: 2020-07-17
################################################################################
set -x
set -e 
 
#####################
# DECLARE VARIABLES #
#####################

export SOURCE_DATE_EPOCH=$(git log -1 --pretty=%ct)
 
##############
# BUILD      #
##############

npm run build
 
#######################
# Update GitHub Pages #
#######################
 
git config --global user.name "${GITHUB_ACTOR}"
git config --global user.email "${GITHUB_ACTOR}@users.noreply.github.com"
 
pushd dist
 
# don't bother maintaining history; just generate fresh
git init
git remote add deploy "https://token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
git checkout -b gh-pages
 
# add .nojekyll to the root so that github won't 404 on content added to dirs
# that start with an underscore (_), such as our "_content" dir..
touch .nojekyll
 
# Add README
cat > README.md <<EOF
# GitHub Pages Cache
 
This is a cached version of the deployed repo for rendering on github pages.
EOF
 

git add .
 
# commit all the new files
msg="Updating Docs for commit ${GITHUB_SHA} made on `date -d"@${SOURCE_DATE_EPOCH}" --iso-8601=seconds` from ${GITHUB_REF} by ${GITHUB_ACTOR}"
git commit -am "${msg}"
 
# overwrite the contents of the gh-pages branch on our github.com repo
git push deploy gh-pages --force
 
popd # return to main repo sandbox root
 
# exit cleanly
exit 0