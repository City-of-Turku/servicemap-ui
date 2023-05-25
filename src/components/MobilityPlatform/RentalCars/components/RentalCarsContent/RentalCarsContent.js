import { Link, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

const RentalCarsContent = ({ classes, intl, car }) => {
  const locale = useSelector(state => state.user.locale);

  const titleText = (messageId, props = {}) => (
    <div className={classes.title}>
      <Typography variant="subtitle1" {...props}>
        {intl.formatMessage({
          id: messageId,
        })}
      </Typography>
    </div>
  );

  const contentText = (messageId, value) => (
    <div className={classes.text}>
      <Typography variant="body2">
        {intl.formatMessage({ id: messageId }, { value })}
      </Typography>
    </div>
  );

  const renderCarInfo = (messageId, manufacturer, model) => (
    <div className={classes.text}>
      <Typography variant="body2">
        {intl.formatMessage({
          id: messageId,
        })}
        :
        {' '}
        {manufacturer}
        {' '}
        {model}
      </Typography>
    </div>
  );

  const serviceProvider = '24Rent';

  const getLink = (address) => {
    if (locale === 'en') {
      return `https://www.24rent.fi/en/#/?city=${address}`;
    }
    return `https://www.24rent.fi/#/?city=${address}`;
  };

  return (
    <div className={classes.container}>
      {titleText('mobilityPlatform.content.rentalCars.title')}
      {contentText('mobilityPlatform.content.general.provider', serviceProvider)}
      <div className={classes.linkContainer}>
        <Link target="_blank" href={getLink(car.homeLocationData.fullAddress)}>
          <Typography className={classes.link} variant="body2">
            {intl.formatMessage({
              id: 'mobilityPlatform.content.rentalCars.link',
            })}

          </Typography>
        </Link>
      </div>
      {renderCarInfo(
        'mobilityPlatform.content.rentalCars.carInfo',
        car.vehicleModelData.manufacturer,
        car.vehicleModelData.name,
      )}
      <div className={classes.text}>
        <Typography variant="body2">
          {car.availabilityData.available
            ? intl.formatMessage({ id: 'mobilityPlatform.content.rentalCars.available' })
            : intl.formatMessage({ id: 'mobilityPlatform.content.rentalCars.reserved' })}
        </Typography>
      </div>
      {contentText('mobilityPlatform.content.rentalCars.address', car.homeLocationData.fullAddress)}
      <div>
        <img src={`https://vehicles-cdn.24rent.fi/${car.id}_medium.jpeg`} alt="shared use car" />
      </div>
    </div>
  );
};

RentalCarsContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  car: PropTypes.objectOf(PropTypes.any),
};

RentalCarsContent.defaultProps = {
  car: null,
};

export default RentalCarsContent;
