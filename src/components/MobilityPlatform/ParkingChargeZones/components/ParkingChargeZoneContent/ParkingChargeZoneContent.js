import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

const ParkingChargeZoneContent = ({ classes, intl, parkingChargeZone }) => {
  const renderText = (msgId, objValue, isTitle) => (
    <div className={isTitle ? classes.subtitle : classes.text}>
      <Typography variant={isTitle ? 'subtitle1' : 'body2'}>
        {intl.formatMessage({
          id: msgId,
        })}
        :
        {' '}
        {objValue}
      </Typography>
    </div>
  );

  return (
    <div className={classes.popupInner}>
      {renderText('mobilityPlatform.content.parkingChargeZones.zone', parkingChargeZone.extra.maksuvyohyke, true)}
      {renderText('mobilityPlatform.content.parkingChargeZones.price.weekDays', parkingChargeZone.extra.maksullisuus_arki, false)}
      {renderText('mobilityPlatform.content.parkingChargeZones.price.saturday', parkingChargeZone.extra.maksullisuus_lauantai, false)}
      {renderText('mobilityPlatform.content.parkingChargeZones.price.sunday', parkingChargeZone.extra.maksullisuus_sunnuntai, false)}
      {renderText('mobilityPlatform.content.parkingChargeZones.price', parkingChargeZone.extra.maksuvyohykehinta, false)}
    </div>
  );
};

ParkingChargeZoneContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  parkingChargeZone: PropTypes.objectOf(PropTypes.any),
};

ParkingChargeZoneContent.defaultProps = {
  parkingChargeZone: null,
};

export default ParkingChargeZoneContent;
