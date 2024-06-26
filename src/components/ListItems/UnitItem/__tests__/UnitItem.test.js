import React from 'react';
import { getRenderWithProviders } from '../../../../../jestUtils';
import { initialState } from '../../../../redux/reducers/user';
import UnitItem from '../index';

const mockData = {
  accessibility_properties: [],
  accessibility_shortcoming_count: {},
  contract_type: {
    id: 'municipal_service',
    description: { fi: 'kunnallinen palvelu', sv: 'kommunal tjänst', en: 'municipal service' },
  },
  id: 148,
  municipality: 'Turku',
  name: { fi: 'Pääkirjasto', sv: 'Huvudbiblioteket', en: 'The Main Library' },
  object_type: 'unit',
  street_address: { fi: 'Linnankatu 2', sv: 'Slottsgatan 2', en: 'Linnankatu 2' },
};

// Generic required props for SimpleListItem
const mockProps = {
  unit: mockData,
  onClick: () => {},
  simpleItem: false,
};

const renderWithProviders = getRenderWithProviders({
  user: initialState,
  settings: {},
});

describe('<UnitItem />', () => {
  it('should work', () => {
    const { container } = renderWithProviders(<UnitItem {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does render accessibility attributes correctly', () => {
    const { container } = renderWithProviders(<UnitItem {...mockProps} />);
    const items = container.querySelectorAll('li');
    const firstItem = items[0];
    const firstItemSRText = firstItem.querySelectorAll('p')[0];
    const firstItemResultTitle = firstItem.querySelectorAll('p')[1];
    const dividerItem = items[1];

    // List item's image should be aria-hidden
    expect(firstItem.querySelector('img').getAttribute('aria-hidden')).toBeTruthy();
    expect(firstItem.getAttribute('role')).toEqual('link');
    expect(firstItem.getAttribute('tabIndex')).toEqual('0');
    expect(firstItemSRText.className.indexOf('ResultItem-title') > 0).toBeTruthy();
    expect(firstItemResultTitle.className.indexOf('ResultItem-title') > 0).toBeTruthy();
    expect(firstItemResultTitle.getAttribute('aria-hidden')).toBeTruthy();
    expect(dividerItem.getAttribute('aria-hidden')).toBeTruthy();
  });
});
