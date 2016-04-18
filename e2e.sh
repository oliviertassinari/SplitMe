#!/bin/bash
# exit with nonzero exit code if anything fails
set -e

wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'

apt-get update -y
apt-get install xvfb google-chrome-stable -y
