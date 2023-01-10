import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import useLocaleText from '../../../../../utils/useLocaleText';

const BikeServiceStationContent = ({ classes, intl, station }) => {
  const getLocaleText = useLocaleText();

  const singleValTypo = (messageId, value, props = {}) => (
    <div {...props}>
      <Typography component="p" variant="body2">
        {intl.formatMessage({ id: messageId }, { value })}
      </Typography>
    </div>
  );

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

  const renderAddress = () => singleValTypo('mobilityPlatform.content.address', getLocaleText(stationAddress), { className: classes.margin });

  const bikeServiceStationInfo = (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <Typography variant="subtitle1">
          {getLocaleText(stationName)}
        </Typography>
      </div>
      <div className={classes.textContainer}>
        {station.address ? renderAddress() : null}
        <Typography component="p" variant="body2">
          {getLocaleText(stationDesc)}
        </Typography>
      </div>
    </div>
  );

  return (
    <div className={classes.container}>
      {bikeServiceStationInfo}
    </div>
  );
};

BikeServiceStationContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  station: PropTypes.objectOf(PropTypes.any),
};

BikeServiceStationContent.defaultProps = {
  station: {},
};

export default BikeServiceStationContent;
