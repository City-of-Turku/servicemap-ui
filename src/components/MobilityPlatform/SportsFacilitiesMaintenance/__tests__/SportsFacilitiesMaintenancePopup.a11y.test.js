import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider, useIntl } from 'react-intl';
import { ThemeProvider } from '@mui/material/styles';
import finnish from '../../../../i18n/fi';
import themes from '../../../../themes';
import {
  IceDescriptionSection,
  MaintenancePopupRow,
  SportsFacilityPopupFrame,
  SharedSportsMaintenancePopupRows,
} from '../SportsFacilitiesMaintenance';

const intlFi = {
  locale: 'fi',
  messages: finnish,
  wrapRichTextChunksInFragment: false,
};

function renderWithIntl(ui) {
  return render(
    <IntlProvider
      locale={intlFi.locale}
      messages={intlFi.messages}
      wrapRichTextChunksInFragment={intlFi.wrapRichTextChunksInFragment}
    >
      <ThemeProvider theme={themes.SMThemeTku}>{ui}</ThemeProvider>
    </IntlProvider>,
  );
}

describe('Sports facilities maintenance popup (a11y structure)', () => {
  it('SportsFacilityPopupFrame exposes titled section for screen readers', () => {
    renderWithIntl(
      <SportsFacilityPopupFrame title="Test latu">
        <p>Child</p>
      </SportsFacilityPopupFrame>,
    );
    const heading = screen.getByRole('heading', { level: 4, name: 'Test latu' });
    expect(heading).toBeInTheDocument();
    expect(heading.id).toBeTruthy();
    const region = heading.closest('section');
    expect(region).toHaveAttribute('aria-labelledby', heading.id);
  });

  it('MaintenancePopupRow uses definition list for term / definition', () => {
    const { container } = renderWithIntl(
      <MaintenancePopupRow labelText="Pituudet" value="1,4 km" />,
    );
    expect(container.querySelector('dt')).toHaveTextContent('Pituudet');
    expect(container.querySelector('dd')).toHaveTextContent('1,4 km');
  });

  it('IceDescriptionSection uses region and labelled heading', () => {
    renderWithIntl(
      <IceDescriptionSection title="Kuvaus" rawHtml="<p>Sisältö</p>" />,
    );
    const subheading = screen.getByRole('heading', { level: 5, name: 'Kuvaus' });
    expect(subheading).toBeInTheDocument();
    const region = subheading.closest('section');
    expect(region).toHaveAttribute('aria-labelledby', subheading.id);
    expect(region).toHaveAttribute('lang', 'fi');
  });

  it('SharedSportsMaintenancePopupRows renders conditioned row from maintenance', () => {
    const Harness = () => {
      const intl = useIntl();
      return (
        <SharedSportsMaintenancePopupRows
          maintenance={{ condition: 'USABLE', maintained_at: '2024-01-15T12:00:00Z' }}
          intl={intl}
          note="Huom"
        />
      );
    };
    renderWithIntl(<Harness />);
    expect(screen.getByText('Huom')).toBeInTheDocument();
    expect(screen.getByText(finnish['mobilityPlatform.popup.conditioned.yes'])).toBeInTheDocument();
  });
});
