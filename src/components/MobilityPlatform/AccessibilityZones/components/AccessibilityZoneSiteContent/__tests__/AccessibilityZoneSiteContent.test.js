import React from 'react';
import AccessibilityZoneSiteContent from '../index';
import { getRenderWithProviders } from '../../../../../../../jestUtils';

const renderWithProviders = getRenderWithProviders({
  user: { locale: 'fi' },
});

const groups = [
  {
    id: 'schoolsWalking-Moikoisten päiväkoti',
    transport: 'walking',
    minutes: [5, 10, 15],
    areas: [{ extra: { kulkumuoto: 'kävely, 4 km/h' } }],
  },
  {
    id: 'schoolsCycling-Moikoisten päiväkoti',
    transport: 'cycling',
    minutes: [5, 10],
    areas: [{ extra: { kulkumuoto: 'pyöräily, 10 km/h' } }],
  },
];

describe('<AccessibilityZoneSiteContent />', () => {
  it('lists the travel times of each mode of transport', () => {
    const { getByText, queryByText } = renderWithProviders(
      <AccessibilityZoneSiteContent marker={{ name: 'Moikoisten päiväkoti', approximate: false, groups }} />,
    );
    expect(getByText('Moikoisten päiväkoti')).toBeInTheDocument();
    expect(getByText('Kävely (4 km/h): 5, 10, 15 min')).toBeInTheDocument();
    expect(getByText('Pyöräily (10 km/h): 5, 10 min')).toBeInTheDocument();
    expect(queryByText('Sijainti on arvioitu saavutettavuusalueen perusteella.')).not.toBeInTheDocument();
  });

  it('tells when the location is approximate', () => {
    const { getByText } = renderWithProviders(
      <AccessibilityZoneSiteContent marker={{ name: 'Kauppatori', approximate: true, groups: [groups[0]] }} />,
    );
    expect(getByText('Sijainti on arvioitu saavutettavuusalueen perusteella.')).toBeInTheDocument();
  });
});
