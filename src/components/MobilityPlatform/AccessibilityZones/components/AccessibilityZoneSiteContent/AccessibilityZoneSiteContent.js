import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import { StyledContainer, StyledHeaderContainer, StyledTextContainer } from '../../../styled/styled';
import { getTransportSpeed } from '../../utils/utils';

const AccessibilityZoneSiteContent = ({ marker }) => {
  const intl = useIntl();

  const getTransportText = group => {
    const transport = intl.formatMessage({ id: `mobilityPlatform.content.accessibilityZones.${group.transport}` });
    const speed = getTransportSpeed(group);
    return speed ? `${transport} (${speed})` : transport;
  };

  return (
    <StyledContainer>
      <StyledHeaderContainer>
        <Typography variant="subtitle1" component="h4">
          {marker.name}
        </Typography>
      </StyledHeaderContainer>
      <StyledTextContainer>
        <Typography variant="subtitle2" component="p">
          {intl.formatMessage({ id: 'mobilityPlatform.content.accessibilityZones.title' })}
        </Typography>
      </StyledTextContainer>
      {marker.groups.map(group => (
        <StyledTextContainer key={group.id}>
          <Typography variant="body2" component="p">
            {intl.formatMessage(
              { id: 'mobilityPlatform.content.accessibilityZones.travelTimes' },
              { transport: getTransportText(group), value: group.minutes.join(', ') },
            )}
          </Typography>
        </StyledTextContainer>
      ))}
      {marker.approximate ? (
        <StyledTextContainer>
          <Typography variant="body2" component="p">
            {intl.formatMessage({ id: 'mobilityPlatform.content.accessibilityZones.approximateLocation' })}
          </Typography>
        </StyledTextContainer>
      ) : null}
    </StyledContainer>
  );
};

AccessibilityZoneSiteContent.propTypes = {
  marker: PropTypes.shape({
    name: PropTypes.string,
    approximate: PropTypes.bool,
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        transport: PropTypes.string,
        minutes: PropTypes.arrayOf(PropTypes.number),
      }),
    ),
  }).isRequired,
};

export default AccessibilityZoneSiteContent;
