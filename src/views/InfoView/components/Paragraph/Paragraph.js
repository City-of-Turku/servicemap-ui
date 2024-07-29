import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import { useIntl } from 'react-intl';

const Paragraph = ({ isTitle, translationId }) => {
  const intl = useIntl();

  return (
    <StyledTextContainer isTitle={isTitle}>
      <Typography component={isTitle ? 'h3' : 'p'} variant="body2">
        {intl.formatMessage({ id: translationId })}
      </Typography>
    </StyledTextContainer>
  );
};

const StyledTextContainer = styled.div(({ theme, isTitle }) => ({
  padding: isTitle ? 0 : theme.spacing(2),
  paddingTop: isTitle ? 0 : theme.spacing(1),
  paddingBottom: isTitle ? theme.spacing(0.1) : theme.spacing(1),
}));

Paragraph.propTypes = {
  isTitle: PropTypes.bool,
  translationId: PropTypes.string,
};

Paragraph.defaultProps = {
  isTitle: false,
  translationId: '',
};

export default Paragraph;
