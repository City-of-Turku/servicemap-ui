import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const ExtendedInfo = ({ classes, intl, translations }) => {
  const text = (message, props = {}) => (
    <Typography
      variant="body2"
      aria-label={intl.formatMessage({
        id: message,
      })}
      {...props}
    >
      {intl.formatMessage({
        id: message,
      })}
    </Typography>
  );

  return (
    <div className={classes.container}>
      {text(translations.message1)}
      <ul className={classes.list}>
        {translations.zones.map(item => (
          <li key={item}>
            {text(item)}
          </li>
        ))}
      </ul>
      {text(translations.message2, { className: classes.margin })}
      {text(translations.message3)}
    </div>
  );
};

ExtendedInfo.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  translations: PropTypes.objectOf(PropTypes.any),
};

ExtendedInfo.defaultProps = {
  translations: {},
};

export default ExtendedInfo;
