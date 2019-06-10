#!/bin/bash

set -o errexit
set -o xtrace

rm -rf models venv
alwaysai app _install
alwaysai app _start
