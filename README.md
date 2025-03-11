# Google Charts API Text Formula Replacement

This project provides a simple drop-in replacement for the Google Charts API text formula rendering functionality. It allows you to replace the Google Charts domain with your own domain while maintaining the exact same functionality and URL structure.

## Features

- Direct replacement for `https://chart.googleapis.com/chart?cht=tx` URLs
- No client-side JavaScript required
- Server-side rendering using MathJax
- Preserves all URL parameters and styling options
- Simple status page with usage examples

## How It Works

This solution works by setting up a server that handles the same URL pattern as the Google Charts API. You simply need to replace the domain in your image URLs from `chart.googleapis.com` to your own domain, and everything else works exactly the same.

For example, change:
```
https://chart.googleapis.com/chart?cht=tx&chf=a,s,000000|bg,s,FFFFFF00&chl=%5Cforall%2C%20%5Cexists
```

To:
```
https://your-domain.com/chart?cht=tx&chf=a,s,000000|bg,s,FFFFFF00&chl=%5Cforall%2C%20%5Cexists
```

The server handles the request and generates an SVG image of the formula, just like the Google Charts API does.

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm

### Setup

1. Clone this repository or download the files
2. Install dependencies:

```bash
npm install express mathjax-node canvas
```

3. Start the server:

```bash
node server.js
```

The server will run on port 3000 by default. You can change this by setting the PORT environment variable.

## Deployment

### Deploying to Vercel

This project is pre-configured for deployment on Vercel. Follow these steps to deploy:

1. Install the Vercel CLI (if you haven't already):

```bash
npm install -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy the project:

```bash
vercel
```

Alternatively, you can deploy directly from the Vercel dashboard:

1. Push your code to a GitHub, GitLab, or Bitbucket repository
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click on 'New Project'
4. Import your repository
5. Keep the default settings (the project includes a `vercel.json` configuration file)
6. Click 'Deploy'

After deployment, Vercel will provide you with a domain (e.g., `https://your-project.vercel.app`). Update your image URLs to use this domain instead of `chart.googleapis.com`.

### Other Deployment Options

You can also deploy this service to other Node.js hosting platforms such as:

- Heroku
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- Google Cloud Run

Just make sure to configure the platform to run the `npm start` command.

## Usage Examples

### In HTML

```html
<!-- Original Google Charts API URL -->
<img src="https://chart.googleapis.com/chart?cht=tx&chl=E%3Dmc%5E2">

<!-- Replacement URL (your server) -->
<img src="https://your-domain.com/chart?cht=tx&chl=E%3Dmc%5E2">
```

### In Markdown

```markdown
![Einstein's equation](https://your-domain.com/chart?cht=tx&chl=E%3Dmc%5E2)
```

### With Styling Parameters

The server supports the same styling parameters as the Google Charts API:

```html
<!-- Black text on transparent background -->
<img src="https://your-domain.com/chart?cht=tx&chf=a,s,000000|bg,s,FFFFFF00&chl=%5Cforall%20x%20%5Cin%20%5Cmathbb%7BR%7D%5C%3A%5Cexists%20y%20%5Cgeq%20x">

<!-- Blue text -->
<img src="https://your-domain.com/chart?cht=tx&chf=a,s,0000FF|bg,s,FFFFFF00&chl=%5Cint_%7B0%7D%5E%7B%5Cinfty%7D%20e%5E%7B-x%7D%20dx%20%3D%201">
```

## Testing

After starting the server, navigate to `http://localhost:3000` in your browser to see a status page with usage examples.

## License

MIT
