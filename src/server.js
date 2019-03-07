/* eslint-disable no-underscore-dangle */
import express from 'express';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import thunk from 'redux-thunk';
import config from '../config';
import rootReducer from './rootReducer';
import App from './App';
import I18n from './i18n';

// Configure constants
const app = express();
const serverConfig = config.server;
const allowedUrls = [
  /^\/.{2,}\/$/,
  /^\/.{2,}\/unit\/\d+$/,
  /^\/.{2,}\/unit$/,
  /^\/.{2,}\/search$/,
  /^\/.{2,}\/address\/[^\/]+\/[^\/]+\/[^\/]+$/,
  /^\/.{2,}\/division\/[^\/]+\/[^\/]+$/,
  /^\/.{2,}\/division$/,
  /^\/.{2,}\/area$/,
];

const handleRequestRedirect = (req, res) => {
  // Check if request url is actual path
  let match = false;
  allowedUrls.forEach((url) => {
    if (!match && req.path.match(url)) {
      match = true;
    }
  });

  // Handle language check and redirect if language is changed to default
  const i18n = new I18n();
  const pathArray = req.url.split('/');
  if (match && !i18n.isValidLocale(pathArray[1])) {
    pathArray[1] = i18n.locale;
    res.redirect(pathArray.join('/'));
    return true;
  }
};

app.use(express.static(path.resolve(__dirname, 'src')));

const htmlTemplate = (reactDom, preloadedState, css) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>React SSR</title>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.4.0/dist/leaflet.css"
      integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
      crossorigin=""
        />
      <script 
        src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js"
        integrity="sha512-QVftwZFqvtRNi0ZyCtsznlKSWOStnDORoefr1enyq5mVL4tmKB3S/EnC3rRJcxCPavG10IcrVGSmPh6Qw5lwrg=="
        crossorigin="">
      </script>
    </head>

    <body>
      <div id="app">${reactDom}</div>
      <style>${[...css].join('')}</style>
      <script>
        // WARNING: See the following for security issues around embedding JSON in HTML:
        // http://redux.js.org/recipes/ServerRendering.html#security-considerations
        window.PRELOADED_STATE = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
      </script>
      <script src="/index.js"></script>
    </body>
  </html>
`;

app.get('/*', (req, res) => {

  if(handleRequestRedirect(req, res)) {
    return;
  }

  const css = new Set(); // CSS for all rendered React components
  const insertCss = (...styles) => styles.forEach(style => css.add(style._getCss()));
  const store = createStore(rootReducer, applyMiddleware(thunk));
  const jsx = (
    <Provider store={store}>
      <StaticRouter location={req.url} context={{}}>
        <StyleContext.Provider value={{ insertCss }}>
          <App />
        </StyleContext.Provider>
      </StaticRouter>
    </Provider>
  );
  const reactDom = renderToString(jsx);

  const preloadedState = store.getState();

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(htmlTemplate(reactDom, preloadedState, css));
});

app.listen(serverConfig.port || 2048);
