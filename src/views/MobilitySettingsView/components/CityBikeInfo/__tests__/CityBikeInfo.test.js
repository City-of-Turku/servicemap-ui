/* eslint-disable max-len */
// Link.react.test.js
import React from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { IntlProvider } from 'react-intl';
import themes from '../../../../../themes';
import CityBikeInfo from '../index';
import { initialState } from '../../../../../redux/reducers/user';
import finnishTranslations from '../../../../../i18n/fi';

// Mock props for intl provider
const intlMock = {
  locale: 'fi',
  messages: finnishTranslations,
};

const mockStore = configureStore([]);

const mockProps = {
  bikeInfo: {
    paragraph1: 'mobilityPlatform.info.cityBikes.paragraph.1',
    paragraph2: 'mobilityPlatform.info.cityBikes.paragraph.2',
    subtitle: 'mobilityPlatform.info.cityBikes.subtitle',
    link: 'mobilityPlatform.info.cityBikes.link',
    apiInfo: 'mobilityPlatform.info.cityBikes.apiInfo',
    url: {
      fi: 'https://foli.fi/föllärit',
      en: 'https://www.foli.fi/en/f%C3%B6li-bikes',
      sv: 'https://www.foli.fi/sv/fölicyklar',
    },
  },
};

// eslint-disable-next-line react/prop-types
const Providers = ({ children }) => {
  const store = mockStore({
    user: initialState,
  });

  return (
    <Provider store={store}>
      <IntlProvider {...intlMock}>
        <MuiThemeProvider theme={themes.SMTheme}>{children}</MuiThemeProvider>
      </IntlProvider>
    </Provider>
  );
};

const renderWithProviders = component => render(component, { wrapper: Providers });

describe('<CityBikeInfo />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<CityBikeInfo {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<CityBikeInfo {...mockProps} />);

    const p = container.querySelectorAll('p');
    const link = container.querySelector('a');
    expect(p[0].textContent).toEqual(
      'Turun kaupunkipyörät eli tuttavallisemmin föllärit, ovat pyöriä, joita kuka vaan voi vuokrata Donkey Republicin sovelluksella.  Föllärin voi vuokrata kertamaksulla, kuukausimaksulla tai koko kesän kattavalla kausimaksulla.',
    );
    expect(p[1].textContent).toEqual(
      'Jos sinulla on käytössä Fölin kausikortti, jonka kausi on vähintään 30 päivää, sisältää oikeuden käyttää fölläreitä tunnin ajan kerrallaan maksutta. Vuokrattavia pyöriä on 700 ja asemia yli 70 kappaletta.',
    );
    expect(p[2].textContent).toEqual('Lue lisää kaupunkipyöristä:');
    expect(link.textContent).toEqual('https://foli.fi/föllärit');
    expect(p[4].textContent).toEqual('Kartan tiedot tulevat Donkey Republicin rajapinnasta reaaliajassa.');
  });

  it('does contain aria-label attributes', () => {
    const { container } = renderWithProviders(<CityBikeInfo {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].getAttribute('aria-label')).toEqual(
      'Turun kaupunkipyörät eli tuttavallisemmin föllärit, ovat pyöriä, joita kuka vaan voi vuokrata Donkey Republicin sovelluksella.  Föllärin voi vuokrata kertamaksulla, kuukausimaksulla tai koko kesän kattavalla kausimaksulla.',
    );
    expect(p[1].getAttribute('aria-label')).toEqual(
      'Jos sinulla on käytössä Fölin kausikortti, jonka kausi on vähintään 30 päivää, sisältää oikeuden käyttää fölläreitä tunnin ajan kerrallaan maksutta. Vuokrattavia pyöriä on 700 ja asemia yli 70 kappaletta.',
    );
    expect(p[2].getAttribute('aria-label')).toEqual('Lue lisää kaupunkipyöristä:');
    expect(p[3].getAttribute('aria-label')).toEqual('https://foli.fi/föllärit');
    expect(p[4].getAttribute('aria-label')).toEqual('Kartan tiedot tulevat Donkey Republicin rajapinnasta reaaliajassa.');
  });
});
