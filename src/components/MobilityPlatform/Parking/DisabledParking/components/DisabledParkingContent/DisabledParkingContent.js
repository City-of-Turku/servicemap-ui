import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import useLocaleText from '../../../../../../utils/useLocaleText';
import { StyledContainer, StyledHeaderContainer, StyledTextContainer } from '../../../../styled/styled';

const DisabledParkingContent = ({ item }) => {
  const intl = useIntl();
  const getLocaleText = useLocaleText();

  const renderAccessInfo = accessValue => {
    const accessValueLower = accessValue.toLowerCase();
    if (accessValueLower === 'vapaa paasy') {
      return (
        <StyledTextContainer>
          <Typography variant="body2">
            {intl.formatMessage({ id: 'mobilityPlatform.content.publicParking.access' })}
          </Typography>
        </StyledTextContainer>
      );
    }
    if (accessValueLower === 'portti') {
      return (
        <StyledTextContainer>
          <Typography variant="body2">
            {intl.formatMessage({ id: 'mobilityPlatform.content.publicParking.access.gate' })}
          </Typography>
        </StyledTextContainer>
      );
    }
    return null;
  };

  const renderText = (msgId, value) => (
    <StyledTextContainer>
      <Typography variant="body2">{intl.formatMessage({ id: msgId }, { value })}</Typography>
    </StyledTextContainer>
  );

  const parkingAreaAddress = {
    fi: item.address_fi,
    en: item.address_en,
    sv: item.address_sv,
  };

  const renderAddress = () => renderText('mobilityPlatform.content.address', getLocaleText(parkingAreaAddress));

  return (
    <StyledContainer>
      <StyledHeaderContainer>
        <Typography variant="subtitle1" component="h3">
          {intl.formatMessage({ id: 'mobilityPlatform.content.disabledParking.title' })}
        </Typography>
      </StyledHeaderContainer>
      <div>
        {renderAddress()}
        {renderText('mobilityPlatform.content.disabledParking.amount', item.extra.invapaikkoja)}
        <StyledTextContainer>
          <Typography variant="body2">{getLocaleText(item.extra.rajoitustyyppi)}</Typography>
        </StyledTextContainer>
        {renderAccessInfo(item.extra.saavutettavuus.fi)}
      </div>
    </StyledContainer>
  );
};

DisabledParkingContent.propTypes = {
  item: PropTypes.shape({
    address_fi: PropTypes.string,
    address_en: PropTypes.string,
    address_sv: PropTypes.string,
    extra: PropTypes.shape({
      invapaikkoja: PropTypes.number,
      rajoitustyyppi: PropTypes.objectOf(PropTypes.string),
      saavutettavuus: PropTypes.objectOf(PropTypes.string),
    }),
  }),
};

DisabledParkingContent.defaultProps = {
  item: {},
};

export default DisabledParkingContent;
