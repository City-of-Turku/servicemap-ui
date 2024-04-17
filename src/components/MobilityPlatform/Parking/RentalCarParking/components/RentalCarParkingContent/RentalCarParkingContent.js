import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import { StyledContainer, StyledHeaderContainer, StyledTextContainer } from '../../../../styled/styled';
import TextComponent from '../../../../TextComponent';

const RentalCarParkingContent = ({ item }) => {
  const intl = useIntl();

  const renderText = (msgId, value) => (
    <StyledTextContainer>
      <Typography variant="body2">
        {value ? intl.formatMessage({ id: msgId }, { value }) : intl.formatMessage({ id: msgId })}
      </Typography>
    </StyledTextContainer>
  );

  const formatName = name => name?.split(',')[0];

  const renderAccessInfo = accessValue => {
    const accessValueLower = accessValue.toLowerCase();
    if (accessValueLower === 'vapaa pääsy') {
      return renderText('mobilityPlatform.content.publicParking.access');
    }
    return null;
  };

  const translations = {
    placesTotal: 'mobilityPlatform.content.disabledParking.amount',
    totalTime: 'mobilityPlatform.content.publicParking.totalTime',
  };

  const names = {
    fi: formatName(item.name_fi),
    en: formatName(item.name_en),
    sv: formatName(item.name_sv),
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
        {renderText(translations.placesTotal, item.extra.Paikkoja_y)}
        {item.extra.Max_aika_h ? renderText(translations.totalTime, item.extra.Max_aika_h) : null}
        {item.extra.Rajoit_lis ? <TextComponent textObj={item.extra.Rajoit_lis} /> : null}
        {renderAccessInfo(item.extra.Saavutetta)}
      </div>
    </StyledContainer>
  );
};

RentalCarParkingContent.propTypes = {
  item: PropTypes.shape({
    address_fi: PropTypes.string,
    address_en: PropTypes.string,
    address_sv: PropTypes.string,
    name_fi: PropTypes.string,
    name_en: PropTypes.string,
    name_sv: PropTypes.string,
    extra: PropTypes.shape({
      Paikkoja_y: PropTypes.string,
      Max_aika_h: PropTypes.number,
      Rajoit_lis: PropTypes.objectOf(PropTypes.string),
      Saavutetta: PropTypes.objectOf(PropTypes.string),
    }),
  }),
};

RentalCarParkingContent.defaultProps = {
  item: {},
};

export default RentalCarParkingContent;
