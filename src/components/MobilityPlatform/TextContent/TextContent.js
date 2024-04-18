import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import { StyledContainer, StyledHeaderContainer, StyledTextContainer } from '../styled/styled';

const TextContent = ({ titleId, translationId }) => {
  const intl = useIntl();

  const singleValTypo = (messageId, isTitle) => (
    <Typography variant={isTitle ? 'subtitle1' : 'body2'} component={isTitle ? 'h3' : 'p'}>
      {intl.formatMessage({
        id: messageId,
      })}
    </Typography>
  );

  return (
    <StyledContainer>
      <StyledHeaderContainer>
        {singleValTypo(titleId, true)}
      </StyledHeaderContainer>
      <StyledTextContainer>
        {singleValTypo(translationId, false)}
      </StyledTextContainer>
    </StyledContainer>
  );
};

TextContent.propTypes = {
  titleId: PropTypes.string,
  translationId: PropTypes.string,
};

TextContent.defaultProps = {
  titleId: '',
  translationId: '',
};

export default TextContent;
