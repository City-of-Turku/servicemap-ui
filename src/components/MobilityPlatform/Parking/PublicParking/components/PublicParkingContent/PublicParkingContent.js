import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import { StyledContainer, StyledHeaderContainer, StyledTextContainer } from '../../../../styled/styled';
import TextComponent from '../../../../TextComponent';

const PublicParkingContent = ({ item }) => {
  const intl = useIntl();

  const renderText = (msgId, value) => (
    <StyledTextContainer>
      <Typography variant="body2">
        {value ? intl.formatMessage({ id: msgId }, { value }) : intl.formatMessage({ id: msgId })}
      </Typography>
    </StyledTextContainer>
  );

  const renderAccessInfo = accessValue => {
    const accessValueLower = accessValue.toLowerCase();
    if (accessValueLower === 'vapaa paasy') {
      return renderText('mobilityPlatform.content.publicParking.access');
    }
    if (accessValueLower === 'portti' || accessValueLower === 'portti, joka on auki') {
      return renderText('mobilityPlatform.content.publicParking.access.gate');
    }
    if (accessValueLower === 'puomi') {
      return renderText('mobilityPlatform.content.publicParking.access.barrier');
    }
    return null;
  };

  const translations = {
    placesTotal: 'mobilityPlatform.content.disabledParking.amount',
    totalTime: 'mobilityPlatform.content.publicParking.totalTime',
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
        {renderText(translations.placesTotal, item.extra.paikkoja_y)}
        {item.extra.max_aika_h ? renderText(translations.totalTime, item.extra.max_aika_h) : null}
        {item.extra.rajoitustyyppi ? <TextComponent textObj={item.extra.rajoitustyyppi} /> : null}
        {item.extra.rajoit_lisat ? <TextComponent textObj={item.extra.rajoit_lisat} /> : null}
        {renderAccessInfo(item.extra.saavutettavuus.fi)}
      </div>
    </StyledContainer>
  );
};

PublicParkingContent.propTypes = {
  item: PropTypes.shape({
    address_fi: PropTypes.string,
    address_en: PropTypes.string,
    address_sv: PropTypes.string,
    name_fi: PropTypes.string,
    name_en: PropTypes.string,
    name_sv: PropTypes.string,
    extra: PropTypes.shape({
      paikkoja_y: PropTypes.number,
      max_aika_h: PropTypes.number,
      rajoitustyyppi: PropTypes.objectOf(PropTypes.string),
      rajoit_lisat: PropTypes.objectOf(PropTypes.string),
      saavutettavuus: PropTypes.objectOf(PropTypes.string),
    }),
  }),
};

PublicParkingContent.defaultProps = {
  item: {},
};

export default PublicParkingContent;
