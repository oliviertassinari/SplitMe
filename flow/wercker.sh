#!/bin/bash
# exit with nonzero exit code if anything fails
set -e

apt-get update -y
apt-get install libelf-dev -y
