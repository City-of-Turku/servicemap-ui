import React from 'react';
import { PropTypes } from 'prop-types';
import { Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import { StyledContainer, StyledHeaderContainer, StyledTextContainer } from '../../../styled/styled';

const SpeedLimitZonesContent = ({ item }) => {
  const intl = useIntl();

  return (
    <StyledContainer>
      <StyledHeaderContainer>
        <Typography variant="subtitle1" component="h3">
          {intl.formatMessage({
            id: 'mobilityPlatform.content.speedLimitZones.area',
          })}
        </Typography>
      </StyledHeaderContainer>
      <div>
        <StyledTextContainer>
          <Typography>
            {intl.formatMessage(
              {
                id: 'mobilityPlatform.content.speedLimitZones.limit',
              },
              { item: item.extra.speed_limit },
            )}
          </Typography>
        </StyledTextContainer>
      </div>
    </StyledContainer>
  );
};

SpeedLimitZonesContent.propTypes = {
  item: PropTypes.shape({
    extra: PropTypes.objectOf(PropTypes.number),
  }).isRequired,
};

export default SpeedLimitZonesContent;
