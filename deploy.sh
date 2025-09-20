#!/bin/bash
# exit with nonzero exit code if anything fails
set -e

rm -rf ".git"
git init

# inside this git repo we'll pretend to be a new user
git config user.name "Wercker CI"
git config user.email "fake@user.com"

# The first and only commit to this new Git repo contains all the
# files present with the commit message "Deploy to GitHub Pages".
git add package.json
git add server/ -f

# Do not install the dev dependencies
echo 'production = true' >> .npmrc
git add .npmrc

git commit -m "Add static files"

# Upgrade from node v0.10 to the latest stable
git clean -fd
git remote add upstream -m master git://github.com/ramr/nodejs-custom-version-openshift.git
git pull -s recursive -X ours upstream master

# Force push from the current repo's master branch to the remote
# repo's master branch. (All previous history on the remote maser branch
# will be lost, since we are overwriting it.) We redirect any output to
# /dev/null to hide any sensitive credential data that might otherwise be exposed.
git push -f $1 master
