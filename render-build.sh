#!/usr/bin/env bash
set -o errexit  # Error pe stop

# Install dependencies
npm install

# Install Chromium during build
npx puppeteer browsers install chrome

# Cache persist (using env var)
if [ -n "$PUPPETEER_CACHE_DIR" ]; then
  mkdir -p "$PUPPETEER_CACHE_DIR"
  cp -r ~/.cache/puppeteer/* "$PUPPETEER_CACHE_DIR" || true
  echo "Cache copied to persistent location."
else
  echo "No PUPPETEER_CACHE_DIR set, skipping cache persist."
fi
