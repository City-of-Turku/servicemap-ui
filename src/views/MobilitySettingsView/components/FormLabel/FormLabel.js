import React from 'react';
import PropTypes from 'prop-types';
import { FormControlLabel, Typography, Switch } from '@material-ui/core';

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

const FormLabel = ({
  classes, intl, msgId, checkedValue, onChangeValue,
}) => (
  <FormControlLabel
    label={(
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
      )}
    control={(
      <Switch
        checked={checkedValue}
        role="switch"
        inputProps={{
          'aria-label': intl.formatMessage({
            id: msgId,
          }),
        }}
        onChange={onChangeValue}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            onChangeValue();
          }
        }}
      />
      )}
    className={classes.formLabel}
  />
);

FormLabel.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  msgId: PropTypes.string,
  checkedValue: PropTypes.bool,
  onChangeValue: PropTypes.func.isRequired,
};

FormLabel.defaultProps = {
  msgId: '',
  checkedValue: false,
};

export default FormLabel;
