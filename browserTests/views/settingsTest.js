/* eslint-disable */
import { Selector } from 'testcafe';
import { waitForReact } from 'testcafe-react-selectors';
import config from '../config';

const { server } = config;


fixture`Settings view tests`
  .page`http://${server.address}:${server.port}/fi/`
  .beforeEach(async () => {
    await waitForReact();
  });

test('Settings does opens and closes correctly', async (t) => {
  await t
    .expect(Selector('#senses-setting-dropdown').visible).ok()
    .expect(Selector('#mobility-setting-dropdown').visible).ok()
    .expect(Selector('#cities-setting-dropdown').visible).ok()
    // .expect(Selector('#organizations-setting-dropdown').visible).ok()
  ;

  await t
    .click(Selector('#settings-accordion'))
  ;

  await t
    .expect(Selector('#senses-setting-dropdown').visible).notOk()
    .expect(Selector('#mobility-setting-dropdown').visible).notOk()
    .expect(Selector('#cities-setting-dropdown').visible).notOk()
    // .expect(Selector('#organizations-setting-dropdown').visible).notOk()
  ;

  await t
    .click(Selector('#settings-accordion'))
  ;

  await t
    .expect(Selector('#senses-setting-dropdown').visible).ok()
    .expect(Selector('#mobility-setting-dropdown').visible).ok()
    .expect(Selector('#cities-setting-dropdown').visible).ok()
    // .expect(Selector('#organizations-setting-dropdown').visible).ok()
  ;
});

// TODO: fix this unstable test
// test('Settings saves correctly', async (t) => {
//   openSettings(t);
//
//   const settings = Selector('#SettingsContainer');
//   const checkboxGroup = settings.find('[aria-labelledby=SenseSettings]');
//   const checkboxes = checkboxGroup.find('input[type=checkbox]');
//   const topSaveButton = settings.find('button[aria-label="Tallenna"]').nth(0);
//   const bottomSaveButton = settings.find('button[aria-label="Tallenna asetukset"]').nth(0);
//   const ariaLiveElement = settings.find('p[aria-live="polite"]').nth(0);
//   const closeButton = settings.find('button[aria-label="Sulje asetukset"]').nth(1);
//
//   await t
//     .click(checkboxes.nth(1))
//     .expect(checkboxes.nth(1).checked).ok('Expected second checkbox to be checked')
//     .expect(ariaLiveElement.innerText).contains(
//       'Asetukset muutettu. Muista tallentaa',
//       'Expect aria live element to have state information about settings change'
//     )
//     .click(bottomSaveButton)
//     .expect(ariaLiveElement.innerText).contains(
//       'Asetukset on tallennettu',
//       'Expected aria live element to have state information about saved settings'
//     )
//     // Focus should be moved after save in order to avoid loss of focus on mobile
//     .expect(closeButton.focused).ok('Expect focus to move to close button on save')
//   ;
//
//   const title = Selector('.TitleText');
//   await t
//     .click(checkboxes.nth(1))
//     .expect(checkboxes.nth(1).checked).notOk('Expected second checkbox to be unchecked')
//     .expect(ariaLiveElement.innerText).contains(
//       'Asetukset muutettu. Muista tallentaa',
//       'Expect aria live element to have state information about settings change'
//     )
//     .click(topSaveButton)
//     .expect(ariaLiveElement.innerText).contains(
//       'Asetukset on tallennettu',
//       'Expected aria live element to have state information about saved settings'
//     )
//     .expect(title.focused).ok('Expect focus to move to title on confirmation box save')
//   ;
// })