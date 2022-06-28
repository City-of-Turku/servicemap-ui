import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Link } from '@material-ui/core';

const InfoTextBox = ({
  classes, intl, infoText, linkUrl,
}) => (
  <div className={classes.container}>
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
          {linkUrl}
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
};

InfoTextBox.defaultProps = {
  infoText: '',
  linkUrl: '',
};

export default InfoTextBox;
