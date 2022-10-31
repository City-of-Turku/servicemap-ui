import { Link, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import useLocaleText from '../../../../utils/useLocaleText';

const CityBikeInfo = ({
  classes, intl, bikeInfo,
}) => {
  const getLocaleText = useLocaleText();

  const text = textValue => (
    <Typography
      variant="body2"
      className={classes.margin}
      aria-label={intl.formatMessage({
        id: textValue,
      })}
    >
      {intl.formatMessage({
        id: textValue,
      })}
    </Typography>
  );

  return (
    <div className={classes.container}>
      {bikeInfo.isWinterSeason ? text(bikeInfo.seasonInfo) : null}
      {text(bikeInfo.paragraph1)}
      {text(bikeInfo.paragraph2)}
      {text(bikeInfo.subtitle)}
      <Link target="_blank" href={getLocaleText(bikeInfo.url)}>
        {text(bikeInfo.link)}
      </Link>
      {text(bikeInfo.apiInfo)}
    </div>
  );
};

CityBikeInfo.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  bikeInfo: PropTypes.objectOf(PropTypes.any),
};

CityBikeInfo.defaultProps = {
  bikeInfo: {},
};

export default CityBikeInfo;
