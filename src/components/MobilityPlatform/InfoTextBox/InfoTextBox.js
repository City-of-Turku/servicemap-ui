import { Link, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import styled from '@emotion/styled';
import { StyledLinkText } from '../styled/styled';

const InfoTextBox = ({
  infoText, linkUrl, linkText, reducePadding, removeBorder,
}) => {
  const intl = useIntl();

  return (
    <StyledContainer reducePadding={reducePadding} removeBorder={removeBorder}>
      <Typography
        variant="body2"
        aria-label={intl.formatMessage({
          id: infoText,
        })}
      >
        {intl.formatMessage({
          id: infoText,
        })}
      </Typography>
      {linkUrl ? (
        <Link target="_blank" href={linkUrl}>
          <StyledLinkText variant="body2" aria-label={linkUrl} sx={{ marginTop: '4px' }}>
            {intl.formatMessage({
              id: linkText,
            })}
          </StyledLinkText>
        </Link>
      ) : null}
    </StyledContainer>
  );
};

const StyledContainer = styled.div(({ reducePadding, removeBorder }) => ({
  textAlign: 'left',
  borderTop: removeBorder ? 'none' : '1px solid rgb(193, 193, 193)',
  padding: reducePadding ? '0.5rem 0.5rem 0.5rem 0' : '1rem',
}));

InfoTextBox.propTypes = {
  infoText: PropTypes.string,
  linkUrl: PropTypes.string,
  linkText: PropTypes.string,
  reducePadding: PropTypes.bool,
  removeBorder: PropTypes.bool,
};

InfoTextBox.defaultProps = {
  infoText: '',
  linkUrl: '',
  linkText: '',
  reducePadding: false,
  removeBorder: false,
};

export default InfoTextBox;
