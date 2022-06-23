import React from 'react';
import PropTypes from 'prop-types';
import { ReactSVG } from 'react-svg';
import { Typography, Button } from '@material-ui/core';

/**
   * @param {Function} onClickFunc
   * @param {boolean} settingState
   * @param {string} iconName
   * @param {string} translationId
   */

const ButtonMain = ({
  classes, intl, onClickFunc, settingState, iconName, translationId,
}) => (
  <Button
    onClick={() => onClickFunc()}
    variant="outlined"
    className={
        settingState ? `${classes.button} ${classes.active}` : classes.button
      }
    aria-label={intl.formatMessage({
      id: translationId,
    })}
  >
    <ReactSVG
      className={settingState ? `${classes.iconActive}` : `${classes.icon}`}
      src={iconName}
    />
    <Typography variant="body2">
      {intl.formatMessage({
        id: translationId,
      })}
    </Typography>
  </Button>
);

ButtonMain.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  onClickFunc: PropTypes.func.isRequired,
  settingState: PropTypes.bool,
  iconName: PropTypes.string,
  translationId: PropTypes.string,
};

ButtonMain.defaultProps = {
  settingState: false,
  iconName: '',
  translationId: '',
};

export default ButtonMain;
