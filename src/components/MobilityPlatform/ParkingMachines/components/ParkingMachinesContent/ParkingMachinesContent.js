import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import TextComponent from '../../../TextComponent';

const ParkingMachinesContent = ({ classes, intl, item }) => {
  /** For values that are not objects and do not contain localized strings */
  const singleValText = (messageId, value) => (
    <div className={classes.margin}>
      <Typography component="p" variant="body2">
        {intl.formatMessage({ id: messageId }, { value })}
      </Typography>
    </div>
  );

  const machineAddress = {
    fi: item.address_fi,
    en: item.address_en,
    sv: item.address_sv,
  };

  const formatPrice = price => price.toString().replace('.', ',');

  const parkingMachineInfo = (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <Typography variant="subtitle1" component="h3">
          {intl.formatMessage({ id: 'mobilityPlatform.content.parkingMachine.title' })}
        </Typography>
      </div>
      <div className={classes.textContainer}>
        {item.address_fi ? <TextComponent messageId="mobilityPlatform.content.address" textObj={machineAddress} /> : null}
        <TextComponent messageId="mobilityPlatform.content.parkingMachine.location" textObj={item.extra.Sijainti} />
        {singleValText('mobilityPlatform.content.parkingMachine.payment', formatPrice(item.extra['Taksa/h']))}
        <TextComponent messageId="mobilityPlatform.content.parkingMachine.paymentTypes" textObj={item.extra.Maksutapa} />
        {item.extra.Muuta ? singleValText('mobilityPlatform.content.parkingMachine.otherInfo', item.extra.Muuta) : null}
      </div>
    </div>
  );

  return (
    <div className={classes.padding}>
      {parkingMachineInfo}
    </div>
  );
};

ParkingMachinesContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  item: PropTypes.objectOf(PropTypes.any),
};

ParkingMachinesContent.defaultProps = {
  item: {},
};

export default ParkingMachinesContent;
