import PropTypes from 'prop-types';
import React from 'react';
import { StyledContainer, StyledHeaderContainer, StyledTextContainer } from '../../../styled/styled';
import TextComponent from '../../../TextComponent';

const OutdoorGymDevicesContent = ({ item }) => {
  const deviceName = {
    fi: item.name_fi,
    en: item.name_en,
    sv: item.name_sv,
  };

  const deviceAddress = {
    fi: item.address_fi,
    en: item.address_en,
    sv: item.address_sv,
  };

  const deviceDescription = {
    fi: item.description_fi,
    en: item.description_en,
    sv: item.description_sv,
  };

  return (
    <StyledContainer>
      <StyledHeaderContainer>
        <TextComponent textObj={deviceName} isTitle />
      </StyledHeaderContainer>
      <StyledTextContainer>
        {item.address_fi !== '' ? <TextComponent messageId="mobilityPlatform.content.address" textObj={deviceAddress} /> : null}
        <TextComponent textObj={deviceDescription} />
      </StyledTextContainer>
    </StyledContainer>
  );
};

OutdoorGymDevicesContent.propTypes = {
  item: PropTypes.shape({
    address_fi: PropTypes.string,
    address_en: PropTypes.string,
    address_sv: PropTypes.string,
    name_fi: PropTypes.string,
    name_en: PropTypes.string,
    name_sv: PropTypes.string,
    description_fi: PropTypes.string,
    description_en: PropTypes.string,
    description_sv: PropTypes.string,
  }),
};

OutdoorGymDevicesContent.defaultProps = {
  item: {},
};

export default OutdoorGymDevicesContent;
