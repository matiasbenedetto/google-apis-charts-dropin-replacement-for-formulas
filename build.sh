#!/bin/bash

# Build script for deployment

echo "Installing dependencies..."
npm install --no-optional

# Ensure we're using the right Node.js version
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"

# Create a test file to verify MathJax is working
echo "Testing MathJax setup..."
node -e 'const mjAPI = require("mathjax-node"); mjAPI.config({fontURL: "https://cdn.jsdelivr.net/npm/mathjax@2.7.9/fonts/HTML-CSS"}); mjAPI.start(); mjAPI.typeset({math: "x^2", format: "TeX", svg: true}).then(result => console.log("MathJax test successful:", result.svg ? "SVG generated" : "Failed")).catch(err => console.error("MathJax test failed:", err));'

echo "Build completed successfully!"
