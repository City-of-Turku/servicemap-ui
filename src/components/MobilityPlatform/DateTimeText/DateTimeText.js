import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Typography } from '@mui/material';
import { StyledTextContainer } from '../styled/styled';

const DateTimeText = ({ dateTimeText }) => {
  const formatDateTime = dateTimeValue => format(new Date(dateTimeValue), 'dd.MM (HH:mm)');
  return (
    <StyledTextContainer>
      <Typography variant="body2" component="p">
        {formatDateTime(dateTimeText)}
      </Typography>
    </StyledTextContainer>
  );
};

DateTimeText.propTypes = {
  dateTimeText: PropTypes.string.isRequired,
};

export default DateTimeText;
