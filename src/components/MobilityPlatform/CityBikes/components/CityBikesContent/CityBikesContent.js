import { Link, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const CityBikesContent = ({
  classes, intl, bikeStation, cityBikeStatistics,
}) => {
  const getStation = (data) => {
    if (data && data.length > 0) {
      return data.filter(item => item.station_id === bikeStation.station_id);
    }
    return [];
  };
  const station = getStation(cityBikeStatistics);

  const renderText = (translationId, value) => (
    <div className={classes.paragraph}>
      <Typography variant="body2">
        <strong>{intl.formatMessage({ id: translationId })}</strong>
        :
        {' '}
        {value}
      </Typography>
    </div>
  );

  const renderLink = (linkUrl, text) => (
    <div className={classes.paragraph}>
      <Link target="_blank" href={linkUrl}>
        <Typography className={classes.link} variant="body2">
          {text}
        </Typography>
      </Link>
    </div>
  );

  const renderStationType = (isVirtual, translationId) => {
    if (isVirtual) {
      return (
        <div className={classes.paragraph}>
          <Typography variant="body2">
            {intl.formatMessage({ id: translationId })}
          </Typography>
        </div>
      );
    } return null;
  };

  return (
    <div className={classes.popupInner}>
      <div className={classes.subtitle}>
        <Typography variant="subtitle1">
          {intl.formatMessage({ id: 'mobilityPlatform.content.cityBikes.title' })}
        </Typography>
      </div>
      {renderText('mobilityPlatform.content.cityBikes.name', bikeStation.name)}
      {renderStationType(bikeStation.is_virtual_station, 'mobilityPlatform.content.cityBikes.virtualStation')}
      {renderText('mobilityPlatform.content.cityBikes.capacity', bikeStation.capacity)}
      {station && station.length > 0 && station.map(item => (
        <div key={item.station_id}>
          {renderText('mobilityPlatform.content.cityBikes.bikes.available', item.num_bikes_available)}
          {renderText('mobilityPlatform.content.cityBikes.docks.available', item.num_docks_available)}
        </div>
      ))}
      <div className={classes.paragraph}>
        <Typography variant="body2" className={classes.bold}>
          {intl.formatMessage({ id: 'mobilityPlatform.content.general.rentalUris' })}
          :
        </Typography>
      </div>
      {renderLink(bikeStation.rental_uris.android, 'Android')}
      {renderLink(bikeStation.rental_uris.ios, 'iOS')}
    </div>
  );
};

CityBikesContent.propTypes = {
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  bikeStation: PropTypes.objectOf(PropTypes.any),
  cityBikeStatistics: PropTypes.arrayOf(PropTypes.any),
};

CityBikesContent.defaultProps = {
  bikeStation: {},
  cityBikeStatistics: [],
};

export default CityBikesContent;
