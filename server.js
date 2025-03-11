/**
 * Simple Express server for the Google Charts API Text Formula Replacement
 * 
 * This server provides a direct drop-in replacement for Google Charts API
 * by handling the same URL pattern and parameters without requiring any
 * client-side JavaScript changes.
 */

const express = require('express');
const path = require('path');
const mathjax = require('mathjax-node');
const { createCanvas } = require('canvas');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize MathJax
mathjax.config({
    MathJax: {
        SVG: {
            font: 'TeX',
            mtextFontInherit: true,
            linebreaks: { automatic: true }
        }
    }
});

// Serve a simple status page at the root
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Google Charts API Replacement</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                    h1 { color: #333; }
                    .example { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
                    img { display: block; margin: 10px 0; }
                    code { background: #f5f5f5; padding: 2px 4px; border-radius: 3px; }
                </style>
            </head>
            <body>
                <h1>Google Charts API Replacement Server</h1>
                <p>This server is running as a drop-in replacement for the Google Charts API text formula rendering.</p>
                
                <div class="example">
                    <h2>Example Usage</h2>
                    <p>Original Google Charts URL:</p>
                    <code>https://chart.googleapis.com/chart?cht=tx&chf=a,s,000000|bg,s,FFFFFF00&chl=%5Cforall%2C%20%5Cexists</code>
                    
                    <p>Replacement URL (this server):</p>
                    <code>${req.protocol}://${req.get('host')}/chart?cht=tx&chf=a,s,000000|bg,s,FFFFFF00&chl=%5Cforall%2C%20%5Cexists</code>
                    
                    <p>Result:</p>
                    <img src="/chart?cht=tx&chf=a,s,000000|bg,s,FFFFFF00&chl=%5Cforall%2C%20%5Cexists" alt="Formula Example">
                </div>
                
                <p>Server status: <strong>Running</strong></p>
            </body>
        </html>
    `);
});

// Main chart endpoint - mirrors the Google Charts API endpoint
app.get('/chart', async (req, res) => {
    const { cht, chl, chf } = req.query;
    
    // Only handle text formula charts
    if (cht !== 'tx' || !chl) {
        return res.status(400).send('Invalid chart parameters');
    }
    
    try {
        // Decode the formula
        const formula = decodeURIComponent(chl);
        
        // Parse color settings from chf parameter
        let textColor = '#000000';
        let backgroundColor = 'transparent';
        
        if (chf) {
            const parts = chf.split('|');
            for (const part of parts) {
                const [type, style, color] = part.split(',');
                if (type === 'a' && style === 's') {
                    textColor = `#${color}`;
                } else if (type === 'bg' && style === 's') {
                    // Handle transparent background (FFFFFF00)
                    if (color.length === 8 && color.endsWith('00')) {
                        backgroundColor = 'transparent';
                    } else {
                        backgroundColor = `#${color}`;
                    }
                }
            }
        }
        
        // Process the formula with MathJax
        const result = await mathjax.typeset({
            math: formula,
            format: 'TeX',
            svg: true,
            svgNode: true,
        });
        
        // Apply styling to the SVG
        let svgContent = result.svg;
        
        // Apply text color if different from default black
        if (textColor !== '#000000') {
            svgContent = svgContent.replace(/<svg/, `<svg style="color: ${textColor};"`)
                                  .replace(/fill="currentColor"/g, `fill="${textColor}"`)
                                  .replace(/stroke="currentColor"/g, `stroke="${textColor}"`);  
        }
        
        // Set the content type to SVG
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(svgContent);
    } catch (error) {
        console.error('Error processing formula:', error);
        res.status(500).send('Error processing formula');
    }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Google Charts API Replacement Server running at http://localhost:${PORT}`);
        console.log(`Use this server as a drop-in replacement for chart.googleapis.com`);
    });
}

// Export the Express app for Vercel
module.exports = app;
