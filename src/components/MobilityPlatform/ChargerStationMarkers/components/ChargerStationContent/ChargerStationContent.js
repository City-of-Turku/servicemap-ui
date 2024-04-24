import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import { useIntl } from 'react-intl';
import {
  StyledContainer, StyledHeaderContainer, StyledTextContainer,
} from '../../../styled/styled';
import TextComponent from '../../../TextComponent';

const ChargerStationContent = ({ station }) => {
  const intl = useIntl();

  const titleTypo = messageId => (
    <StyledTextContainer>
      <Typography variant="subtitle2" component="h3">
        {intl.formatMessage({
          id: messageId,
        })}
        :
      </Typography>
    </StyledTextContainer>
  );

  const singleValTypo = (messageId, value) => (
    <StyledTextContainer>
      <Typography variant="body2">{intl.formatMessage({ id: messageId }, { value })}</Typography>
    </StyledTextContainer>
  );

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

  const renderAdministrator = item => {
    const stationAdmin = {
      fi: item.fi,
      en: item.en,
      sv: item.sv,
    };

    return <TextComponent messageId="mobilityPlatform.chargerStations.content.admin" textObj={stationAdmin} />;
  };

  const renderPayment = paymentType => {
    const toLower = paymentType.toLowerCase();
    return (
      <StyledTextContainer>
        <Typography variant="body2">
          {intl.formatMessage({
            id:
              toLower === 'maksullinen'
                ? 'mobilityPlatform.chargerStations.content.charge'
                : 'mobilityPlatform.chargerStations.content.free',
          })}
        </Typography>
      </StyledTextContainer>
    );
  };

  // key property on .map() is long but it's only way to prevent all duplicate keys -warnings.
  const chargerStationInfo = (
    <>
      {station.address ? <TextComponent messageId="mobilityPlatform.content.address" textObj={stationAddress} /> : null}
      {station.extra.administrator.fi !== '' ? renderAdministrator(station.extra.administrator) : null}
      {renderPayment(station.extra.payment)}
      {titleTypo('mobilityPlatform.content.chargersTitle')}
      {station.extra.chargers && station.extra.chargers.length > 0
        ? station.extra.chargers.map(charger => (
          <StyledContentInner key={`${charger.plug}${charger.power}${charger.number}`}>
            {singleValTypo('mobilityPlatform.content.cgsType', charger.plug)}
            {singleValTypo('mobilityPlatform.content.count', charger.number)}
            <Typography variant="body2">
              {intl.formatMessage({ id: 'mobilityPlatform.content.power' }, { value: charger.power })}
            </Typography>
          </StyledContentInner>
        ))
        : null}
    </>
  );

  return (
    <StyledContainer>
      <StyledHeaderContainer>
        <TextComponent textObj={stationName} isTitle />
      </StyledHeaderContainer>
      <div>{chargerStationInfo}</div>
    </StyledContainer>
  );
};

const StyledContentInner = styled.div(({ theme }) => ({
  marginLeft: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

ChargerStationContent.propTypes = {
  station: PropTypes.shape({
    address: PropTypes.string,
    address_fi: PropTypes.string,
    address_en: PropTypes.string,
    address_sv: PropTypes.string,
    name: PropTypes.string,
    name_en: PropTypes.string,
    name_sv: PropTypes.string,
    extra: PropTypes.shape({
      payment: PropTypes.string,
      administrator: PropTypes.shape({
        fi: PropTypes.string,
      }),
      chargers: PropTypes.arrayOf(
        PropTypes.shape({
          plug: PropTypes.string,
          number: PropTypes.string,
          power: PropTypes.string,
        }),
      ),
    }),
  }),
};

ChargerStationContent.defaultProps = {
  station: {},
};

export default ChargerStationContent;
