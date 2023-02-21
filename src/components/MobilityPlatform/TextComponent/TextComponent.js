import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import useLocaleText from '../../../utils/useLocaleText';

const TextComponent = ({
  classes, intl, textObj, isTitle, messageId,
}) => {
  const getLocaleText = useLocaleText();
  const wrapper = prop => (messageId ? intl.formatMessage({ id: messageId }, { value: prop }) : prop);
  return (
    <div className={classes.margin}>
      <Typography component="p" variant={isTitle ? 'subtitle1' : 'body2'}>
        {wrapper(getLocaleText(textObj))}
      </Typography>
    </div>
  );
};

TextComponent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  textObj: PropTypes.objectOf(PropTypes.any),
  isTitle: PropTypes.bool,
  messageId: PropTypes.string,
};

TextComponent.defaultProps = {
  textObj: {},
  isTitle: false,
  messageId: null,
};

export default TextComponent;
