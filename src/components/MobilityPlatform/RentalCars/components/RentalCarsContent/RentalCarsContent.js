import { Link, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import styled from '@emotion/styled';
import {
  StyledContainer, StyledHeaderContainer, StyledTextContainer, StyledLinkText,
} from '../../../styled/styled';

const RentalCarsContent = ({ car }) => {
  const intl = useIntl();
  const locale = useSelector(state => state.user.locale);

  const titleText = messageId => (
    <StyledHeaderContainer>
      <Typography variant="subtitle1" component="h3">
        {intl.formatMessage({
          id: messageId,
        })}
      </Typography>
    </StyledHeaderContainer>
  );

  const contentText = (messageId, value) => (
    <StyledTextContainer>
      <Typography variant="body2">
        {intl.formatMessage({ id: messageId }, { value })}
      </Typography>
    </StyledTextContainer>
  );

  const renderCarInfo = (messageId, manufacturer, model) => (
    <StyledTextContainer>
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
    </StyledTextContainer>
  );

  const serviceProvider = '24Rent';

  const getLink = address => {
    if (locale === 'en') {
      return `https://www.24rent.fi/en/#/?city=${address}`;
    }
    return `https://www.24rent.fi/#/?city=${address}`;
  };

  return (
    <StyledContainer>
      {titleText('mobilityPlatform.content.rentalCars.title')}
      {contentText('mobilityPlatform.content.general.provider', serviceProvider)}
      <StyledLinkContainer>
        <Link role="link" target="_blank" href={getLink(car.homeLocationData.fullAddress)}>
          <StyledLinkText variant="body2">
            {intl.formatMessage({
              id: 'mobilityPlatform.content.rentalCars.link',
            })}
          </StyledLinkText>
        </Link>
      </StyledLinkContainer>
      {renderCarInfo(
        'mobilityPlatform.content.rentalCars.carInfo',
        car.vehicleModelData.manufacturer,
        car.vehicleModelData.name,
      )}
      <StyledTextContainer>
        <Typography variant="body2">
          {car.availabilityData.available
            ? intl.formatMessage({ id: 'mobilityPlatform.content.rentalCars.available' })
            : intl.formatMessage({ id: 'mobilityPlatform.content.rentalCars.reserved' })}
        </Typography>
      </StyledTextContainer>
      {contentText('mobilityPlatform.content.rentalCars.address', car.homeLocationData.fullAddress)}
      <div>
        <img src={`https://vehicles-cdn.24rent.fi/${car.id}_medium.jpeg`} alt="shared use car" />
      </div>
    </StyledContainer>
  );
};

const StyledLinkContainer = styled.div(({ theme }) => ({
  marginTop: theme.spacing(0.4),
  width: '55%',
}));

RentalCarsContent.propTypes = {
  car: PropTypes.shape({
    id: PropTypes.string,
    homeLocationData: PropTypes.shape({
      fullAddress: PropTypes.string,
    }),
    vehicleModelData: PropTypes.shape({
      manufacturer: PropTypes.string,
      name: PropTypes.string,
    }),
    availabilityData: PropTypes.objectOf(PropTypes.bool),
  }),
};

RentalCarsContent.defaultProps = {
  car: {},
};

export default RentalCarsContent;
