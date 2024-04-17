import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import { StyledContainer, StyledHeaderContainer, StyledTextContainer } from '../../../styled/styled';
import TextComponent from '../../../TextComponent';

const ParkingMachinesContent = ({ item }) => {
  const intl = useIntl();

  /** For values that are not objects and do not contain localized strings */
  const singleValText = (messageId, value) => (
    <StyledTextContainer>
      <Typography component="p" variant="body2">
        {intl.formatMessage({ id: messageId }, { value })}
      </Typography>
    </StyledTextContainer>
  );

  const machineAddress = {
    fi: item.address_fi,
    en: item.address_en,
    sv: item.address_sv,
  };

  const formatPrice = price => price.toString().replace('.', ',');

  const parkingMachineInfo = (
    <StyledContainer>
      <StyledHeaderContainer>
        <Typography variant="subtitle1" component="h3">
          {intl.formatMessage({ id: 'mobilityPlatform.content.parkingMachine.title' })}
        </Typography>
      </StyledHeaderContainer>
      <StyledTextContainer>
        {item.address_fi ? <TextComponent messageId="mobilityPlatform.content.address" textObj={machineAddress} /> : null}
        <TextComponent messageId="mobilityPlatform.content.parkingMachine.location" textObj={item.extra.Sijainti} />
        {singleValText('mobilityPlatform.content.parkingMachine.payment', formatPrice(item.extra['Taksa/h']))}
        <TextComponent messageId="mobilityPlatform.content.parkingMachine.paymentTypes" textObj={item.extra.Maksutapa} />
        {item.extra.Muuta ? singleValText('mobilityPlatform.content.parkingMachine.otherInfo', item.extra.Muuta) : null}
      </StyledTextContainer>
    </StyledContainer>
  );

  return (
    <div>
      {parkingMachineInfo}
    </div>
  );
};

ParkingMachinesContent.propTypes = {
  item: PropTypes.shape({
    address_fi: PropTypes.string,
    address_en: PropTypes.string,
    address_sv: PropTypes.string,
    extra: PropTypes.shape({
      Sijainti: PropTypes.objectOf(PropTypes.string),
      Maksutapa: PropTypes.objectOf(PropTypes.string),
      'Taksa/h': PropTypes.string,
      Muuta: PropTypes.string,
    }),
  }),
};

ParkingMachinesContent.defaultProps = {
  item: {},
};

export default ParkingMachinesContent;
