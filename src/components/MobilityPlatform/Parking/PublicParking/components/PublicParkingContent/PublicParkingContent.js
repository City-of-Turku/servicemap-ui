import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import useLocaleText from '../../../../../../utils/useLocaleText';

const PublicParkingContent = ({ classes, intl, item }) => {
  const getLocaleText = useLocaleText();

  const renderText = (msgId, value) => (
    <Typography variant="body2">
      {value ? intl.formatMessage({ id: msgId }, { value }) : intl.formatMessage({ id: msgId })}
    </Typography>
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

  const renderLocaleText = obj => <Typography variant="body2">{getLocaleText(obj)}</Typography>;

  const translations = {
    placesTotal: 'mobilityPlatform.content.disabledParking.amount',
    totalTime: 'mobilityPlatform.content.publicParking.totalTime',
  };

  const names = {
    fi: item.name_fi,
    en: item.name_en,
    sv: item.name_sv,
  };

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <Typography variant="subtitle1">{getLocaleText(names)}</Typography>
      </div>
      <div className={classes.textContainer}>
        {renderText(translations.placesTotal, item.extra.paikkoja_y)}
        {item.extra.max_aika_h ? renderText(translations.totalTime, item.extra.max_aika_h) : null}
        {item.extra.rajoitustyyppi ? renderLocaleText(item.extra.rajoitustyyppi) : null}
        {item.extra.rajoit_lisat ? renderLocaleText(item.extra.rajoit_lisat) : null}
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
