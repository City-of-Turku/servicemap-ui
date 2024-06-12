// Link.react.test.js
import React from 'react';
import { getRenderWithProviders } from '../../../../../../../jestUtils';
import finnishTranslations from '../../../../../../i18n/fi';
import PortInfoContent from '../index';

const mockProps = {
  portItem: {
    properties: {
      portAreaName: 'Testisatama',
    },
  },

  portCalls: [
    {
      portCallId: 12340,
      portCallTimestamp: '2024-06-06T05:00:00z',
      vesselName: 'Testilaiva',
      portAreaDetails: [
        {
          eta: '2024-06-06T04:35:00z',
          etd: '2024-06-06T05:55:00z',
        },
      ],
    },
  ],
};

const renderWithProviders = getRenderWithProviders({});

describe('<PortInfoContent />', () => {
  it('should match snapshot', () => {
    const { container } = renderWithProviders(<PortInfoContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text', () => {
    const { container } = renderWithProviders(<PortInfoContent {...mockProps} />);
    const p = container.querySelectorAll('p');
    const h4 = container.querySelector('h4');
    const h5 = container.querySelectorAll('h5');
    expect(h4.textContent).toContain(mockProps.portItem.properties.portAreaName);
    expect(h5[0].textContent).toContain(finnishTranslations['mobilityPlatform.content.portInfo.arrivals']);
    expect(h5[1].textContent).toContain(finnishTranslations['mobilityPlatform.content.portInfo.departing']);
    expect(p[0].textContent).toContain(mockProps.portCalls[0].vesselName);
    expect(p[1]).toBeInTheDocument();
    expect(p[3]).toBeInTheDocument();
  });

  it('does show span elements', () => {
    const { container } = renderWithProviders(<PortInfoContent {...mockProps} />);
    const span = container.querySelectorAll('span');
    expect(span[0]).toBeInTheDocument();
    expect(span[1]).toBeInTheDocument();
  });
});
