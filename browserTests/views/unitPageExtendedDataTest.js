/* eslint-disable */
import { ReactSelector } from 'testcafe-react-selectors';
import { TitleBarTitleSelector } from '../constants';
import { getBaseUrl } from '../utility';

const pages = [
  `${getBaseUrl()}/fi/unit/148/events`,
  `${getBaseUrl()}/fi/unit/148/services`,
  `${getBaseUrl()}/fi/unit/148/reservations`
];

const unitName = 'Pääkirjasto';

// Common tests for all list pages
fixture`Unit view extended data title and map tests`
pages.forEach(page => {
  test
    .page(page)
    (`Page: ${page} has correct title`, async (t) => {
      const title = TitleBarTitleSelector();
    
      await t
        .expect(title.textContent).ok('Title text should exist')
        .expect(title.textContent).contains(unitName, 'Title text should contain unit name')
    })
  test
    .page(page)
    (`Page: ${page} displays unit on map`, async (t) => {
      const markers = ReactSelector('MarkerCluster');    
      const markerList = await markers.getReact(({props}) => props.data);
    
      await t
        .expect(markerList.length).gt(0, 'no unit marker on map')
        .expect(markerList.length).lt(2, 'too many unit markers on map')
    })
})

