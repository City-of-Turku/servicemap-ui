/* eslint-disable */
import { Selector, ClientFunction } from 'testcafe';
import { waitForReact, ReactSelector } from 'testcafe-react-selectors';

import config from '../config';
const { server } = config;

fixture`Mobility map view test`.page`http://${server.address}:${server.port}/fi/mobility`.beforeEach(async () => {
  await waitForReact();
});

test('Render buttons', async t => {
  const mainButtons = ReactSelector('button');
  const outlinedButton = mainButtons.find('button[variant="outlined"]');

  await t.expect(outlinedButton.exists).ok;
});

test('Render texts', async t => {
  const mainTexts = ReactSelector('p');
  const count = mainTexts.count;

  for (let i = 0; i < count; i++) {
    const b = mainTexts.nth(i);
    const text = await b.find('p[variant="body2"]');
    const textExists = text.exists;

    await t.expect(textExists).ok();
  }
});

test('Single button properties', async t => {
  const mainButtons = ReactSelector('button');
  const count = mainButtons.count;

  for (let i = 0; i < count; i++) {
    const b = mainButtons.nth(i);
    const button = await b.find('button');
    const buttonExists = button.exists;

    await t
      .expect(buttonExists)
      .ok()
      .expect(b.getStyleProperty('background'))
      .eql('rgba(245, 245, 245, 255)')
      .expect(b.getStyleProperty('width'))
      .eql('100%');
  }
});

test('Render icons', async t => {
  const mainIcons = ReactSelector('svg');
  const count = mainIcons.count;

  for (let i = 0; i < count; i++) {
    const b = mainIcons.nth(i);
    const icon = await b.find('svg');
    const iconExists = icon.exists;

    await t.expect(iconExists).ok();
  }
});

test('Render switch labels', async t => {
  const mainLabels = ReactSelector('label');
  const count = mainLabels.count;

  for (let i = 0; i < count; i++) {
    const b = mainLabels.nth(i);
    const label = await b.find('label');
    const labelExists = label.exists;

    await t.expect(labelExists).ok();
  }
});