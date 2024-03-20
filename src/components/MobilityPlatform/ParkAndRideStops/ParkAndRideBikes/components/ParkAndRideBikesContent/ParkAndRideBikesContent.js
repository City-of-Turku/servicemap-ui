import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import TextComponent from '../../../../TextComponent';

const ParkAndRideBikesContent = ({ item }) => {
  const intl = useIntl();
  const itemName = {
    fi: item.name_fi,
    en: item.name_en,
    sv: item.name_sv,
  };

  const itemAddress = {
    fi: `${item.address_fi}, ${item.address_zip} ${item.municipality}`,
    en: `${item.address_en}, ${item.address_zip} ${item.municipality}`,
    sv: `${item.address_sv}, ${item.address_zip} ${item.municipality}`,
  };

  const loadingPlaceInfo = (
    <StyledContainer>
      <StyledHeaderContainer>
        <TextComponent textObj={itemName} isTitle />
      </StyledHeaderContainer>
      <StyledTextContainer>
        <StyledMargin>
          <Typography variant="body2" component="p">
            {intl.formatMessage({ id: 'mobilityPlatform.parkAndRide.content.subtitle' })}
          </Typography>
        </StyledMargin>
        {item.address_fi !== '' ? (
          <TextComponent messageId="mobilityPlatform.content.address" textObj={itemAddress} />
        ) : null}
      </StyledTextContainer>
    </StyledContainer>
  );

  return <StyledContainer>{loadingPlaceInfo}</StyledContainer>;
};

const StyledContainer = styled.div(({ theme }) => ({
  margin: theme.spacing(1),
}));

const StyledHeaderContainer = styled.div(({ theme }) => ({
  width: '85%',
  borderBottom: '1px solid #000',
  paddingBottom: theme.spacing(0.5),
}));

const StyledTextContainer = styled.div(({ theme }) => ({
  marginTop: theme.spacing(0.5),
}));

const StyledMargin = styled.div(({ theme }) => ({
  margin: theme.spacing(0.4),
}));

ParkAndRideBikesContent.propTypes = {
  item: PropTypes.shape({
    name_fi: PropTypes.string,
    name_en: PropTypes.string,
    name_sv: PropTypes.string,
    address_fi: PropTypes.string,
    address_en: PropTypes.string,
    address_sv: PropTypes.string,
    address_zip: PropTypes.string,
    municipality: PropTypes.string,
  }),
};

ParkAndRideBikesContent.defaultProps = {
  item: {},
};

export default ParkAndRideBikesContent;
