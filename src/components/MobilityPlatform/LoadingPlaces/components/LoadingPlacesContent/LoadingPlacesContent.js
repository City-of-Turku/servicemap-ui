import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import useLocaleText from '../../../../../utils/useLocaleText';

const LoadingPlacesContent = ({ classes, intl, item }) => {
  const getLocaleText = useLocaleText();

  const singleValText = (messageId, value, props = {}) => (
    <div {...props}>
      <Typography component="p" variant="body2">
        {intl.formatMessage({ id: messageId }, { value })}
      </Typography>
    </div>
  );

  const loadingPlaceName = {
    fi: item.name_fi,
    en: item.name_en,
    sv: item.name_sv,
  };

  const loadingPlaceAddress = {
    fi: item.address_fi,
    en: item.address_en,
    sv: item.address_sv,
  };

  const renderText = textObj => (
    <div className={classes.marginTop}>
      <Typography component="p" variant="body2">
        {getLocaleText(textObj)}
      </Typography>
    </div>
  );

  const renderAddress = () => singleValText('mobilityPlatform.content.address', getLocaleText(loadingPlaceAddress), { className: classes.margin });

  const loadingPlaceInfo = (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <Typography variant="subtitle1">
          {getLocaleText(loadingPlaceName)}
        </Typography>
      </div>
      <div className={classes.textContainer}>
        {item.address_fi !== '' ? renderAddress() : null}
        {renderText(item.extra.lastauspiste)}
        {renderText(item.extra.Saavutettavuus)}
        {renderText(item.extra.rajoitustyyppi)}
      </div>
    </div>
  );

  return (
    <div className={classes.container}>
      {loadingPlaceInfo}
    </div>
  );
};

LoadingPlacesContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  item: PropTypes.objectOf(PropTypes.any),
};

LoadingPlacesContent.defaultProps = {
  item: {},
};

export default LoadingPlacesContent;
