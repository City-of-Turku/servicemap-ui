import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import styled from '@emotion/styled';
import { StyledHeaderContainer, StyledTextContainer } from '../../../styled/styled';

const ParkingChargeZoneContent = ({ parkingChargeZone }) => {
  const intl = useIntl();

  const renderTitle = (msgId, objValue) => (
    <StyledHeaderContainer>
      <Typography variant="subtitle1" component="h3">
        {intl.formatMessage(
          {
            id: msgId,
          },
          { value: objValue },
        )}
      </Typography>
    </StyledHeaderContainer>
  );

  const renderText = (msgId, objValue) => (
    <StyledTextContainer>
      <Typography variant="body2" component="p">
        {intl.formatMessage(
          {
            id: msgId,
          },
          { value: objValue },
        )}
      </Typography>
    </StyledTextContainer>
  );

  return (
    <StyledPadding>
      {renderTitle('mobilityPlatform.content.parkingChargeZones.zone', parkingChargeZone.extra.maksuvyohyke)}
      {renderText(
        'mobilityPlatform.content.parkingChargeZones.price.weekDays',
        parkingChargeZone.extra.maksullisuus_arki,
      )}
      {renderText(
        'mobilityPlatform.content.parkingChargeZones.price.saturday',
        parkingChargeZone.extra.maksullisuus_lauantai,
      )}
      {renderText(
        'mobilityPlatform.content.parkingChargeZones.price.sunday',
        parkingChargeZone.extra.maksullisuus_sunnuntai,
      )}
      {renderText('mobilityPlatform.content.parkingChargeZones.price', parkingChargeZone.extra.maksuvyohykehinta)}
    </StyledPadding>
  );
};

const StyledPadding = styled.div(({ theme }) => ({
  padding: theme.spacing(1),
}));

ParkingChargeZoneContent.propTypes = {
  parkingChargeZone: PropTypes.shape({
    extra: PropTypes.shape({
      maksuvyohyke: PropTypes.string,
      maksullisuus_arki: PropTypes.string,
      maksullisuus_lauantai: PropTypes.string,
      maksullisuus_sunnuntai: PropTypes.string,
      maksuvyohykehinta: PropTypes.string,
    }),
  }),
};

ParkingChargeZoneContent.defaultProps = {
  parkingChargeZone: {},
};

export default ParkingChargeZoneContent;
