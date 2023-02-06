import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import useLocaleText from '../../../../../utils/useLocaleText';
import AddressText from '../../../AddressText';
import TextComponent from '../../../TextComponent';

const ChargerStationContent = ({ classes, intl, station }) => {
  const getLocaleText = useLocaleText();

  const titleTypo = (messageId, props = {}) => (
    <div {...props}>
      <Typography variant="subtitle2">
        {intl.formatMessage({
          id: messageId,
        })}
        :
      </Typography>
    </div>
  );

  const singleValTypo = (messageId, value, props = {}) => (
    <div {...props}>
      <Typography variant="body2">
        {intl.formatMessage({ id: messageId }, { value })}
      </Typography>
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

  const renderAdministrator = (item) => {
    const stationAdmin = {
      fi: item.fi,
      en: item.en,
      sv: item.sv,
    };

    return singleValTypo('mobilityPlatform.chargerStations.content.admin', getLocaleText(stationAdmin), { className: classes.margin });
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
      {station.address ? <AddressText addressObj={stationAddress} /> : null}
      {station.extra.administrator.fi !== '' ? renderAdministrator(station.extra.administrator) : null}
      {renderPayment(station.extra.payment, { className: classes.margin })}
      {titleTypo('mobilityPlatform.content.chargersTitle', { className: classes.margin })}
      {station.extra.chargers && station.extra.chargers.length > 0
        ? station.extra.chargers.map(charger => (
          <div key={`${charger.plug}${charger.power}${charger.number}`} className={classes.contentInner}>
            {singleValTypo('mobilityPlatform.content.cgsType', charger.plug)}
            {singleValTypo('mobilityPlatform.content.count', charger.number)}
            <Typography variant="body2">
              {intl.formatMessage({ id: 'mobilityPlatform.content.power' }, { value: charger.power })}
            </Typography>
          </div>
        ))
        : null}
    </>
  );

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <TextComponent textObj={stationName} isTitle />
      </div>
      <div className={classes.textContainer}>
        {chargerStationInfo}
      </div>
    </div>
  );
};

ChargerStationContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  station: PropTypes.objectOf(PropTypes.any),
};

ChargerStationContent.defaultProps = {
  station: {},
};

export default ChargerStationContent;
