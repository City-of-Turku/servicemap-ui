import PropTypes from 'prop-types';
import React from 'react';
import { Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import { StyledContainer, StyledHeaderContainer, StyledTextContainer } from '../../../../styled/styled';
import TextComponent from '../../../../TextComponent';

const ParkAndRideBikesContent = ({ item }) => {
  const intl = useIntl();
  const itemName = {
    fi: item.name_fi,
    en: item.name_en,
    sv: item.name_sv,
  };

  /**
   * Take string (like kaarina) and return the same string with first character in uppercase.
   * @param {*string} str
   * @returns string
   */
  const toSentenceCase = str => {
    if (str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return '';
  };

  const itemAddress = {
    fi: `${item.address_fi}, ${item.address_zip} ${toSentenceCase(item.municipality)}`,
    en: `${item.address_en}, ${item.address_zip} ${toSentenceCase(item.municipality)}`,
    sv: `${item.address_sv}, ${item.address_zip} ${toSentenceCase(item.municipality)}`,
  };

  const parkAndRideInfo = (
    <StyledContainer>
      <StyledHeaderContainer>
        <TextComponent textObj={itemName} isTitle />
      </StyledHeaderContainer>
      <div>
        <StyledTextContainer>
          <Typography variant="body2" component="p">
            {intl.formatMessage({ id: 'mobilityPlatform.parkAndRide.content.subtitle' })}
          </Typography>
        </StyledTextContainer>
        {item.address_fi !== '' ? (
          <TextComponent messageId="mobilityPlatform.content.address" textObj={itemAddress} />
        ) : null}
      </div>
    </StyledContainer>
  );

  return <StyledContainer>{parkAndRideInfo}</StyledContainer>;
};

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
