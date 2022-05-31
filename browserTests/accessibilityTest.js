/* eslint-disable */
import axeCheck from 'axe-testcafe';
import config from './config';
import focusIndicatorTest from './focusIndicatorTest';
import componentContrastTest from './componentContrastTest';
import {waitForReact} from 'testcafe-react-selectors';

const { server } = config;

const axeOptions = { rules: { label: { enabled: false } } };

const axeCheckHandler = t => {
  return axeCheck(t, null, axeOptions);
};

fixture`TestCafe Axe test: frontpage`
    .page`http://${server.address}:${server.port}/fi/`
    .beforeEach(async () => {
      await waitForReact();
    });

test('Automated accessibility testing', async t => {
  await axeCheckHandler(t);
});

focusIndicatorTest();
componentContrastTest('SMButton');
componentContrastTest('BackButton');

fixture`TestCafe Axe test: search page`
    .page`http://${server.address}:${server.port}/fi/search?q=kirjasto`
    .beforeEach(async () => {
        await waitForReact();
    });

test('Automated accessibility testing', async t => {
  await axeCheckHandler(t);
});

focusIndicatorTest();
componentContrastTest('SMButton');
componentContrastTest('BackButton');

fixture`TestCafe Axe test: unit page`
    .page`http://${server.address}:${server.port}/fi/unit/148`
    .beforeEach(async() => {
      await waitForReact();
    });

test('Automated accessibility testing', async t => {
  await axeCheckHandler(t);
});

focusIndicatorTest();
componentContrastTest('SMButton');
componentContrastTest('BackButton');

fixture`TestCafe Axe test: service page`
    .page`http://${server.address}:${server.port}/fi/service/279`
    .beforeEach(async() => {
        await waitForReact();
    });

test('Automated accessibility testing', async t => {
  await axeCheckHandler(t);
});

focusIndicatorTest();
componentContrastTest('SMButton');
componentContrastTest('BackButton');

fixture`TestCafe Axe test: address page`
    .page`http://${server.address}:${config.server.port}/fi/address/turku/Aurakatu/1`
    .beforeEach(async() => {
        await waitForReact();
    });

test('Automated accessibility testing', async t => {
  await axeCheckHandler(t);
});

focusIndicatorTest();
componentContrastTest('SMButton');
componentContrastTest('BackButton');

fixture`TestCafe Axe test: area page`
    .page`http://${server.address}:${config.server.port}/fi/area`
    .beforeEach(async() => {
        await waitForReact();
    });
test('Automated accessibility testing', async t => {
  await axeCheckHandler(t);
});

focusIndicatorTest();
componentContrastTest('SMButton');
componentContrastTest('BackButton');

fixture`TestCafe Axe test: service tree page`
    .page`http://${server.address}:${server.port}/fi/services`
    .beforeEach(async() => {
      await waitForReact();
    });

test('Automated accessibility testing', async t => {
  await axeCheckHandler(t);
});

focusIndicatorTest();
componentContrastTest('SMButton');
componentContrastTest('BackButton');

// This page expires when the event is done
// Turku does not yet have events API linked into units.
/* fixture`TestCafe Axe test: event page`.page`http://${server.address}:${server.port}/fi/event/helmet:190724`;

test('Automated accessibility testing', async t => {
  await axeCheckHandler(t);
});

focusIndicatorTest();
componentContrastTest('SMButton');
componentContrastTest('BackButton'); */

// Mobility platform page
fixture`TestCafe Axe test: mobility platform page`
    .page`http://${server.address}:${server.port}/fi/mobility`
    .beforeEach(async() => {
      await waitForReact();
    });

test('Automated accessibility testing', async t => {
  await axeCheckHandler(t);
});

componentContrastTest('SMButton');
componentContrastTest('BackButton');
