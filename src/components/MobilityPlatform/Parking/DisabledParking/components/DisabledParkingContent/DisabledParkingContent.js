import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import useLocaleText from '../../../../../../utils/useLocaleText';

const DisabledParkingContent = ({ classes, intl, item }) => {
  const getLocaleText = useLocaleText();

  const renderAccessInfo = (accessValue) => {
    const accessValueLower = accessValue.toLowerCase();
    if (accessValueLower === 'vapaa paasy') {
      return (
        <Typography variant="body2">
          {intl.formatMessage({ id: 'mobilityPlatform.content.publicParking.access' })}
        </Typography>
      );
    }
    if (accessValueLower === 'portti') {
      return (
        <Typography variant="body2">
          {intl.formatMessage({ id: 'mobilityPlatform.content.publicParking.access.gate' })}
        </Typography>
      );
    }
    return null;
  };

  const renderText = (msgId, value, props = {}) => (
    <div {...props}>
      <Typography variant="body2">{intl.formatMessage({ id: msgId }, { value })}</Typography>
    </div>
  );

  const parkingAreaAddress = {
    fi: item.address_fi,
    en: item.address_en,
    sv: item.address_sv,
  };

  const renderAddress = () => renderText('mobilityPlatform.content.address', getLocaleText(parkingAreaAddress), { className: classes.margin });

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <Typography variant="subtitle1" component="h3">
          {intl.formatMessage({ id: 'mobilityPlatform.content.disabledParking.title' })}
        </Typography>
      </div>
      <div className={classes.textContainer}>
        {renderAddress()}
        {renderText('mobilityPlatform.content.disabledParking.amount', item.extra.invapaikkoja, {
          className: classes.margin,
        })}
        <div className={classes.margin}>
          <Typography variant="body2">{getLocaleText(item.extra.rajoitustyyppi)}</Typography>
        </div>
        <div className={classes.margin}>{renderAccessInfo(item.extra.saavutettavuus.fi)}</div>
      </div>
    </div>
  );
};

DisabledParkingContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  item: PropTypes.objectOf(PropTypes.any),
};

DisabledParkingContent.defaultProps = {
  item: {},
};

export default DisabledParkingContent;
