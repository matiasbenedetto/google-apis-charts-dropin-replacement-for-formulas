#!/bin/bash

# Build script for deployment

echo "Installing dependencies..."

# First install all dependencies except sharp
npm install --omit=optional

# Then install sharp with platform-specific flags
echo "Installing sharp with platform-specific flags..."
npm install --platform=linux --arch=x64 sharp

# Ensure we're using the right Node.js version
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"

# Test sharp installation
echo "Testing sharp installation..."
node -e 'try { const sharp = require("sharp"); console.log("Sharp version:", sharp.versions); } catch(e) { console.error("Sharp test failed:", e); process.exit(1); }'

# Create a test file to verify MathJax v3 is working
echo "Testing MathJax v3 setup..."
node -e 'try { const mathjax = require("mathjax-full"); const TeX = mathjax.tex.TeX; const SVG = mathjax.svg.SVG; const LiteAdaptor = mathjax.adaptors.liteAdaptor; const RegisterHTMLHandler = mathjax.handlers.html.RegisterHTMLHandler; const adaptor = LiteAdaptor(); RegisterHTMLHandler(adaptor); const tex = new TeX({ packages: ["base", "ams"] }); const svg = new SVG({ fontCache: "none" }); const html = mathjax.mathjax.document("", { InputJax: tex, OutputJax: svg }); const node = html.convert("x^2", { display: true }); const svgOutput = adaptor.innerHTML(node); console.log("MathJax v3 test successful: SVG generated"); } catch(err) { console.error("MathJax v3 test failed:", err); process.exit(1); }'

echo "Build completed successfully!"
