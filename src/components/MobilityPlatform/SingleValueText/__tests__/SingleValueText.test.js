// Link.react.test.js
import React from 'react';
import SingleValueText from '../index';
import { initialState } from '../../../../redux/reducers/user';
import { getRenderWithProviders } from '../../../../../jestUtils';

const mockProps = {
  messageId: 'mobilityPlatform.content.address',
  textObj: {
    address_fi: 'Testikatu',
    address_en: 'Test street',
    address_sv: 'Test gata',
  },
};

const renderWithProviders = getRenderWithProviders({
  user: initialState,
});

describe('<SingleValueText />', () => {
  it('should match snapshot', () => {
    const { container } = renderWithProviders(<SingleValueText {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<SingleValueText {...mockProps} />);

    const p = container.querySelectorAll('p');
    expect(p[0].textContent).toContain(`Osoite: ${mockProps.textObj.address_fi}`);
  });
});
