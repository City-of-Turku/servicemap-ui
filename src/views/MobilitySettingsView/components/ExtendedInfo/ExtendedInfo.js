import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import styled from '@emotion/styled';

const ExtendedInfo = ({ translations }) => {
  const intl = useIntl();

  const text = (message, isMargin) => (
    <StyledTextContainer isMargin={isMargin}>
      <Typography
        variant="body2"
      >
        {intl.formatMessage({
          id: message,
        })}
      </Typography>
    </StyledTextContainer>
  );

  return (
    <StyledContainer>
      {text(translations.message1)}
      <StyledList>
        {translations.zones.map(item => (
          <li key={item}>
            {text(item)}
          </li>
        ))}
      </StyledList>
      {text(translations.message2, true)}
      {text(translations.message3)}
    </StyledContainer>
  );
};

const StyledContainer = styled.div(({ theme }) => ({
  margin: theme.spacing(2),
  textAlign: 'left',
  paddingBottom: theme.spacing(2),
}));

const StyledList = styled.ul(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const StyledTextContainer = styled.div(({ theme, isMargin }) => ({
  marginBottom: isMargin ? theme.spacing(1) : 0,
}));

ExtendedInfo.propTypes = {
  translations: PropTypes.shape({
    message1: PropTypes.string,
    message2: PropTypes.string,
    message3: PropTypes.string,
    zones: PropTypes.arrayOf(PropTypes.string),
  }),
};

ExtendedInfo.defaultProps = {
  translations: {},
};

export default ExtendedInfo;
