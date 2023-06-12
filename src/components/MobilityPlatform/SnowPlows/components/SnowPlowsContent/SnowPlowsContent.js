import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const SnowPlowsContent = ({
  classes, intl, formatOperation, operation, formatTime, timestamp,
}) => (
  <div className={classes.popupInner}>
    <div className={classes.subtitle}>
      <Typography variant="subtitle1" component="h3">
        {intl.formatMessage({
          id: 'mobilityPlatform.content.streetMaintenance.title',
        })}
      </Typography>
    </div>
    <Typography>
      <strong>{intl.formatMessage({ id: 'mobilityPlatform.content.streetMaintenance' })}</strong>
      :
      {' '}
      {formatOperation(operation)}
    </Typography>
    <Typography>
      <strong>{intl.formatMessage({ id: 'mobilityPlatform.content.streetMaintenance.time' })}</strong>
      :
      {' '}
      {formatTime(timestamp)}
    </Typography>
  </div>
);

SnowPlowsContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  formatOperation: PropTypes.func.isRequired,
  operation: PropTypes.string,
  formatTime: PropTypes.func.isRequired,
  timestamp: PropTypes.string,
};

SnowPlowsContent.defaultProps = {
  operation: '',
  timestamp: '',
};

export default SnowPlowsContent;
