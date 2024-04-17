import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import styled from '@emotion/styled';
import useLocaleText from '../../../utils/useLocaleText';

const TextComponent = ({
  textObj, isTitle, messageId,
}) => {
  const intl = useIntl();
  const getLocaleText = useLocaleText();
  const wrapper = prop => (messageId ? intl.formatMessage({ id: messageId }, { value: prop }) : prop);
  return (
    <StyledContainer>
      <Typography component="p" variant={isTitle ? 'subtitle1' : 'body2'}>
        {wrapper(getLocaleText(textObj))}
      </Typography>
    </StyledContainer>
  );
};

const StyledContainer = styled.div(({ theme }) => ({
  marginTop: theme.spacing(0.5),
}));

TextComponent.propTypes = {
  textObj: PropTypes.objectOf(PropTypes.string),
  isTitle: PropTypes.bool,
  messageId: PropTypes.string,
};

TextComponent.defaultProps = {
  textObj: {},
  isTitle: false,
  messageId: null,
};

export default TextComponent;
