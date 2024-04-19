import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import styled from '@emotion/styled';

const RouteLength = ({ route }) => {
  const intl = useIntl();

  const formatRoutelength = inputLength => Math.round(inputLength / 1000);

  const renderRouteText = routeName => {
    switch (routeName) {
      case 'EuroVelo':
        return (
          <StyledTypography
            component="p"
            variant="body2"
          >
            {intl.formatMessage({ id: 'mobilityPlatform.menu.bicycleRoutes.euroVelo' })}
          </StyledTypography>
        );
      case 'Saariston rengastie':
        return (
          <StyledTypography
            component="p"
            variant="body2"
          >
            {intl.formatMessage({ id: 'mobilityPlatform.menu.bicycleRoutes.archipelagoTrail' })}
          </StyledTypography>
        );
      case 'Aurajoentie':
        return (
          <StyledTypography
            component="p"
            variant="body2"
          >
            {intl.formatMessage({ id: 'mobilityPlatform.menu.bicycleRoutes.auraRiverTrail' })}
          </StyledTypography>
        );
      default:
        return null;
    }
  };

  const generateTranslations = routeName => {
    const split = routeName.split(' ');
    const [a, b] = split;
    if (a === 'Seutureitti') {
      return (
        <StyledTypography
          component="p"
          variant="body2"
        >
          {intl.formatMessage({ id: `mobilityPlatform.menu.bicycleRoutes.regionalTrail${b}` })}
        </StyledTypography>
      );
    }
    return renderRouteText(routeName);
  };

  return (
    <StyledContainer>
      <Typography
        component="p"
        variant="body2"
      >
        {intl.formatMessage({ id: 'mobilityPlatform.menu.bicycleRoutes.length' })}
        {' '}
        {formatRoutelength(route.length)}
        {' '}
        km.
      </Typography>
      {generateTranslations(route.name_fi)}
    </StyledContainer>
  );
};

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const StyledContainer = styled.div(({ theme }) => ({
  textAlign: 'left',
  padding: theme.spacing(1.5),
  width: '85%',
  marginLeft: theme.spacing(3),
}));

RouteLength.propTypes = {
  route: PropTypes.shape({
    name_fi: PropTypes.string,
    length: PropTypes.number,
  }),
};

RouteLength.defaultProps = {
  route: {},
};

export default RouteLength;
