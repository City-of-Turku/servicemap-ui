import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { SMSwitch } from '../../../../components';

/**
 * Render 1 or more switches inside form.
 * @property {any} classes
 * @property {any} intl
 * @property {string} keyVal
 * @property {string} msgId
 * @property {boolean} checkedValue
 * @property {Function} onChangeValue
 * @return {JSX Element}
 */

const MobilityToggleButton = ({
  classes, intl, msgId, checkedValue, onChangeValue, selectionSize, inputProps, ...rest
}) => (
  <div className={classes.mobilityMapSwitch}>
    <SMSwitch
      color="primary"
      classes={{ thumb: classes.switchBorder }}
      size="small"
      value={checkedValue}
      className={classes.customSwitch}
      inputProps={{
        ...inputProps,
        role: 'button',
        'aria-setsize': selectionSize ? selectionSize.toString() : null,
        'aria-pressed': checkedValue,
        'aria-labelledby': msgId,
      }}
      onChange={(e) => onChangeValue(e)}
      checked={checkedValue}
      {...rest}
    />
    <div className={classes.labelContainer}>
      <Typography
        variant="body2"
        aria-label={intl.formatMessage({
          id: msgId,
        })}
      >
        {intl.formatMessage({
          id: msgId,
        })}
      </Typography>
    </div>
  </div>
);

MobilityToggleButton.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  msgId: PropTypes.string,
  checkedValue: PropTypes.bool,
  onChangeValue: PropTypes.func.isRequired,
  selectionSize: PropTypes.number,
  inputProps: PropTypes.shape({
    tabindex: PropTypes.string,
  }),
};

MobilityToggleButton.defaultProps = {
  msgId: '',
  checkedValue: false,
  selectionSize: null,
  inputProps: {},
};

export default MobilityToggleButton;
