import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const Paragraph = ({
  classes, intl, isTitle, translationId,
}) => (
  <div className={isTitle ? classes.title : classes.text}>
    <Typography component={isTitle ? 'h3' : 'p'} variant="body2" aria-label={intl.formatMessage({ id: translationId })}>
      {intl.formatMessage({ id: translationId })}
    </Typography>
  </div>
);

Paragraph.propTypes = {
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  isTitle: PropTypes.bool,
  translationId: PropTypes.string,
};

Paragraph.defaultProps = {
  isTitle: false,
  translationId: '',
};

export default Paragraph;
