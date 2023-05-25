/* eslint-disable no-underscore-dangle */
import * as Sentry from '@sentry/react';
import ac from 'abortcontroller-polyfill';
import 'core-js/stable';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import { CacheProvider } from '@emotion/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import 'regenerator-runtime/runtime';
import 'whatwg-fetch';
import config from '../config';
import App from '../src/App';
import favicon from '../src/assets/icons/favicon.ico';
import rootReducer from '../src/redux/rootReducer';
import LocalStorageUtility from '../src/utils/localStorage';
import SettingsUtility from '../src/utils/settings';
import createEmotionCache from '../server/createEmotionCache';

if (config.sentryDSN) {
  Sentry.init({
    dsn: config.sentryDSN,
    ignoreErrors: [
      'AbortError',
      // Ignore fetch related common errors
      /TypeError: (Kumottu|cancelled)/,
      'TypeError: Failed to fetch',
      'TypeError: NetworkError when attempting to fetch resource.',
      /adrum/,
    ],
  });
}

if (!global.AbortController) {
  global.AbortController = ac.AbortController;
}

const getPreloadedState = () => {
  const state = window.PRELOADED_STATE;
  // Allow the passed state to be garbage-collected
  delete window.PRELOADED_STATE;

  // Handle settings fetch from localStorage
  const settings = SettingsUtility.getSettingsFromLocalStorage();
  state.settings = settings;

  // Set correct theme from localStorage
  const theme = LocalStorageUtility.getItem('theme');
  if (theme) {
    state.user.theme = theme;
  }

  return state;
};

const preloadedState = getPreloadedState();

// Create Redux store with initial state
const store = createStore(rootReducer, preloadedState, applyMiddleware(thunk));

const app = document.getElementById('app');

const insertCss = (...styles) => {
  const removeCss = styles.map(style => style._insertCss());
  return () => removeCss.forEach(dispose => dispose());
};

// Create cache object which will inject emotion styles from cache
const cache = createEmotionCache();

function Main() {
  // Remove server side styles
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <CacheProvider value={cache}>
      <Provider store={store}>
        {/* Provider to help with isomorphic style loader */}
        <StyleContext.Provider value={{ insertCss }}>
          {
            // HTML head tags
          }
          <Helmet>
            <link rel="shortcut icon" href={favicon} />
          </Helmet>
          <App />
        </StyleContext.Provider>
      </Provider>
    </CacheProvider>
  );
}

ReactDOM.hydrate(<Main />, app);
