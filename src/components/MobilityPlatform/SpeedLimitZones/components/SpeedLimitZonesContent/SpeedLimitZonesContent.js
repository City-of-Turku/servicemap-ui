import React from 'react';
import { PropTypes } from 'prop-types';
import { Typography } from '@mui/material';

const SpeedLimitZonesContent = ({ classes, intl, item }) => (
  <div className={classes.padding}>
    <div className={classes.subtitle}>
      <Typography variant="subtitle1">
        {intl.formatMessage({
          id: 'mobilityPlatform.content.speedLimitZones.area',
        })}
      </Typography>
    </div>
    <Typography>
      {intl.formatMessage({
        id: 'mobilityPlatform.content.speedLimitZones.limit',
      }, { item: item.extra.speed_limit })}
    </Typography>
  </div>
);

SpeedLimitZonesContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  item: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default SpeedLimitZonesContent;
