import { Link, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import NewTabIndicator from '../../../../components/NewTabIndicator/NewTabIndicator';

const LinkBasic = ({
  classes, intl, linkUrl, translationId, indicateNewTab,
}) => {
  const label = intl.formatMessage({ id: translationId });

  return (
    <div className={classes.linkContainer}>
      <Link target="_blank" rel="noopener noreferrer" href={linkUrl}>
        <Typography
          className={classes.link}
          variant="body2"
          aria-label={indicateNewTab ? undefined : label}
        >
          {label}
          {indicateNewTab ? <NewTabIndicator /> : null}
        </Typography>
      </Link>
    </div>
  );
};

LinkBasic.propTypes = {
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  linkUrl: PropTypes.string,
  translationId: PropTypes.string,
  indicateNewTab: PropTypes.bool,
};

LinkBasic.defaultProps = {
  linkUrl: '',
  translationId: '',
  indicateNewTab: false,
};

export default LinkBasic;
