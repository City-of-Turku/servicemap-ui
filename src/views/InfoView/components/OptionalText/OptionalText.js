import { ButtonBase, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import useLocaleText from '../../../../utils/useLocaleText';
import LinkBasic from '../LinkBasic';
import List from '../List';
import OptionalA11yText from '../OptionalA11yText';
import Paragraph from '../Paragraph';

const OptionalText = ({ classes, intl }) => {
  const [showA11y, setShowA11y] = useState(false);

  const getLocaleText = useLocaleText();
  const appLink = 'https://github.com/City-of-Turku/servicemap-ui/';
  const apiLink = 'https://github.com/City-of-Turku/smbackend/';
  const guideMapLink = 'https://opaskartta.turku.fi';
  const openStreetMapLink = 'https://www.openstreetmap.org/';
  const serviceCatalogApiLink = 'https://api.palvelutietovaranto.suomi.fi/swagger/ui/index.html';
  const dataDescriptionServiceLink = 'https://rekisteri.turku.fi/Saabe_data/';

  const searchOptions = [
    intl.formatMessage({ id: 'info.view.searchOptions.healthStation' }),
    intl.formatMessage({ id: 'info.view.searchOptions.school' }),
    intl.formatMessage({ id: 'info.view.searchOptions.dayCare' }),
    intl.formatMessage({ id: 'info.view.searchOptions.swimming' }),
    intl.formatMessage({ id: 'info.view.searchOptions.sportsField' }),
    intl.formatMessage({ id: 'info.view.searchOptions.library' }),
    intl.formatMessage({ id: 'info.view.searchOptions.community' }),
    intl.formatMessage({ id: 'info.view.searchOptions.units' }),
    intl.formatMessage({ id: 'info.view.searchOptions.address' }),
  ];

  const searchOrderOptions = [
    intl.formatMessage({ id: 'info.view.searchOrder.relevant' }),
    intl.formatMessage({ id: 'info.view.searchOrder.alpha' }),
    intl.formatMessage({ id: 'info.view.searchOrder.alphaReverse' }),
    intl.formatMessage({ id: 'info.view.searchOrder.accessible' }),
    intl.formatMessage({ id: 'info.view.searchOrder.nearest' }),
  ];

  const mapOptions = [
    intl.formatMessage({ id: 'info.view.mapSettingsOptions.serviceMap' }),
    intl.formatMessage({ id: 'info.view.mapSettingsOptions.contrastMap' }),
  ];

  const serviceDirectoryLinks = {
    fi: 'https://www.turku.fi/palveluhakemisto',
    en: 'https://www.turku.fi/en/service-directory',
    sv: 'https://www.turku.fi/sv/service-directory',
  };

  const feedbackLinks = {
    fi: 'https://www.turku.fi/palaute',
    en: 'https://www.turku.fi/feedback',
    sv: 'https://www.turku.fi/feedbacktjansten',
  };

  const renderNestedList = () => (
    <ul>
      <li>
        <Typography variant="body2">{intl.formatMessage({ id: 'info.view.accessibilityOptions.senses' })}</Typography>
        <ul>
          <li>
            <Typography variant="body2">
              {intl.formatMessage({ id: 'info.view.accessibilityOptions.senses.hearing' })}
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              {intl.formatMessage({ id: 'info.view.accessibilityOptions.senses.sight' })}
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              {intl.formatMessage({ id: 'info.view.accessibilityOptions.senses.color' })}
            </Typography>
          </li>
        </ul>
      </li>
      <li>
        <Typography variant="body2">{intl.formatMessage({ id: 'info.view.accessibilityOptions.mobility' })}</Typography>
        <ul>
          <li>
            <Typography variant="body2">
              {intl.formatMessage({ id: 'info.view.accessibilityOptions.mobility.wheelchair' })}
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              {intl.formatMessage({ id: 'info.view.accessibilityOptions.mobility.disabled' })}
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              {intl.formatMessage({ id: 'info.view.accessibilityOptions.mobility.rollator' })}
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              {intl.formatMessage({ id: 'info.view.accessibilityOptions.mobility.stroller' })}
            </Typography>
          </li>
        </ul>
      </li>
    </ul>
  );

  const handleClick = () => {
    setShowA11y(current => !current);
  };

  const renderGeneralInfo = () => (
    <>
      <Paragraph isTitle translationId="info.view.serviceInfoTitle" />
      <Paragraph translationId="info.view.serviceInfo" />
      <Paragraph translationId="info.view.guideMapInfo" />
      <LinkBasic linkUrl={guideMapLink} translationId="info.view.guideMapLink" />
      <Paragraph translationId="info.view.developmentInfo" />
      <Paragraph isTitle translationId="mobilityPlatform.info.title" />
      <Paragraph translationId="mobilityPlatform.info.statement" />
      <Paragraph isTitle translationId="info.view.searchInfoTitle" />
      <Paragraph translationId="info.view.searchInfo" />
      <Paragraph translationId="info.view.searchErrorInfo" />
      <Paragraph isTitle translationId="info.view.searchOptions.title" />
      <List input={searchOptions} />
      <Paragraph isTitle translationId="info.view.searchOrder.title" />
      <List input={searchOrderOptions} />
      <Paragraph isTitle translationId="info.view.addressInfoTitle" />
      <Paragraph translationId="info.view.addressInfo" />
      <Paragraph isTitle translationId="info.view.serviceTreeInfoTitle" />
      <Paragraph translationId="info.view.serviceTreeInfo" />
      <Paragraph isTitle translationId="info.view.settingsInfoTitle" />
      <Paragraph translationId="info.view.settingsInfo" />
      <Paragraph isTitle translationId="info.view.accessibilitySettingsInfoTitle" />
      <Paragraph translationId="info.view.accessibilitySettingsInfoSubtitle" />
      {renderNestedList()}
      <Paragraph translationId="info.view.accessibilitySettingsInfo" />
      <Paragraph isTitle translationId="info.view.mapSettingsInfoTitle" />
      <Paragraph translationId="info.view.mapSettingsInfo" />
      <List input={mapOptions} />
      <Paragraph isTitle translationId="info.view.feedbackInfoTitle" />
      <Paragraph translationId="info.view.feedbackInfo" />
      <LinkBasic linkUrl={getLocaleText(feedbackLinks)} translationId="info.view.feedback.link" />
      <Paragraph isTitle translationId="info.view.copyrightInfoTitle" />
      <Paragraph translationId="info.view.copyrightInfo" />
      <LinkBasic linkUrl={appLink} translationId="info.view.repository.app" />
      <LinkBasic linkUrl={apiLink} translationId="info.view.repository.api" />
      <Paragraph translationId="info.view.openStreetInfo" />
      <LinkBasic linkUrl={openStreetMapLink} translationId="info.view.openStreetMap.link" />
      <Paragraph translationId="info.view.usageInfo" />
      <Paragraph translationId="info.view.turkuServicesInfo" />
      <LinkBasic linkUrl={getLocaleText(serviceDirectoryLinks)} translationId="info.view.turkuServices.link" />
      <LinkBasic linkUrl={serviceCatalogApiLink} translationId="info.view.serviceCatalogue.link" />
      <Paragraph translationId="info.view.registryInfo" />
      <LinkBasic linkUrl={dataDescriptionServiceLink} translationId="info.view.dataDescriptionService.link" />
    </>
  );

  return (
    <div className={classes.container}>
      <div className={classes.buttonContainer}>
        <ButtonBase onClick={() => handleClick()}>
          <Typography className={classes.button} variant="body2">
            {showA11y
              ? intl.formatMessage({ id: 'info.view.a11y.button.return' })
              : intl.formatMessage({ id: 'info.view.a11y.button.title' })}
          </Typography>
        </ButtonBase>
      </div>
      {showA11y ? <OptionalA11yText /> : renderGeneralInfo()}
    </div>
  );
};

OptionalText.propTypes = {
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default OptionalText;
