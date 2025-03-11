/**
 * Simple Express server for the Google Charts API Text Formula Replacement
 * 
 * This server provides a direct drop-in replacement for Google Charts API
 * by handling the same URL pattern and parameters without requiring any
 * client-side JavaScript changes.
 */

const express = require('express');
const path = require('path');
const mjAPI = require('mathjax-node');
const svg2img = require('svg2img');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize MathJax-Node
mjAPI.config({
  MathJax: {
    // Traditional MathJax configuration
    SVG: {
      font: "TeX",
      linebreaks: { automatic: true },
      mtextFontInherit: true
    },
    TeX: {
      extensions: ["AMSmath.js", "AMSsymbols.js", "noErrors.js", "noUndefined.js"],
      Macros: {
        RR: "\\mathbb{R}",
        NN: "\\mathbb{N}",
        ZZ: "\\mathbb{Z}"
      }
    },
    // Add HTML entities support
    entities: {
      // Add HTML entities that MathJax should recognize
      "&nbsp;": "\u00A0"
    }
  }
});

// Start MathJax-Node
mjAPI.start();

// Serve a simple status page at the root
// serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
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
        let formula = decodeURIComponent(chl);
        
        // Handle dollar signs in the formula
        // If the formula has single $ or double $$ delimiters, remove them as they can cause issues
        if (formula.startsWith('$$') && formula.endsWith('$$')) {
            formula = formula.substring(2, formula.length - 2);
        } else if (formula.startsWith('$') && formula.endsWith('$')) {
            formula = formula.substring(1, formula.length - 1);
        }

        // Handle TeX delimiters \( \) \[ \]
        // First, check if the formula is wrapped in these delimiters and remove them
        // MathJax-node will process the formula in display mode regardless
        if ((formula.startsWith('\\(') && formula.endsWith('\\)')) || 
            (formula.startsWith('\\[') && formula.endsWith('\\]'))) {
            formula = formula.substring(2, formula.length - 2);
        }
        
        // If there are any remaining escaped delimiters in the formula, clean them up
        if (formula.includes('\\(') || formula.includes('\\)') || 
            formula.includes('\\[') || formula.includes('\\]')) {
            formula = formula.replace(/\\\(/g, '(')
                       .replace(/\\\)/g, ')')
                       .replace(/\\\[/g, '[')
                       .replace(/\\\]/g, ']');
        }
        
        // Escape literal dollar signs in text to prevent them from being treated as delimiters
        // This is important for currency values like $2.50
        // In LaTeX, dollar signs should be escaped with a backslash: \$
        formula = formula.replace(/([^\\])\$(\d)/g, '$1\\$$2');
        
        // Make sure any already escaped dollar signs (\$) are properly formatted
        // This ensures that \$ is preserved as a literal dollar sign in the output
        if (formula.includes('\\$')) {
            formula = formula.replace(/\\\$/g, '\\$');
        }
        
        // Handle \text{} command - ensure it's properly processed
        // Replace \text with \textrm which has better support in MathJax-node
        if (formula.includes('\\text{')) {
            formula = formula.replace(/\\text\{/g, '\\textrm{');
        }
        
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
        
        // Process the formula with MathJax-Node
        const result = await new Promise((resolve, reject) => {
            mjAPI.typeset({
                math: formula,
                format: "TeX",
                svg: true,
                ex: 6,
                width: 100,
                linebreaks: true,
            }, function(data) {
                if (!data.errors) {
                    resolve(data);
                } else {
                    console.error('MathJax Error:', data.errors);
                    reject(new Error(data.errors));
                }
            });
        });

        // Get the SVG content
        let svgContent = result.svg;
        
        // Fix any XML entity issues by replacing problematic entities
        svgContent = svgContent
            .replace(/&nbsp;/g, ' ')  // Replace &nbsp; with space
            .replace(/&(?!(amp|lt|gt|quot|apos);)/g, '&amp;');  // Properly escape ampersands
        
        // Make sure the SVG has proper XML declaration
        if (!svgContent.startsWith('<?xml')) {
            svgContent = '<?xml version="1.0" standalone="no"?>\n' + svgContent;
        }
        
        // Apply text color if different from default black
        if (textColor !== '#000000') {
            svgContent = svgContent.replace(/<svg/, `<svg style="color: ${textColor};"`)                                   
                                  .replace(/fill="currentColor"/g, `fill="${textColor}"`)                                   
                                  .replace(/stroke="currentColor"/g, `stroke="${textColor}"`);
        }
        
        // Check if we need to convert to PNG (for compatibility)
        const format = req.query.format || '';
        if (format.toLowerCase() === 'png') {
            // Convert SVG to PNG using svg2img
            svg2img(svgContent, (error, buffer) => {
                if (error) {
                    console.error('Error converting SVG to PNG:', error);
                    res.status(500).send('Error converting formula to PNG');
                    return;
                }
                
                // Set the content type to PNG
                res.setHeader('Content-Type', 'image/png');
                res.send(buffer);
            });
        } else {
            // Set the content type to SVG
            res.setHeader('Content-Type', 'image/svg+xml');
            res.send(svgContent);
        }
    } catch (error) {
        console.error('Error processing formula:', error);
        
        // Create a fallback SVG for error cases
        const errorSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="50">
            <text x="10" y="30" fill="#000000" font-family="monospace">
                Error rendering formula
            </text>
        </svg>`;
        
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(errorSvg);
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
