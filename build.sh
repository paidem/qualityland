#!/bin/bash
set -e
cd "$(dirname "$0")"
npm install --silent
node build.js
echo ""
echo "Build complete. Output in dist/"
echo "Preview with: npx serve dist"
