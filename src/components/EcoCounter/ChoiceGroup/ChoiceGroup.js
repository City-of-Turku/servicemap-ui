import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { visuallyHidden } from '@mui/utils';

const ChoiceGroup = ({
  type,
  name,
  legend,
  options,
  isSelected,
  onChange,
  renderOption,
  className,
}) => (
  <StyledFieldset className={className}>
    <legend style={visuallyHidden}>{legend}</legend>
    <div className="choices">
      {options.map((option) => {
        const checked = isSelected(option.value);
        const id = `${name}-${option.value}`;
        return (
          <label key={option.value} className="choice" htmlFor={id}>
            <input
              id={id}
              type={type}
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => onChange(option.value)}
              style={visuallyHidden}
            />
            {renderOption(option, checked)}
          </label>
        );
      })}
    </div>
  </StyledFieldset>
);

const StyledFieldset = styled.fieldset(({ theme }) => ({
  border: 0,
  margin: 0,
  padding: 0,
  minWidth: 0,
  '& .choice': {
    position: 'relative',
    cursor: 'pointer',
  },
  '& input:focus-visible + .choice-face': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '6px',
  },
}));

ChoiceGroup.propTypes = {
  type: PropTypes.oneOf(['radio', 'checkbox']).isRequired,
  name: PropTypes.string.isRequired,
  legend: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isSelected: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  renderOption: PropTypes.func.isRequired,
  className: PropTypes.string,
};

ChoiceGroup.defaultProps = {
  className: undefined,
};

export default ChoiceGroup;
