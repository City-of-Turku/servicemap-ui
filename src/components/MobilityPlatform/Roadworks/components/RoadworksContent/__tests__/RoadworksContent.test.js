/* eslint-disable max-len */
// Link.react.test.js
import React from 'react';
import { getRenderWithProviders } from '../../../../../../../jestUtils';
import { initialState } from '../../../../../../redux/reducers/user';
import RoadworksContent from '../index';

const mockProps = {
  item: {
    announcements: [
      {
        title: 'Test roadwork',
        description: 'Test desc',
        comment: 'Comment',
        additional_info: {
          restrictions: [
            {
              type: 'SPEED_LIMIT',
              restriction: {
                name: 'Test limit',
                quantity: '50',
                unit: 'km/h',
              },
            },
          ],
          timeAndDuration: {
            startTime: '2024-04-10T10:00:00z',
            endTime: '2024-06-05T17:00:00z',
          },
        },
      },
    ],
  },
};

const renderWithProviders = getRenderWithProviders({
  user: initialState,
});

describe('<RoadworksContent />', () => {
  it('does match snapshot', () => {
    const { container } = renderWithProviders(<RoadworksContent {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('does show text correctly', () => {
    const { container } = renderWithProviders(<RoadworksContent {...mockProps} />);

    const h4 = container.querySelectorAll('h4');
    const p = container.querySelectorAll('p');
    const roadworkDetails = mockProps.item.announcements[0];
    const restrictionsArray = roadworkDetails.additional_info.restrictions[0];
    expect(h4[0].textContent).toContain(roadworkDetails.title);
    expect(p[0].textContent).toContain(roadworkDetails.description);
    expect(p[1].textContent).toContain(roadworkDetails.comment);
    expect(p[2].textContent).toContain(
      `${restrictionsArray.restriction.name}: ${restrictionsArray.restriction.quantity} ${restrictionsArray.restriction.unit}`,
    );
    expect(p[3].textContent).toEqual('Aika: 10.04.2024 - 05.06.2024');
  });
});
