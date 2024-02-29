/* eslint-disable react/jsx-props-no-spreading */
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import { useIntl } from 'react-intl';
import TextComponent from '../../../TextComponent';

const ChargerStationContent = ({ station }) => {
  const intl = useIntl();

  const titleTypo = (messageId, props = {}) => (
    <div {...props}>
      <Typography variant="subtitle2" component="h3">
        {intl.formatMessage({
          id: messageId,
        })}
        :
      </Typography>
    </div>
  );

  const singleValTypo = (messageId, value, props = {}) => (
    <div {...props}>
      <Typography variant="body2">{intl.formatMessage({ id: messageId }, { value })}</Typography>
    </div>
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

  const renderPayment = (paymentType, props = {}) => {
    const toLower = paymentType.toLowerCase();
    return (
      <div {...props}>
        <Typography variant="body2">
          {intl.formatMessage({
            id:
              toLower === 'maksullinen'
                ? 'mobilityPlatform.chargerStations.content.charge'
                : 'mobilityPlatform.chargerStations.content.free',
          })}
        </Typography>
      </div>
    );
  };

  // key property on .map() is long but it's only way to prevent all duplicate keys -warnings.
  const chargerStationInfo = (
    <>
      {station.address ? <TextComponent messageId="mobilityPlatform.content.address" textObj={stationAddress} /> : null}
      {station.extra.administrator.fi !== '' ? renderAdministrator(station.extra.administrator) : null}
      {renderPayment(station.extra.payment, { style: { margin: '3px' } })}
      {titleTypo('mobilityPlatform.content.chargersTitle', { style: { margin: '3px' } })}
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
      <StyledTextContainer>{chargerStationInfo}</StyledTextContainer>
    </StyledContainer>
  );
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

const StyledContentInner = styled.div(({ theme }) => ({
  marginLeft: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

ChargerStationContent.propTypes = {
  station: PropTypes.shape({
    name: PropTypes.string,
    name_fi: PropTypes.string,
    name_en: PropTypes.string,
    name_sv: PropTypes.string,
    address: PropTypes.string,
    address_fi: PropTypes.string,
    address_en: PropTypes.string,
    address_sv: PropTypes.string,
    extra: PropTypes.shape({
      administrator: PropTypes.objectOf(PropTypes.string),
      payment: PropTypes.string,
      chargers: PropTypes.arrayOf(
        PropTypes.shape({
          plug: PropTypes.string,
          power: PropTypes.string,
          number: PropTypes.string,
        }),
      ),
    }),
  }),
};

ChargerStationContent.defaultProps = {
  station: {},
};

export default ChargerStationContent;
