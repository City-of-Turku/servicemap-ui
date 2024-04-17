import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import { StyledContainer, StyledHeaderContainer, StyledTextContainer } from '../../../styled/styled';

const ParkingSpacesContent = ({ parkingSpace, parkingStatistics }) => {
  const intl = useIntl();

  let freeParkingSpaces = 0;
  const parkingSpaceStats = parkingStatistics.filter(item => item.id === parkingSpace.id);

  const renderText = (isTitle, translationId, text) => (isTitle ? (
    <StyledHeaderContainer>
      <Typography variant="subtitle1" component="h3">
        {intl.formatMessage({
          id: translationId,
        })}
      </Typography>
    </StyledHeaderContainer>
  ) : (
    <StyledTextContainer>
      <Typography variant="body2" component="p">
        {intl.formatMessage({
          id: translationId,
        })}
        :
        {' '}
        {text}
      </Typography>
    </StyledTextContainer>
  ));

  const renderPaymentType = (translationId1, translationId2) => (
    <StyledTextContainer>
      <Typography variant="body2">
        {intl.formatMessage({
          id: translationId1,
        })}
        :
        {' '}
        {intl.formatMessage({
          id: translationId2,
        })}
      </Typography>
    </StyledTextContainer>
  );

  const renderParkingCount = (capacity, parkingCount) => {
    freeParkingSpaces = capacity - parkingCount;

    return (
      <StyledTextContainer key={capacity}>
        {freeParkingSpaces > 0 ? (
          <Typography variant="body2">
            {intl.formatMessage(
              { id: 'mobilityPlatform.content.parkingSpaces.parkingCount' },
              { value: freeParkingSpaces, capacity },
            )}
          </Typography>
        ) : (
          <Typography variant="body2">
            {intl.formatMessage({ id: 'mobilityPlatform.content.parkingSpaces.empty' })}
          </Typography>
        )}
      </StyledTextContainer>
    );
  };

  return (
    <StyledContainer>
      {renderText(true, 'mobilityPlatform.content.parkingSpaces.title')}
      {renderPaymentType('mobilityPlatform.content.parkingSpaces.type', 'mobilityPlatform.content.parkingSpaces.paid')}
      {renderText(false, 'mobilityPlatform.content.parkingSpaces.capacity', parkingSpace.properties.capacity_estimate)}
      {parkingSpaceStats
        && parkingSpaceStats.length > 0
        && parkingSpaceStats.map(parking => renderParkingCount(parkingSpace.properties.capacity_estimate, parking.current_parking_count))}
    </StyledContainer>
  );
};

ParkingSpacesContent.propTypes = {
  parkingSpace: PropTypes.shape({
    id: PropTypes.string,
    properties: PropTypes.shape({
      capacity_estimate: PropTypes.number,
    }),
  }),
  parkingStatistics: PropTypes.arrayOf(
    PropTypes.shape({
      current_parking_count: PropTypes.number,
    }),
  ),
};

ParkingSpacesContent.defaultProps = {
  parkingSpace: {},
  parkingStatistics: [],
};

export default ParkingSpacesContent;
