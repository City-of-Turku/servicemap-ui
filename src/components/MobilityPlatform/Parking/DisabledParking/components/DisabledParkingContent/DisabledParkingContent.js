import { Typography } from '@material-ui/core';
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
    } return null;
  };

  const renderText = value => (
    <Typography variant="body2">
      {intl.formatMessage({ id: 'mobilityPlatform.content.disabledParking.amount' }, { value })}
    </Typography>
  );

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <Typography variant="subtitle1">{intl.formatMessage({ id: 'mobilityPlatform.content.disabledParking.title' })}</Typography>
      </div>
      <div className={classes.textContainer}>
        {renderText(item.extra.invapaikkoja)}
        <Typography variant="body2">
          {getLocaleText(item.extra.rajoitustyyppi)}
        </Typography>
        {renderAccessInfo(item.extra.saavutettavuus.fi)}
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
