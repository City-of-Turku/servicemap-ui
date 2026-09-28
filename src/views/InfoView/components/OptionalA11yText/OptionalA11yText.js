import { Link, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import useLocaleText from '../../../../utils/useLocaleText';
import LinkBasic from '../LinkBasic';
import Paragraph from '../Paragraph';

const OptionalA11yText = ({ classes, intl }) => {
  const getLocaleText = useLocaleText();

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
    fi: 'https://turku.asiointi.fi/eFeedback/fi/Feedback/48/1118',
    en: 'https://turku.asiointi.fi/eFeedback/en/Feedback/48/1118',
    sv: 'https://turku.asiointi.fi/eFeedback/sv/Feedback/48/1118',
  };

  const digitSupportLinks = {
    fi: 'https://www.turku.fi/asiointi-ja-yhteystiedot/digituki',
    en: 'https://www.turku.fi/en/service-channels-and-contact-information/digital-support',
    sv: 'https://www.turku.fi/sv/kundtjanst-och-kontaktuppgifter/digitalt-stod',
  };

  const accessibilityRequirementsLinks = {
    fi: 'https://www.saavutettavuusvaatimukset.fi',
    sv: 'https://www.tillganglighetskrav.fi',
    en: 'https://www.webaccessibility.fi',
  };

  const supervisorRequirementsLink = (chunks) => (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      href={getLocaleText(accessibilityRequirementsLinks)}
      className={classes.link}
    >
      {chunks}
    </Link>
  );

  return (
    <div className={classes.container}>
      <Paragraph isTitle translationId="info.view.a11y.page.title" />
      <Paragraph translationId="info.view.a11y.page.intro" />
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
      <Paragraph isTitle translationId="info.view.a11y.page.preparation.title" />
      <Paragraph translationId="info.view.a11y.page.preparation.prepared" />
      <Paragraph translationId="info.view.a11y.page.preparation.basis" />
      <Paragraph translationId="info.view.a11y.page.preparation.updated" />
      <Paragraph isTitle translationId="info.view.a11y.page.information.title" />
      <Paragraph translationId="info.view.a11y.page.information.info" />
      <LinkBasic linkUrl={getLocaleText(serviceDirectoryLinks)} translationId="info.view.turkuServices.link" />
      <Paragraph isTitle translationId="info.view.a11y.page.feedback.title" />
      <Paragraph translationId="info.view.a11y.page.feedback.info" />
      <LinkBasic
        linkUrl={getLocaleText(feedbackLinks)}
        translationId="info.view.a11y.page.feedback.link"
        indicateNewTab
      />
      <Paragraph isTitle translationId="info.view.a11y.page.supervisor.title" />
      <div className={classes.text}>
        <Typography component="p" variant="body2">
          {intl.formatMessage(
            { id: 'info.view.a11y.page.supervisor.info' },
            { link: supervisorRequirementsLink },
          )}
        </Typography>
      </div>
      <Paragraph isTitle translationId="info.view.a11y.page.supervisor.contact.title" />
      <Paragraph translationId="info.view.a11y.page.supervisor.contact.info" />
      <Paragraph isTitle translationId="info.view.a11y.page.work.title" />
      <Paragraph isTitle translationId="info.view.a11y.page.evaluation.title" />
      <Paragraph translationId="info.view.a11y.page.evaluation.info" />
      <Paragraph translationId="info.view.a11y.page.evaluation.audit" />
      <LinkBasic linkUrl={auditReportLink} translationId="info.view.a11y.page.evaluation.audit.url" />
      <Paragraph isTitle translationId="info.view.a11y.page.services.title" />
      <Paragraph translationId="info.view.a11y.page.services.info" />
      <Paragraph isTitle translationId="info.view.a11y.page.support.title" />
      <Paragraph translationId="info.view.a11y.page.support.info" />
      <LinkBasic linkUrl={getLocaleText(digitSupportLinks)} translationId="info.view.a11y.page.support.link" />
      <Paragraph isTitle translationId="info.view.a11y.page.statement.update.title" />
      <Paragraph translationId="info.view.a11y.page.statement.update.info" />
    </div>
  );
};

OptionalA11yText.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default OptionalA11yText;
