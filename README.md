# Google Charts API Text Formula Replacement

This project provides a simple drop-in replacement for the Google Charts API text formula rendering functionality. It allows you to replace the Google Charts domain with your own domain while maintaining the exact same functionality and URL structure.

## Features

- Direct replacement for `https://chart.googleapis.com/chart?cht=tx` URLs
- No client-side JavaScript required
- Server-side rendering using MathJax
- Preserves all URL parameters and styling options
- Support for both SVG and PNG output formats
- Simple status page with usage examples

## How It Works

This solution works by setting up a server that handles the same URL pattern as the Google Charts API. You simply need to replace the domain in your image URLs from `chart.googleapis.com` to your own domain, and everything else works exactly the same.

For example, change:
```
https://chart.googleapis.com/chart?cht=tx&chl=f(x) = \sum_{n=0}^{\infty} a_n x^n
```

To:
```
https://google-charts-formulas.vercel.app/chart?cht=tx&chl=f(x) = \sum_{n=0}^{\infty} a_n x^n
```

The server handles the request and generates an image of the formula (SVG or PNG), just like the Google Charts API does.

SVG format is used by default.
For PNG format, add the `&format=png` parameter to the URL. Example:

```
https://google-charts-formulas.vercel.app/chart?cht=tx&chl=f(x) = \sum_{n=0}^{\infty} a_n x^n&format=png
```

## Usage
This is a drop-in replacement for the Google Charts API text formula rendering. To use it just replace the old chart google apis url `https://chart.googleapis.com/chart` with this `https://google-charts-formulas.vercel.app`. The old formulas broken becuase of the deprecation of the google service will work again. 


Example:

Original Google Charts URL:
https://chart.googleapis.com/chart?cht=tx&chl=f(x) = \sum_{n=0}^{\infty} a_n x^n


Replacement URL:
https://google-charts-formulas.vercel.app/chart?cht=tx&chl=f(x) = \sum_{n=0}^{\infty} a_n x^n


## Graphic charts:
This project is not related to graphic charts, just to text formulas. If you need to render graphic charts, you can use this project that covers that: https://quickchart.io/


## Inspiration
I was following a mathematics course and I found all the formulas broken because of Google Charts discontinuation of the service. This project was born to fix the text formulas that were broken and provide a drop-in replacement for the Google Charts API text formula rendering functionality.



## Development

### Prerequisites

- Node.js (version 20)
- npm

### Install and run

1. Clone this repository or download the files
2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm run dev
```

The server will run on port 3000 by default. You can change this by setting the PORT environment variable.



