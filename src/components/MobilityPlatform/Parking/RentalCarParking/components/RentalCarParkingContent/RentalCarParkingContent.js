import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import TextComponent from '../../../../TextComponent';

const RentalCarParkingContent = ({ classes, intl, item }) => {
  const renderText = (msgId, value) => (
    <div className={classes.margin}>
      <Typography variant="body2">
        {value ? intl.formatMessage({ id: msgId }, { value }) : intl.formatMessage({ id: msgId })}
      </Typography>
    </div>
  );

  const formatName = name => name?.split(',')[0];

  const renderAccessInfo = (accessValue) => {
    const accessValueLower = accessValue.toLowerCase();
    if (accessValueLower === 'vapaa pääsy') {
      return renderText('mobilityPlatform.content.publicParking.access');
    }
    return null;
  };

  const translations = {
    placesTotal: 'mobilityPlatform.content.disabledParking.amount',
    totalTime: 'mobilityPlatform.content.publicParking.totalTime',
  };

  const names = {
    fi: formatName(item.name_fi),
    en: formatName(item.name_en),
    sv: formatName(item.name_sv),
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
        {renderText(translations.placesTotal, item.extra.Paikkoja_y)}
        {item.extra.Max_aika_h ? renderText(translations.totalTime, item.extra.Max_aika_h) : null}
        {item.extra.Rajoit_lis ? <TextComponent textObj={item.extra.Rajoit_lis} /> : null}
        {renderAccessInfo(item.extra.Saavutetta)}
      </div>
    </div>
  );
};

RentalCarParkingContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  item: PropTypes.objectOf(PropTypes.any),
};

RentalCarParkingContent.defaultProps = {
  item: {},
};

export default RentalCarParkingContent;
