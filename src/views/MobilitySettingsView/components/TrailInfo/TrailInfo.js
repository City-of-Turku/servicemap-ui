import { Typography } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

const TrailInfo = ({ classes, intl, item }) => {
  const renderLength = () => (
    <Typography
      component="p"
      variant="body2"
      aria-label={intl.formatMessage(
        { id: 'mobilityPlatform.menu.markedTrails.length' },
        { value: item.extra.length_km },
      )}
    >
      {intl.formatMessage(
        { id: 'mobilityPlatform.menu.markedTrails.length' },
        { value: item.extra.length_km },
      )}
    </Typography>
  );

  return (
    <div className={classes.container}>
      <div className={classes.paragraph}>{renderLength()}</div>
    </div>
  );
};

TrailInfo.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  item: PropTypes.objectOf(PropTypes.any),
};

TrailInfo.defaultProps = {
  item: {},
};

export default TrailInfo;
