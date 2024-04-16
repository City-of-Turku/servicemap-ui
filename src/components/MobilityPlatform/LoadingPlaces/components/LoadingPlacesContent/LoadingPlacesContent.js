import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import TextComponent from '../../../TextComponent';
import { StyledContainer, StyledHeaderContainer } from '../../../styled/styled';

const LoadingPlacesContent = ({ item }) => {
  const loadingPlaceName = {
    fi: item.name_fi,
    en: item.name_en,
    sv: item.name_sv,
  };

  const loadingPlaceAddress = {
    fi: item.address_fi,
    en: item.address_en,
    sv: item.address_sv,
  };

  const loadingPlaceInfo = (
    <StyledContainer>
      <StyledHeaderContainer>
        <TextComponent textObj={loadingPlaceName} isTitle />
      </StyledHeaderContainer>
      <StyledMargin>
        {item.address_fi !== '' ? (
          <TextComponent messageId="mobilityPlatform.content.address" textObj={loadingPlaceAddress} />
        ) : null}
        <TextComponent textObj={item.extra.lastauspiste} />
        <TextComponent textObj={item.extra.Saavutettavuus} />
        <TextComponent textObj={item.extra.rajoitustyyppi} />
      </StyledMargin>
    </StyledContainer>
  );

  return loadingPlaceInfo;
};

const StyledMargin = styled.div(({ theme }) => ({
  marginTop: theme.spacing(0.5),
}));

LoadingPlacesContent.propTypes = {
  item: PropTypes.shape({
    address_fi: PropTypes.string,
    address_en: PropTypes.string,
    address_sv: PropTypes.string,
    name_fi: PropTypes.string,
    name_en: PropTypes.string,
    name_sv: PropTypes.string,
    extra: PropTypes.shape({
      lastauspiste: PropTypes.objectOf(PropTypes.string),
      Saavutettavuus: PropTypes.objectOf(PropTypes.string),
      rajoitustyyppi: PropTypes.objectOf(PropTypes.string),
    }),
  }),
};

LoadingPlacesContent.defaultProps = {
  item: {},
};

export default LoadingPlacesContent;
