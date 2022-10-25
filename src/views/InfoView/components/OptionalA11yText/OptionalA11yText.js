import PropTypes from 'prop-types';
import React from 'react';
import useLocaleText from '../../../../utils/useLocaleText';
import LinkBasic from '../LinkBasic';
import List from '../List';
import Paragraph from '../Paragraph';

const OptionalA11yText = ({ classes, intl }) => {
  const getLocaleText = useLocaleText();

  const unitOptions = [
    intl.formatMessage({ id: 'info.view.a11y.page.information.units.1' }),
    intl.formatMessage({ id: 'info.view.a11y.page.information.units.2' }),
  ];

  const auditReportLink = 'https://www.hel.fi/static/liitteet-2019/Helsinki/Saavutettavuusselosteet/Palvelukartta-auditointiraportti.pdf';

  const servicemapTurkuLinks = {
    fi: 'https://palvelukartta.turku.fi/',
    en: 'https://servicemap.turku.fi/',
    sv: 'https://servicekarta.turku.fi/',
  };

  const servicemapHelLinks = {
    fi: 'https://palvelukartta.hel.fi/',
    en: 'https://servicemap.hel.fi/',
    sv: 'https://servicekarta.hel.fi/',
  };

  const serviceDirectoryLinks = {
    fi: 'https://www.turku.fi/palveluhakemisto',
    en: 'https://www.turku.fi/en/service-directory',
    sv: 'https://www.turku.fi/sv/service-directory',
  };

  const feedbackLinks = {
    fi: 'https://opaskartta.turku.fi/eFeedback/fi/Feedback/87/1048',
    en: 'https://opaskartta.turku.fi/eFeedback/en/Feedback/87/1048',
    sv: 'https://opaskartta.turku.fi/eFeedback/sv/Feedback/87/1048',
  };

  return (
    <div className={classes.container}>
      <Paragraph isTitle translationId="info.view.a11y.page.title" />
      <Paragraph translationId="info.view.a11y.page.info.turku" />
      <LinkBasic linkUrl={getLocaleText(servicemapTurkuLinks)} translationId="info.view.a11y.page.info.turku.url" />
      <Paragraph translationId="info.view.a11y.page.info.helsinki" />
      <LinkBasic linkUrl={getLocaleText(servicemapHelLinks)} translationId="info.view.a11y.page.info.helsinki.url" />
      <Paragraph isTitle translationId="info.view.a11y.page.status.title" />
      <Paragraph translationId="info.view.a11y.page.status.info" />
      <Paragraph isTitle translationId="info.view.a11y.page.nonAccessible.title" />
      <Paragraph translationId="info.view.a11y.page.nonAccessible.info" />
      <Paragraph isTitle translationId="info.view.a11y.page.correction.title" />
      <Paragraph translationId="info.view.a11y.page.correction.info" />
      <Paragraph isTitle translationId="info.view.a11y.page.information.title" />
      <Paragraph translationId="info.view.a11y.page.information.info" />
      <LinkBasic linkUrl={getLocaleText(serviceDirectoryLinks)} translationId="info.view.turkuServices.link" />
      <Paragraph translationId="info.view.a11y.page.information.units" />
      <List input={unitOptions} />
      <Paragraph isTitle translationId="info.view.a11y.page.feedback.title" />
      <Paragraph translationId="info.view.a11y.page.feedback.info" />
      <LinkBasic linkUrl={getLocaleText(feedbackLinks)} translationId="info.view.a11y.page.feedback.link" />
      <Paragraph isTitle translationId="info.view.a11y.page.supervisor.title" />
      <Paragraph translationId="info.view.a11y.page.supervisor.info" />
      <Paragraph isTitle translationId="info.view.a11y.page.work.title" />
      <Paragraph isTitle translationId="info.view.a11y.page.evaluation.title" />
      <Paragraph translationId="info.view.a11y.page.evaluation.info" />
      <Paragraph translationId="info.view.a11y.page.evaluation.audit" />
      <LinkBasic linkUrl={auditReportLink} translationId="info.view.a11y.page.evaluation.audit.url" />
      <Paragraph isTitle translationId="info.view.a11y.page.services.title" />
      <Paragraph translationId="info.view.a11y.page.services.info" />
      <Paragraph isTitle translationId="info.view.a11y.page.support.title" />
      <Paragraph translationId="info.view.a11y.page.support.info" />
      <List input={unitOptions} />
      <Paragraph isTitle translationId="info.view.a11y.page.statement.update.title" />
      <Paragraph translationId="info.view.a11y.page.statement.update.info" />
      <Paragraph translationId="info.view.a11y.page.date" />
    </div>
  );
};

OptionalA11yText.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default OptionalA11yText;
