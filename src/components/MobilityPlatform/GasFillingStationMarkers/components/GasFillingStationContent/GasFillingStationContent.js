import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import {
  StyledContainer, StyledHeaderContainer, StyledTextContainer, StyledMargin,
} from '../../../styled/styled';

const GasFillingStationContent = ({ station }) => {
  const intl = useIntl();

  const singleValTypo = (messageId, value) => (
    <StyledMargin>
      <Typography variant="body2">
        {intl.formatMessage({ id: messageId }, { value })}
      </Typography>
    </StyledMargin>
  );

  const gasFillingStationInfo = (
    <>
      {singleValTypo('mobilityPlatform.content.address', station.address)}
      {singleValTypo('mobilityPlatform.content.gfsType', station.extra.lng_cng)}
      {singleValTypo('mobilityPlatform.content.operator', station.extra.operator)}
    </>
  );

  return (
    <StyledContainer>
      <StyledHeaderContainer>
        <Typography variant="subtitle1" component="h3">
          {station.name}
        </Typography>
      </StyledHeaderContainer>
      <StyledTextContainer>
        {gasFillingStationInfo}
      </StyledTextContainer>
    </StyledContainer>
  );
};

GasFillingStationContent.propTypes = {
  station: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
    extra: PropTypes.shape({
      operator: PropTypes.string,
      lng_cng: PropTypes.string,
    }),
  }),
};

GasFillingStationContent.defaultProps = {
  station: {},
};

export default GasFillingStationContent;
