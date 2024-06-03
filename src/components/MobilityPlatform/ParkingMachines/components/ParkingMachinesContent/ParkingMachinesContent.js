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

  const paymentType = {
    fi: item.extra.maksutapa_fi,
    en: item.extra.maksutapa_en,
    sv: item.extra.maksutapa_sv,
  };

  const otherInfo = {
    fi: item.extra.muu_tieto_fi,
    en: item.extra.muu_tieto_en,
    sv: item.extra.muu_tieto_sv,
  };

  const parkingMachineInfo = (
    <StyledContainer>
      <StyledHeaderContainer>
        <Typography variant="subtitle1" component="h3">
          {intl.formatMessage({ id: 'mobilityPlatform.content.parkingMachine.title' })}
        </Typography>
      </StyledHeaderContainer>
      <div>
        {item?.address_fi ? <TextComponent messageId="mobilityPlatform.content.address" textObj={machineAddress} /> : null}
        {singleValText('mobilityPlatform.content.parkingMachine.payment', item?.extra?.taksa)}
        <TextComponent messageId="mobilityPlatform.content.parkingMachine.paymentTypes" textObj={paymentType} />
        {item?.extra?.muu_tieto_fi ? <TextComponent messageId="mobilityPlatform.content.parkingMachine.otherInfo" textObj={otherInfo} /> : null}
      </div>
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
      maksutapa_fi: PropTypes.string,
      maksutapa_en: PropTypes.string,
      maksutapa_sv: PropTypes.string,
      taksa: PropTypes.string,
      muu_tieto_fi: PropTypes.string,
      muu_tieto_en: PropTypes.string,
      muu_tieto_sv: PropTypes.string,
    }),
  }),
};

ParkingMachinesContent.defaultProps = {
  item: {},
};

export default ParkingMachinesContent;
