#!/bin/bash

# Build script for deployment

echo "Installing dependencies..."
npm install --no-optional

# Ensure we're using the right Node.js version
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"

echo "Build completed successfully!"
