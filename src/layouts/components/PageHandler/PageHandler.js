import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { uppercaseFirst } from '../../../utils';
import useLocaleText from '../../../utils/useLocaleText';
import getPageDescriptions from './pageDescriptions';
import { isEmbed } from '../../../utils/path';
import config from '../../../../config';

const PageHandler = (props) => {
  const {
    page, setCurrentPage, intl, messageId, unit, service, event, address,
  } = props;

  const getLocaleText = useLocaleText();
  const embed = isEmbed();

  // If external theme (by Turku) is true, then can be used to select which app description to render.
  const externalTheme = config.themePKG;
  const isExternalTheme = !externalTheme || externalTheme === 'undefined' ? null : externalTheme;

  useEffect(() => {
    // Save current page to redux
    setCurrentPage(page);
  }, [page]);

  // Modify html head
  const message = messageId ? intl.formatMessage({ id: messageId }) : '';
  let pageMessage = '';
  const pageDescription = getPageDescriptions(page, unit, address, getLocaleText, intl, isExternalTheme);

  // Add unit or service name to title if needed
  if ((page === 'unit' || page === 'eventList') && unit && unit.name) {
    pageMessage = getLocaleText(unit.name);
  } if (page === 'service' && service && service.name) {
    pageMessage = getLocaleText(service.name);
  } if (page === 'event' && event && event.name) {
    pageMessage = getLocaleText(event.name);
  }

  let appTitle = intl.formatMessage({ id: 'app.title' });

  if (message !== '' || pageMessage !== '') {
    appTitle = ` | ${appTitle}`;
  }

  const title = `${uppercaseFirst(pageMessage)} ${message}${appTitle}`;
  const hideFromCrawlers = ['search', 'info', 'serviceTree', 'feedback'];

  return (
    <Helmet>
      {embed || hideFromCrawlers.includes(page) ? (
        <meta name="robots" content="none" />
      ) : null}
      <title>{title}</title>
      <meta name="description" content={pageDescription} />
    </Helmet>
  );
};

PageHandler.propTypes = {
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  messageId: PropTypes.string,
  page: PropTypes.string,
  unit: PropTypes.objectOf(PropTypes.any),
  event: PropTypes.objectOf(PropTypes.any),
  service: PropTypes.objectOf(PropTypes.any),
  address: PropTypes.objectOf(PropTypes.any),
  setCurrentPage: PropTypes.func.isRequired,
};

PageHandler.defaultProps = {
  messageId: 'app.title',
  page: null,
  unit: null,
  service: null,
  event: null,
  address: null,
};

export default PageHandler;
