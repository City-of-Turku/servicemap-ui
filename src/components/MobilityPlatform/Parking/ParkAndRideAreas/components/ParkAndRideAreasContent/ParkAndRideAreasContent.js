import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import { StyledContainer, StyledHeaderContainer, StyledTextContainer } from '../../../../styled/styled';

const ParkAndRideAreasContent = ({ parkAndRideArea, parkingStatistics }) => {
  const intl = useIntl();

  let freeParkingSpaces = 0;
  const parkingSpaceStats = parkingStatistics?.filter(item => item.id === parkAndRideArea?.id);

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

  const renderBusNumbers = data => data?.map(item => (
    <StyledTextContainer key={item}>
      <Typography variant="body2" component="p">
        {intl.formatMessage({ id: 'mobilityPlatform.content.parkAndRide.bus' }, { value: item })}
      </Typography>
    </StyledTextContainer>
  ));

  return (
    <StyledContainer>
      {renderText(true, 'mobilityPlatform.content.parkAndRide.title')}
      {renderText(false, 'mobilityPlatform.content.parkingSpaces.capacity', parkAndRideArea?.properties?.capacity_estimate)}
      {parkingSpaceStats?.length > 0
        && parkingSpaceStats.map(parking => renderParkingCount(parkAndRideArea?.properties?.capacity_estimate, parking?.current_parking_count))}
      {renderText(false, 'mobilityPlatform.content.parkAndRide.busNumbers')}
      {renderBusNumbers(parkAndRideArea?.properties?.bus_stop_numbers)}
    </StyledContainer>
  );
};

ParkAndRideAreasContent.propTypes = {
  parkAndRideArea: PropTypes.shape({
    id: PropTypes.string,
    properties: PropTypes.shape({
      capacity_estimate: PropTypes.number,
      bus_stop_numbers: PropTypes.arrayOf(PropTypes.number),
    }),
  }),
  parkingStatistics: PropTypes.arrayOf(
    PropTypes.shape({
      current_parking_count: PropTypes.number,
    }),
  ),
};

ParkAndRideAreasContent.defaultProps = {
  parkAndRideArea: {},
  parkingStatistics: [],
};

export default ParkAndRideAreasContent;
