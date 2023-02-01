import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const ParkingMachinesContent = ({ classes, intl, item }) => {
  const singleValText = (messageId, value) => (
    <div className={classes.margin}>
      <Typography component="p" variant="body2">
        {intl.formatMessage({ id: messageId }, { value })}
      </Typography>
    </div>
  );

  const renderAddress = () => singleValText('mobilityPlatform.content.address', item.address_fi);

  const parkingMachineInfo = (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <Typography variant="subtitle1">
          {intl.formatMessage({ id: 'mobilityPlatform.content.parkingMachine.title' })}
        </Typography>
      </div>
      <div className={classes.textContainer}>
        {item.address_fi !== '' ? renderAddress() : null}
        {singleValText('mobilityPlatform.content.parkingMachine.location', item.extra.Sijainti)}
        {singleValText('mobilityPlatform.content.parkingMachine.payment', item.extra['Taksa/h'])}
        {singleValText('mobilityPlatform.content.parkingMachine.paymentTypes', item.extra.Maksutapa)}
        {item.extra.Muuta ? singleValText('mobilityPlatform.content.parkingMachine.otherInfo', item.extra.Muuta) : null}
      </div>
    </div>
  );

  return (
    <div className={classes.container}>
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
