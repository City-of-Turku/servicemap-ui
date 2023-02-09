import React from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import useLocaleText from '../../../utils/useLocaleText';

/** Renders text that includes react-intl translation and object containing localized values */

const SingleValueText = ({
  classes, intl, messageId, textObj,
}) => {
  const getLocaleText = useLocaleText();

  return (
    <div className={classes.margin}>
      <Typography component="p" variant="body2">
        {intl.formatMessage({ id: messageId }, { value: getLocaleText(textObj) })}
      </Typography>
    </div>
  );
};

SingleValueText.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  messageId: PropTypes.string,
  textObj: PropTypes.objectOf(PropTypes.any),
};

SingleValueText.defaultProps = {
  messageId: '',
  textObj: {},
};

export default SingleValueText;
