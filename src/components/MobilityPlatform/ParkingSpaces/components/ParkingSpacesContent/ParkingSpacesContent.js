import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const ParkingSpacesContent = ({
  classes, intl, parkingSpace, parkingStatistics,
}) => {
  let freeParkingSpaces = 0;

  const parkingSpaceStats = parkingStatistics.filter(item => item.id === parkingSpace.id);

  const renderText = (isTitle, translationId, text) => (
    <div className={isTitle ? classes.title : classes.text}>
      {isTitle ? (
        <Typography variant="subtitle1" component="h3">
          {intl.formatMessage({
            id: translationId,
          })}
        </Typography>
      ) : (
        <Typography variant="body2" component="p">
          {intl.formatMessage({
            id: translationId,
          })}
          :
          {' '}
          {text}
        </Typography>
      )}
    </div>
  );

  const renderPaymentType = (translationId1, translationId2) => (
    <div className={classes.text}>
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
    </div>
  );

  const renderParkingCount = (capacity, parkingCount) => {
    freeParkingSpaces = capacity - parkingCount;

    return (
      <div key={capacity} className={classes.text}>
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
      </div>
    );
  };

  return (
    <div className={classes.container}>
      {renderText(true, 'mobilityPlatform.content.parkingSpaces.title')}
      {renderPaymentType('mobilityPlatform.content.parkingSpaces.type', 'mobilityPlatform.content.parkingSpaces.paid')}
      {renderText(false, 'mobilityPlatform.content.parkingSpaces.capacity', parkingSpace.properties.capacity_estimate)}
      {parkingSpaceStats
        && parkingSpaceStats.length > 0
        && parkingSpaceStats.map(parking => renderParkingCount(parkingSpace.properties.capacity_estimate, parking.current_parking_count))}
    </div>
  );
};

ParkingSpacesContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  parkingSpace: PropTypes.objectOf(PropTypes.any),
  parkingStatistics: PropTypes.arrayOf(PropTypes.any),
};

ParkingSpacesContent.defaultProps = {
  parkingSpace: {},
  parkingStatistics: [],
};

export default ParkingSpacesContent;
