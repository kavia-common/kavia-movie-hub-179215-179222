# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

Backend API requests during development are proxied to Flask:
- We set "proxy": "http://localhost:3001" in package.json.
- Use relative paths (e.g., fetch('/api/hello')) from the frontend.

Important: After changing the proxy setting, restart the React dev server for it to take effect.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`:

```css
:root {
  --kavia-orange: #E87A41;
  --kavia-dark: #1A1A1A;
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## API Base URL Configuration

The frontend reads the backend base URL from the `REACT_APP_API_BASE_URL` environment variable.

- Local development:
  - Leave `REACT_APP_API_BASE_URL` unset or empty to use the CRA proxy to `http://localhost:3001`.
  - Keep API calls as relative paths; the dev server will forward requests to Flask.
- Preview/Production (or remote environments):
  - Set `REACT_APP_API_BASE_URL` to your remote backend URL, e.g.:
    - `https://vscode-internal-33523-beta.beta01.cloud.kavia.ai:3001`

Notes:
- The Home component calls the backend using `${API_BASE_URL}/api/hello`.
- If the env var is not set and the app is not running in development mode, it will default to the remote URL above.
- After changing `.env`, restart the React dev server for changes to take effect.

Quick start:
1. Copy `.env.example` to `.env`.
2. Edit `REACT_APP_API_BASE_URL` per your environment.
3. Restart the React dev server (`npm start`).

The `proxy` setting in `package.json` remains for local developer convenience.
