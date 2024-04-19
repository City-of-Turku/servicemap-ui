import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import { isDataValid } from '../../../../components/MobilityPlatform/utils/utils';
import { StyledCheckboxItem } from '../styled/styled';

const ParkingChargeZoneList = ({
  openZoneList, parkingChargeZones, zoneId, selectZone,
}) => {
  const intl = useIntl();
  const renderData = isDataValid(openZoneList, parkingChargeZones);

  return (
    renderData
      ? parkingChargeZones.map(item => (
        <StyledCheckboxItem key={item.id}>
          <FormControlLabel
            control={(
              <Checkbox
                checked={item.id === zoneId}
                aria-checked={item.id === zoneId}
                onChange={() => selectZone(item.id)}
              />
              )}
            label={(
              <Typography
                variant="body2"
              >
                {intl.formatMessage(
                  { id: 'mobilityPlatform.menu.parkingChargeZones.subtitle' },
                  { value: item.extra.maksuvyohyke },
                )}
              </Typography>
              )}
          />
        </StyledCheckboxItem>
      ))
      : null
  );
};

ParkingChargeZoneList.propTypes = {
  openZoneList: PropTypes.bool,
  parkingChargeZones: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
  })),
  zoneId: PropTypes.string,
  selectZone: PropTypes.func.isRequired,
};

ParkingChargeZoneList.defaultProps = {
  openZoneList: false,
  parkingChargeZones: [],
  zoneId: '',
};

export default ParkingChargeZoneList;
