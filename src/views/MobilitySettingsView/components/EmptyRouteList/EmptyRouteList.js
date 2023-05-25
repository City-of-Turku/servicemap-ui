import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

/**
   * Check if route list is empty and render correct text
   * @property {any} classes
   * @property {any} intl
   * @property {Array} route
   * @return {JSX Element}
   */

const EmptyRouteList = ({ classes, intl, route }) => {
  if (route) {
    return (
      <div className={classes.paragraph}>
        <Typography
          component="p"
          variant="subtitle2"
          aria-label={
                route.length > 0
                  ? intl.formatMessage({ id: 'mobilityPlatform.menu.routes.info' })
                  : intl.formatMessage({ id: 'mobilityPlatform.menu.routes.emptyList' })
              }
        >
          {route.length > 0
            ? intl.formatMessage({ id: 'mobilityPlatform.menu.routes.info' })
            : intl.formatMessage({ id: 'mobilityPlatform.menu.routes.emptyList' })}
        </Typography>
      </div>
    );
  }
  return null;
};

EmptyRouteList.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  route: PropTypes.arrayOf(PropTypes.any),
};

EmptyRouteList.defaultProps = {
  route: [],
};

export default EmptyRouteList;
