import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const TextContent = ({
  classes, intl, titleId, translationId,
}) => {
  const singleValTypo = (messageId, isTitle) => (
    <div>
      <Typography variant={isTitle ? 'subtitle1' : 'body2'}>
        {intl.formatMessage({
          id: messageId,
        })}
      </Typography>
    </div>
  );

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        {singleValTypo(titleId, true)}
      </div>
      <div className={classes.textContainer}>
        {singleValTypo(translationId, false)}
      </div>
    </div>
  );
};

TextContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  titleId: PropTypes.string,
  translationId: PropTypes.string,
};

TextContent.defaultProps = {
  titleId: '',
  translationId: '',
};

export default TextContent;
