import { Link, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

// TODO update content to render cargo bike specific values

const CityBikesContent = ({
  classes, intl, bikeStation, cityBikeStatistics,
}) => {
  const getStationType = () => bikeStation.name.includes('eCargo bikes');

  const isCargoBike = getStationType();

  const getStation = (data) => {
    if (data && data.length > 0) {
      return data.find(item => item.station_id === bikeStation.station_id);
    }
    return {};
  };

  const stationItem = getStation(cityBikeStatistics);

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

  /** Remove 'eCargo bikes' from station name before render  */
  const formatStationName = (name) => {
    const split = name.split(':');
    return split[1];
  };

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
          <Typography variant="body2">{intl.formatMessage({ id: translationId })}</Typography>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={classes.popupInner}>
      <div className={classes.subtitle}>
        <Typography variant="subtitle1" component="h3">
          {intl.formatMessage({
            id: isCargoBike ? 'mobilityPlatform.content.cargoBikes.title' : 'mobilityPlatform.content.cityBikes.title',
          })}
        </Typography>
      </div>
      {isCargoBike
        ? renderText('mobilityPlatform.content.cityBikes.name', formatStationName(bikeStation.name))
        : renderText('mobilityPlatform.content.cityBikes.name', bikeStation.name)}
      {renderStationType(bikeStation.is_virtual_station, 'mobilityPlatform.content.cityBikes.virtualStation')}
      {!isCargoBike ? renderText('mobilityPlatform.content.cityBikes.capacity', bikeStation.capacity) : null}
      <div>
        {!isCargoBike
          ? renderText('mobilityPlatform.content.cityBikes.bikes.available', stationItem?.num_bikes_available)
          : null}
        {!isCargoBike
          ? renderText('mobilityPlatform.content.cityBikes.docks.available', stationItem?.num_docks_available)
          : null}
        {isCargoBike
          ? stationItem?.vehicle_types_available
            .filter(item => item.vehicle_type_id === 'ecargo')
            .map(item => (
              <div key={item.vehicle_type_id} className={classes.paragraph}>
                <Typography variant="body2">
                  {intl.formatMessage(
                    { id: 'mobilityPlatform.content.cargoBikes.available' },
                    { count: item.count },
                  )}
                </Typography>
              </div>
            ))
          : null}
      </div>
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
