#!/usr/bin/env bash
set -euo pipefail

if command -v tree >/dev/null 2>&1; then
  tree -a -I 'node_modules|.next|out|dist|target|.git'
else
  find . \
    -path './node_modules' -prune -o \
    -path './.next' -prune -o \
    -path './out' -prune -o \
    -path './dist' -prune -o \
    -path './src-tauri/target' -prune -o \
    -path './.git' -prune -o \
    -print | sort
fi
