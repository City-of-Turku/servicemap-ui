import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const RouteLength = ({ classes, intl, route }) => {
  const formatRoutelength = inputLength => Math.round(inputLength / 1000);

  const renderRouteText = (routeName) => {
    switch (routeName) {
      case 'EuroVelo':
        return (
          <Typography
            component="p"
            variant="body2"
            aria-label={intl.formatMessage({ id: 'mobilityPlatform.menu.bicycleRoutes.euroVelo' })}
            className={classes.margin}
          >
            {intl.formatMessage({ id: 'mobilityPlatform.menu.bicycleRoutes.euroVelo' })}
          </Typography>
        );
      case 'Saariston rengastie':
        return (
          <Typography
            component="p"
            variant="body2"
            aria-label={intl.formatMessage({ id: 'mobilityPlatform.menu.bicycleRoutes.archipelagoTrail' })}
            className={classes.margin}
          >
            {intl.formatMessage({ id: 'mobilityPlatform.menu.bicycleRoutes.archipelagoTrail' })}
          </Typography>
        );
      case 'Aurajoentie':
        return (
          <Typography
            component="p"
            variant="body2"
            aria-label={intl.formatMessage({ id: 'mobilityPlatform.menu.bicycleRoutes.auraRiverTrail' })}
            className={classes.margin}
          >
            {intl.formatMessage({ id: 'mobilityPlatform.menu.bicycleRoutes.auraRiverTrail' })}
          </Typography>
        );
      default:
        return null;
    }
  };

  const generateTranslations = (routeName) => {
    const split = routeName.split(' ');
    const [a, b] = split;
    if (a === 'Seutureitti') {
      return (
        <Typography
          component="p"
          variant="body2"
          aria-label={intl.formatMessage({ id: `mobilityPlatform.menu.bicycleRoutes.regionalTrail${b}` })}
          className={classes.margin}
        >
          {intl.formatMessage({ id: `mobilityPlatform.menu.bicycleRoutes.regionalTrail${b}` })}
        </Typography>
      );
    }
    return renderRouteText(routeName);
  };

  return (
    <div className={classes.container}>
      <div className={classes.paragraph}>
        <Typography
          component="p"
          variant="body2"
          aria-label={`${intl.formatMessage({ id: 'mobilityPlatform.menu.bicycleRoutes.length' })} ${formatRoutelength(
            route.length,
          )} km.`}
        >
          {intl.formatMessage({ id: 'mobilityPlatform.menu.bicycleRoutes.length' })}
          {' '}
          {formatRoutelength(route.length)}
          {' '}
          km.
        </Typography>
        {generateTranslations(route.name_fi)}
      </div>
    </div>
  );
};

RouteLength.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  route: PropTypes.objectOf(PropTypes.any),
};

RouteLength.defaultProps = {
  route: null,
};

export default RouteLength;
