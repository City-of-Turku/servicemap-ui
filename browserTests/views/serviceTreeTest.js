import { Selector } from 'testcafe';
import { waitForReact } from 'testcafe-react-selectors';

import config from '../config';
import { getLocation } from '../utility';
import finnish from '../../src/i18n/fi';
import { treeSearchTest, treeViewAccordionTest } from '../utility/TreeViewTest';

const { server } = config;

const searchBackButton = Selector('#SearchBar .SMBackButton');

/* eslint-disable */
fixture`Service tree page tests`
  .page`http://${server.address}:${server.port}/fi/services`
  .beforeEach(async () => {
    await waitForReact();
  });

treeViewAccordionTest();

test('Service tree search works correctly', async (t) => {
  await treeSearchTest(t);

  await t
    .expect(getLocation()).contains('/fi/search?service_node=')
    .expect(searchBackButton.getAttribute('aria-label')).eql(finnish['general.back.serviceTree'])
    .click(searchBackButton)
    .expect(getLocation()).contains('/fi/services')
  ;
});
