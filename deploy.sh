#!/bin/bash
# exit with nonzero exit code if anything fails
set -e

rm -rf ".git"
git init

# inside this git repo we'll pretend to be a new user
git config user.name "Wercker CI"
git config user.email "olivier.tassinari@gmail.com"

# The first and only commit to this new Git repo contains all the
# files present with the commit message "Deploy to GitHub Pages".
git add package.json
git add server/ -f
git commit -m "Add static files"

# Force push from the current repo's master branch to the remote
# repo's master branch. (All previous history on the remote maser branch
# will be lost, since we are overwriting it.) We redirect any output to
# /dev/null to hide any sensitive credential data that might otherwise be exposed.
git push -f $1 master
