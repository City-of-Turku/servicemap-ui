/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { getRenderWithProviders } from '../../../../../../jestUtils';
import finnishTranslations from '../../../../../i18n/fi';
import SkiTrailsList from '../SkiTrailsList';

const mockProps = {
  openSkiTrailsList: true,
  isActive: true,
  skiTrailsPeriod: '',
  skiTrailsSelections: [],
};

const renderWithProviders = getRenderWithProviders({});

describe('<SkiTrailsList />', () => {
  it('returns null when openSkiTrailsList is false', () => {
    const openSkiTrailsList = false;
    const { container } = renderWithProviders(<SkiTrailsList {...mockProps} openSkiTrailsList={openSkiTrailsList} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows main info text correctly', () => {
    const { container } = renderWithProviders(<SkiTrailsList {...mockProps} />);
    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toContain(finnishTranslations['mobilityPlatform.menu.skiTrails.info']);
  });

  it('shows no activity info text correctly when not active and period is defined', () => {
    const { getByText } = renderWithProviders(
      <SkiTrailsList {...mockProps} isActive={false} skiTrailsPeriod="someperiod" />,
    );
    expect(getByText(finnishTranslations['mobilityPlatform.info.skiTrails.noActivity'])).toBeInTheDocument();
  });

  it('shows option labels when there are options', () => {
    const skiTrailsSelections = [
      {
        msgId: 'mobilityPlatform.menu.streetMaintenance.1day',
        onChangeValue: () => {},
        type: '1day',
      },
      {
        msgId: 'mobilityPlatform.menu.streetMaintenance.3days',
        onChangeValue: () => {},
        type: '3days',
      },
    ];
    const { getByText } = renderWithProviders(
      <SkiTrailsList {...mockProps} skiTrailsSelections={skiTrailsSelections} />,
    );
    expect(getByText(finnishTranslations['mobilityPlatform.menu.streetMaintenance.1day'])).toBeInTheDocument();
    expect(getByText(finnishTranslations['mobilityPlatform.menu.streetMaintenance.3days'])).toBeInTheDocument();
  });
});
