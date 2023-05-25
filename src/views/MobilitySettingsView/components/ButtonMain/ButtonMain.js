import { Button, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { ReactSVG } from 'react-svg';

/**
 * Render 1 or more buttons with icon and text
   * @property {any} classes
   * @property {any} intl
   * @property {Function} onClickFunc
   * @property {boolean} settingState
   * @property {string} iconName
   * @property {string} translationId
   * @return {JSX Element}
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
