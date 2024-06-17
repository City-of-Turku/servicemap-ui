import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import { StyledContainer, StyledHeaderContainer, StyledTextContainer } from '../../../../styled/styled';
import TextComponent from '../../../../TextComponent';

const ParkingGarageContent = ({ item }) => {
  const intl = useIntl();

  const renderText = (msgId, value) => (
    <StyledTextContainer>
      <Typography variant="body2">
        {value ? intl.formatMessage({ id: msgId }, { value }) : intl.formatMessage({ id: msgId })}
      </Typography>
    </StyledTextContainer>
  );

  const translations = {
    parkingCapacity: 'mobilityPlatform.content.parking.capacity',
    disabledParking: 'mobilityPlatform.content.parking.disabled.capacity',
    chargers: 'mobilityPlatform.content.parking.chargers.capacity',
  };

  const names = {
    fi: item.name_fi,
    en: item.name_en,
    sv: item.name_sv,
  };

  const addressObj = {
    fi: item.address_fi,
    en: item.address_en,
    sv: item.address_sv,
  };

  return (
    <StyledContainer>
      <StyledHeaderContainer>
        <TextComponent textObj={names} isTitle />
      </StyledHeaderContainer>
      <div>
        <TextComponent messageId="mobilityPlatform.content.address" textObj={addressObj} />
        {item?.extra?.parking_spaces ? renderText(translations.parkingCapacity, item?.extra?.parking_spaces) : null}
        {item?.extra?.disabled_spaces ? renderText(translations.disabledParking, item?.extra?.disabled_spaces) : null}
        {item?.extra?.charging_stations !== '' ? renderText(translations.chargers, item?.extra?.charging_stations) : null}
        {item?.extra?.services?.fi !== '' ? <TextComponent textObj={item.extra.services} /> : null}
      </div>
    </StyledContainer>
  );
};

ParkingGarageContent.propTypes = {
  item: PropTypes.shape({
    address_fi: PropTypes.string,
    address_en: PropTypes.string,
    address_sv: PropTypes.string,
    name_fi: PropTypes.string,
    name_en: PropTypes.string,
    name_sv: PropTypes.string,
    extra: PropTypes.shape({
      parking_spaces: PropTypes.number,
      disabled_spaces: PropTypes.number,
      charging_stations: PropTypes.string,
      services: PropTypes.shape({
        fi: PropTypes.string,
        en: PropTypes.string,
        sv: PropTypes.string,
      }),
    }),
  }),
};

ParkingGarageContent.defaultProps = {
  item: {},
};

export default ParkingGarageContent;
