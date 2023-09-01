import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { InputBase, InputAdornment } from '@mui/material';
import styled from '@emotion/styled';
import { CalendarMonth } from '@mui/icons-material';

const InputDateFunction = ({ value, onClick, onChange }, ref) => (
  <StyledInputBase
    type="text"
    value={value}
    ref={ref}
    onChange={(e) => onChange(e.target.value)}
    onClick={onClick}
    startAdornment={(
      <InputAdornment position="start">
        <CalendarMonth />
      </InputAdornment>
    )}
  />
);

const StyledInputBase = styled(InputBase)(() => ({
  fontSize: '0.913rem',
  fontWeight: 'bold',
  boxSizing: 'border-box',
  backgroundColor: '#fff',
  cursor: 'pointer',
}));

const InputDate = forwardRef(InputDateFunction);

InputDateFunction.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

InputDateFunction.defaultProps = {
  value: '',
};

export default InputDate;
