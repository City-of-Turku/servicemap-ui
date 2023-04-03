import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import TextComponent from '../../../../TextComponent';

const PublicParkingContent = ({ classes, intl, item }) => {
  const renderText = (msgId, value) => (
    <div className={classes.margin}>
      <Typography variant="body2">
        {value ? intl.formatMessage({ id: msgId }, { value }) : intl.formatMessage({ id: msgId })}
      </Typography>
    </div>
  );

  const renderAccessInfo = (accessValue) => {
    const accessValueLower = accessValue.toLowerCase();
    if (accessValueLower === 'vapaa paasy') {
      return renderText('mobilityPlatform.content.publicParking.access');
    }
    if (accessValueLower === 'portti' || accessValueLower === 'portti, joka on auki') {
      return renderText('mobilityPlatform.content.publicParking.access.gate');
    }
    if (accessValueLower === 'puomi') {
      return renderText('mobilityPlatform.content.publicParking.access.barrier');
    }
    return null;
  };

  const translations = {
    placesTotal: 'mobilityPlatform.content.disabledParking.amount',
    totalTime: 'mobilityPlatform.content.publicParking.totalTime',
  };

  const names = {
    fi: item.name_fi,
    en: item.name_en,
    sv: item.name_sv,
  };

  const addressObj = {
    fi: item.address_fi,
    en: item.address_en,
    sv: item.address_sv,
  };

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <TextComponent textObj={names} isTitle />
      </div>
      <div className={classes.textContainer}>
        <TextComponent messageId="mobilityPlatform.content.address" textObj={addressObj} />
        {renderText(translations.placesTotal, item.extra.paikkoja_y)}
        {item.extra.max_aika_h ? renderText(translations.totalTime, item.extra.max_aika_h) : null}
        {item.extra.rajoitustyyppi ? <TextComponent textObj={item.extra.rajoitustyyppi} /> : null}
        {item.extra.rajoit_lisat ? <TextComponent textObj={item.extra.rajoit_lisat} /> : null}
        {renderAccessInfo(item.extra.saavutettavuus.fi)}
      </div>
    </div>
  );
};

PublicParkingContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  item: PropTypes.objectOf(PropTypes.any),
};

PublicParkingContent.defaultProps = {
  item: {},
};

export default PublicParkingContent;
