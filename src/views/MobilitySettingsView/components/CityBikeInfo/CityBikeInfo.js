import { Link, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const CityBikeInfo = ({
  classes, intl, bikeInfo,
}) => {
  const [url, setUrl] = useState(bikeInfo.url.fi);

  const locale = useSelector(state => state.user.locale);

  useEffect(() => {
    if (locale === 'en') {
      setUrl(bikeInfo.url.en);
    }
    if (locale === 'sv') {
      setUrl(bikeInfo.url.sv);
    }
  }, [locale]);

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
      {text(bikeInfo.paragraph1)}
      {text(bikeInfo.paragraph2)}
      {text(bikeInfo.subtitle)}
      <Link target="_blank" href={url}>
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
