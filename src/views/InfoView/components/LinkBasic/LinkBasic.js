import { Link, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const LinkBasic = ({
  classes, intl, linkUrl, translationId,
}) => (
  <div className={classes.linkContainer}>
    <Link target="_blank" href={linkUrl}>
      <Typography className={classes.link} variant="body2" aria-label={intl.formatMessage({ id: translationId })}>
        {intl.formatMessage({ id: translationId })}
      </Typography>
    </Link>
  </div>
);

LinkBasic.propTypes = {
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  linkUrl: PropTypes.string,
  translationId: PropTypes.string,
};

LinkBasic.defaultProps = {
  linkUrl: '',
  translationId: '',
};

export default LinkBasic;
