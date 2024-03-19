import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Typography } from '@mui/material';
import styled from '@emotion/styled';
import { formatFullDates } from '../../utils';

/**
 * Render text that shows from and until dates.
 * @prop {string} dataFrom
 * @prop {string} dataUntil
 * @returns JSX eement
 */
const CounterActiveText = ({ dataFrom, dataUntil }) => {
  const intl = useIntl();
  const dataFromFormat = formatFullDates(dataFrom);
  const dataUntilFormat = formatFullDates(dataUntil);

  return (
    <StyledTextContainer>
      <Typography variant="body2" sx={{ mb: '0.4rem' }}>
        {intl.formatMessage(
          { id: 'ecocounter.station.counts.period' },
          { value1: dataFromFormat, value2: dataUntilFormat },
        )}
      </Typography>
    </StyledTextContainer>
  );
};

const StyledTextContainer = styled.div(({ theme }) => ({
  textAlign: 'center',
  margin: `${theme.spacing(1)} 0`,
}));

CounterActiveText.propTypes = {
  dataFrom: PropTypes.string,
  dataUntil: PropTypes.string,
};

CounterActiveText.defaultProps = {
  dataFrom: '',
  dataUntil: '',
};

export default CounterActiveText;
