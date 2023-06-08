import { Link, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const ScooterInfo = ({ classes, intl, item }) => {
  const titleTypo = messageId => (
    <div>
      <Typography variant="subtitle1" component="h3">
        {intl.formatMessage({
          id: messageId,
        })}
      </Typography>
    </div>
  );

  const singleValTypo = (messageId, value) => (
    <div className={classes.marginTop}>
      <Typography variant="body2">
        {intl.formatMessage({ id: messageId }, { value })}
      </Typography>
    </div>
  );

  const renderStatus = (scooterStatus) => {
    if (!scooterStatus) {
      return (
        <div className={classes.marginTop}>
          <Typography variant="body2">
            {intl.formatMessage({ id: 'mobilityPlatform.content.scooter.notReserved' })}
          </Typography>
        </div>
      );
    } return null;
  };

  const renderLink = (linkUrl, text) => (
    <div className={classes.paragraph}>
      <Link role="link" target="_blank" href={linkUrl}>
        <Typography className={classes.link} variant="body2">
          {text}
        </Typography>
      </Link>
    </div>
  );

  const formatRange = (range) => {
    const rangeKm = (range / 1000).toFixed(2);
    return `${rangeKm} km`;
  };

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        {titleTypo('mobilityPlatform.content.scooter.title')}
      </div>
      <div className={classes.textContainer}>
        {singleValTypo('mobilityPlatform.content.general.provider', 'Ryde')}
        {renderStatus(item.is_reserved)}
        {singleValTypo('mobilityPlatform.content.scooter.range', formatRange(item.current_range_meters))}
        <div className={classes.paragraph}>
          <Typography variant="body2" className={classes.bold}>
            {intl.formatMessage({ id: 'mobilityPlatform.content.general.rentalUris' })}
            :
          </Typography>
        </div>
        {renderLink(item.rental_uris.android, 'Android')}
        {renderLink(item.rental_uris.ios, 'iOS')}
      </div>
    </div>
  );
};

ScooterInfo.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  item: PropTypes.objectOf(PropTypes.any),
};

ScooterInfo.defaultProps = {
  item: {},
};

export default ScooterInfo;
