import PropTypes from 'prop-types';
import React from 'react';
import TextComponent from '../../../TextComponent';

const BikeServiceStationContent = ({ classes, station }) => {
  const stationName = {
    fi: station.name,
    en: station.name_en,
    sv: station.name_sv,
  };

  const stationAddress = {
    fi: station.address_fi,
    en: station.address_en,
    sv: station.address_sv,
  };

  const stationDesc = {
    fi: station.description,
    en: station.description_en,
    sv: station.description_sv,
  };

  const bikeServiceStationInfo = (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <TextComponent textObj={stationName} isTitle />
      </div>
      <div className={classes.textContainer}>
        {station.address ? <TextComponent messageId="mobilityPlatform.content.address" textObj={stationAddress} /> : null}
        <TextComponent textObj={stationDesc} />
      </div>
    </div>
  );

  return (
    <>
      {bikeServiceStationInfo}
    </>
  );
};

BikeServiceStationContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  station: PropTypes.objectOf(PropTypes.any),
};

BikeServiceStationContent.defaultProps = {
  station: {},
};

export default BikeServiceStationContent;
