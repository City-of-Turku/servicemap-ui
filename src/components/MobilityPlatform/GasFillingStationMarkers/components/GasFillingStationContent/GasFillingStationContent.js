import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const GasFillingStationContent = ({ classes, intl, station }) => {
  const singleValTypo = (messageId, value, props = {}) => (
    <div {...props}>
      <Typography variant="body2">
        {intl.formatMessage({ id: messageId }, { value })}
      </Typography>
    </div>
  );

  const gasFillingStationInfo = (
    <>
      {singleValTypo('mobilityPlatform.content.address', station.address, { className: classes.margin })}
      {singleValTypo('mobilityPlatform.content.gfsType', station.extra.lng_cng, { className: classes.margin })}
      {singleValTypo('mobilityPlatform.content.operator', station.extra.operator, { className: classes.margin })}
    </>
  );

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <Typography variant="subtitle1">
          {station.name}
        </Typography>
      </div>
      <div className={classes.textContainer}>
        {gasFillingStationInfo}
      </div>
    </div>
  );
};

GasFillingStationContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  station: PropTypes.objectOf(PropTypes.any),
};

GasFillingStationContent.defaultProps = {
  station: {},
};

export default GasFillingStationContent;
