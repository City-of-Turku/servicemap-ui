import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel, Typography } from '@material-ui/core';
import { isDataValid } from '../../../../components/MobilityPlatform/utils/utils';

const ParkingChargeZoneList = ({
  intl, classes, openZoneList, parkingChargeZones, zoneId, selectZone,
}) => {
  const renderData = isDataValid(openZoneList, parkingChargeZones);

  return (
    renderData
      ? parkingChargeZones.map(item => (
        <div key={item.id} className={classes.checkBoxContainer}>
          <FormControlLabel
            control={(
              <Checkbox
                checked={item.id === zoneId}
                aria-checked={item.id === zoneId}
                className={classes.margin}
                onChange={() => selectZone(item.id)}
              />
              )}
            label={(
              <Typography
                variant="body2"
                aria-label={intl.formatMessage(
                  { id: 'mobilityPlatform.menu.parkingChargeZones.subtitle' },
                  { value: item.extra.maksuvyohyke },
                )}
              >
                {intl.formatMessage(
                  { id: 'mobilityPlatform.menu.parkingChargeZones.subtitle' },
                  { value: item.extra.maksuvyohyke },
                )}
              </Typography>
              )}
          />
        </div>
      ))
      : null
  );
};

ParkingChargeZoneList.propTypes = {
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  openZoneList: PropTypes.bool,
  parkingChargeZones: PropTypes.arrayOf(PropTypes.object),
  zoneId: PropTypes.string,
  selectZone: PropTypes.func.isRequired,
};

ParkingChargeZoneList.defaultProps = {
  openZoneList: false,
  parkingChargeZones: [],
  zoneId: '',
};

export default ParkingChargeZoneList;
