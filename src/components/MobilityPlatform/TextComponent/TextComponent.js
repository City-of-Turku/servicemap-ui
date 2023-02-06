import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import useLocaleText from '../../../utils/useLocaleText';

const TextComponent = ({ classes, textObj, isTitle }) => {
  const getLocaleText = useLocaleText();

  return (
    <div className={classes.margin}>
      <Typography component="p" variant={isTitle ? 'subtitle1' : 'body2'}>
        {getLocaleText(textObj)}
      </Typography>
    </div>
  );
};

TextComponent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  textObj: PropTypes.objectOf(PropTypes.any),
  isTitle: PropTypes.bool,
};

TextComponent.defaultProps = {
  textObj: {},
  isTitle: false,
};

export default TextComponent;
