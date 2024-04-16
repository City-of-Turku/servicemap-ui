import PropTypes from 'prop-types';
import React from 'react';
import { StyledContainer, StyledHeaderContainer, StyledTextContainer } from '../../../styled/styled';
import TextComponent from '../../../TextComponent';

const BikeServiceStationContent = ({ station }) => {
  const stationName = {
    fi: station.name,
    en: station.name_en,
    sv: station.name_sv,
  };

  const stationAddress = {
    fi: station.address_fi,
    en: station.address_en,
    sv: station.address_sv,
  };

  const stationDesc = {
    fi: station.description,
    en: station.description_en,
    sv: station.description_sv,
  };

  const bikeServiceStationInfo = (
    <StyledContainer>
      <StyledHeaderContainer>
        <TextComponent textObj={stationName} isTitle />
      </StyledHeaderContainer>
      <StyledTextContainer>
        {station.address ? <TextComponent messageId="mobilityPlatform.content.address" textObj={stationAddress} /> : null}
        <TextComponent textObj={stationDesc} />
      </StyledTextContainer>
    </StyledContainer>
  );

  return (
    bikeServiceStationInfo
  );
};

BikeServiceStationContent.propTypes = {
  station: PropTypes.shape({
    address: PropTypes.string,
    address_fi: PropTypes.string,
    address_en: PropTypes.string,
    address_sv: PropTypes.string,
    name: PropTypes.string,
    name_en: PropTypes.string,
    name_sv: PropTypes.string,
    description: PropTypes.string,
    description_en: PropTypes.string,
    description_sv: PropTypes.string,
  }),
};

BikeServiceStationContent.defaultProps = {
  station: {},
};

export default BikeServiceStationContent;
