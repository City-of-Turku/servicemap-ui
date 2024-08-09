import { Link, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import {
  StyledContainer, StyledHeaderContainer, StyledTextContainer, StyledBoldText, StyledLinkText,
} from '../../../../../styled/styled';

const ScooterInfo = ({ item, providerName }) => {
  const intl = useIntl();

  const titleTypo = messageId => (
    <Typography variant="subtitle1" component="h3">
      {intl.formatMessage({
        id: messageId,
      })}
    </Typography>
  );

  const singleValTypo = (messageId, value) => (
    <StyledTextContainer>
      <Typography variant="body2">
        {intl.formatMessage({ id: messageId }, { value })}
      </Typography>
    </StyledTextContainer>
  );

  const renderStatus = scooterStatus => {
    if (!scooterStatus) {
      return (
        <StyledTextContainer>
          <Typography variant="body2">
            {intl.formatMessage({ id: 'mobilityPlatform.content.scooter.notReserved' })}
          </Typography>
        </StyledTextContainer>
      );
    } return null;
  };

  const renderLink = (linkUrl, text) => (
    <StyledTextContainer>
      <Link role="link" target="_blank" href={linkUrl}>
        <StyledLinkText variant="body2">
          {text}
        </StyledLinkText>
      </Link>
    </StyledTextContainer>
  );

  const formatRange = range => {
    const rangeKm = (range / 1000).toFixed(2);
    return `${rangeKm} km`;
  };

  return (
    <StyledContainer>
      <StyledHeaderContainer>
        {titleTypo('mobilityPlatform.content.scooter.title')}
      </StyledHeaderContainer>
      <div>
        {singleValTypo('mobilityPlatform.content.general.provider', providerName)}
        {renderStatus(item.is_reserved)}
        {singleValTypo('mobilityPlatform.content.scooter.range', formatRange(item.current_range_meters))}
        <StyledTextContainer>
          <StyledBoldText variant="body2">
            {intl.formatMessage({ id: 'mobilityPlatform.content.general.rentalUris' })}
            :
          </StyledBoldText>
        </StyledTextContainer>
        {renderLink(item.rental_uris.android, 'Android')}
        {renderLink(item.rental_uris.ios, 'iOS')}
      </div>
    </StyledContainer>
  );
};

ScooterInfo.propTypes = {
  item: PropTypes.shape({
    is_reserved: PropTypes.bool,
    current_range_meters: PropTypes.number,
    rental_uris: PropTypes.objectOf(PropTypes.string),
  }),
  providerName: PropTypes.string,
};

ScooterInfo.defaultProps = {
  item: {},
  providerName: '',
};

export default ScooterInfo;
