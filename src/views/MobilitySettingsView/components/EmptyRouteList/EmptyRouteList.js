import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import styled from '@emotion/styled';

/**
   * Check if route list is empty and render correct text
   * @property {Array} route
   * @return {JSX Element}
   */

const EmptyRouteList = ({ route }) => {
  const intl = useIntl();

  if (route) {
    return (
      <StyledParagraph>
        <Typography
          component="p"
          variant="subtitle2"
        >
          {route.length > 0
            ? intl.formatMessage({ id: 'mobilityPlatform.menu.routes.info' })
            : intl.formatMessage({ id: 'mobilityPlatform.menu.routes.emptyList' })}
        </Typography>
      </StyledParagraph>
    );
  }
  return null;
};

const StyledParagraph = styled.div(({ theme }) => ({
  textAlign: 'left',
  padding: theme.spacing(1.5),
}));

EmptyRouteList.propTypes = {
  route: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
  })),
};

EmptyRouteList.defaultProps = {
  route: [],
};

export default EmptyRouteList;
