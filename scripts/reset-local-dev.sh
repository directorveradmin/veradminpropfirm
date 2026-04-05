#!/usr/bin/env bash
set -euo pipefail

DEV_DIR=".veradmin-dev"

rm -rf "$DEV_DIR"
mkdir -p "$DEV_DIR/backups" "$DEV_DIR/exports" "$DEV_DIR/logs"

echo "[OK] reset $DEV_DIR"
