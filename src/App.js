/* eslint-disable react/forbid-prop-types */
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { IntlProvider, useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material';
import appStyles from './App.css';
import DataFetcher from './components/DataFetchers/DataFetcher';
import Navigator from './components/Navigator';
import HSLFonts from './hsl-icons.css';
import styles from './index.css';
import DefaultLayout from './layouts';
import EmbedLayout from './layouts/EmbedLayout';
import printCSS from './print.css';
import { changeLocaleAction } from './redux/actions/user';
import { getLocale } from './redux/selectors/locale';
import SMFonts from './service-map-icons.css';
import isClient from './utils';
import { MobilityPlatformContextProvider } from './context/MobilityPlatformContext';
import EmbedderView from './views/EmbedderView';

import '@formatjs/intl-pluralrules/dist/locale-data/en';
import '@formatjs/intl-pluralrules/dist/locale-data/fi';
import '@formatjs/intl-pluralrules/dist/locale-data/sv';
import '@formatjs/intl-pluralrules/polyfill';

import '@formatjs/intl-relativetimeformat/dist/locale-data/en';
import '@formatjs/intl-relativetimeformat/dist/locale-data/fi';
import '@formatjs/intl-relativetimeformat/dist/locale-data/sv';
import '@formatjs/intl-relativetimeformat/polyfill';
import config from '../config';
import ogImage from './assets/images/servicemap-meta-img.png';
import ThemeWrapper from './themes/ThemeWrapper';
import LocaleUtility from './utils/locale';

// General meta tags for app
const MetaTags = () => {
  const intl = useIntl();
  return (
    <Helmet>
      <meta property="og:site_name" content={intl.formatMessage({ id: 'app.title' })} />
      {
        isClient() && <meta property="og:url" content={window.location} />
      }
      <meta property="og:description" content={intl.formatMessage({ id: 'app.description' })} />
      <meta property="og:image" data-react-helmet="true" content={ogImage} />
      <meta name="twitter:card" data-react-helmet="true" content="summary" />
      <meta name="twitter:image:alt" data-react-helmet="true" content={intl.formatMessage({ id: 'app.og.image.alt' })} />
    </Helmet>
  );
};

class App extends React.Component {
  // Remove the server-side injected CSS.
  componentDidMount() {
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { locale } = this.props;
    const intlData = LocaleUtility.intlData(locale);

    return (
      <StyledEngineProvider injectFirst>
        <ThemeWrapper>
          <IntlProvider {...intlData}>
            <MetaTags />
            {/* <StylesProvider generateClassName={generateClassName}> */}
            <div className="App">
              <MobilityPlatformContextProvider>
                <Switch>
                  <Route path="*/embedder" component={EmbedderView} />
                  <Route path="*/embed" component={EmbedLayout} />
                  <Route render={() => <DefaultLayout />} />
                </Switch>
              </MobilityPlatformContextProvider>
              <Navigator />
              <DataFetcher />
            </div>
            {/* </StylesProvider> */}
          </IntlProvider>
        </ThemeWrapper>
      </StyledEngineProvider>
    );
  }
}

// Listen to redux state
const mapStateToProps = (state) => {
  const locale = getLocale(state);
  return {
    locale,
  };
};

const ConnectedApp = connect(
  mapStateToProps,
  { changeLocaleAction },
)(App);

// Wrapper to get language route
const LanguageWrapper = () => {
  if (isClient()) {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/:lng" component={ConnectedApp} />
        </Switch>
      </BrowserRouter>
    );
  }

  return (
    <Switch>
      <Route path="/:lng" component={ConnectedApp} />
    </Switch>
  );
};

export default withStyles(styles, appStyles, SMFonts, HSLFonts, printCSS)(LanguageWrapper);

// Typechecking
App.propTypes = {
  match: PropTypes.object.isRequired,
  locale: PropTypes.oneOf(config.supportedLanguages).isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  changeLocaleAction: PropTypes.func.isRequired,
};
