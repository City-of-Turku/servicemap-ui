import { Link, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const InfoTextBox = ({
  classes, intl, infoText, linkUrl, linkText, reducePadding,
}) => (
  <div className={`${classes.container} ${reducePadding ? classes.paddingSm : classes.padding}`}>
    <Typography
      variant="body2"
      aria-label={intl.formatMessage({
        id: infoText,
      })}
    >
      {intl.formatMessage({
        id: infoText,
      })}
    </Typography>
    {linkUrl ? (
      <Link target="_blank" href={linkUrl}>
        <Typography className={classes.link} variant="body2" aria-label={linkUrl}>
          {intl.formatMessage({
            id: linkText,
          })}
        </Typography>
      </Link>
    ) : null}
  </div>
);

InfoTextBox.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  infoText: PropTypes.string,
  linkUrl: PropTypes.string,
  linkText: PropTypes.string,
  reducePadding: PropTypes.bool,
};

InfoTextBox.defaultProps = {
  infoText: '',
  linkUrl: '',
  linkText: '',
  reducePadding: false,
};

export default InfoTextBox;
