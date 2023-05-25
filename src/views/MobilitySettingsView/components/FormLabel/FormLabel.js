import { FormControlLabel, Switch, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import PropTypes from 'prop-types';
import React from 'react';

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
}) => {
  const useMobileStatus = () => useMediaQuery('(max-width:360px)');

  const isNarrow = useMobileStatus();

  return (
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
      className={`${classes.formLabel} ${isNarrow ? classes.paddingSm : classes.paddingMd}`}
    />
  );
};

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
