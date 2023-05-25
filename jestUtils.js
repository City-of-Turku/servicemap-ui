import { ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import finnish from './src/i18n/fi';
import themes from './src/themes';

const mockStore = configureStore([]);

// Mock props for intl provider
const intlMock = {
  locale: 'fi',
  messages: finnish,
  wrapRichTextChunksInFragment: false,
};

const Providers = (mockState) => ({ children }) => {
  const store = mockStore(mockState);
  return (
    <Provider store={store}>
      <IntlProvider {...intlMock}>
        <ThemeProvider theme={themes.SMTheme}>
          {children}
        </ThemeProvider>
      </IntlProvider>
    </Provider>
  );
}

export const getRenderWithProviders = mockState => component => render(component, { wrapper: Providers(mockState) });