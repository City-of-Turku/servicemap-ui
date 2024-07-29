import { Link, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import { useIntl } from 'react-intl';

const LinkBasic = ({ linkUrl, translationId }) => {
  const intl = useIntl();

  return (
    <StyledContainer>
      <Link target="_blank" href={linkUrl}>
        <StyledLink variant="body2">
          {intl.formatMessage({ id: translationId })}
        </StyledLink>
      </Link>
    </StyledContainer>
  );
};

const StyledContainer = styled.div(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}));

const StyledLink = styled(Typography)(({ theme }) => ({
  color: theme.palette.link.main,
  textDecoration: 'underline',
}));

LinkBasic.propTypes = {
  linkUrl: PropTypes.string,
  translationId: PropTypes.string,
};

LinkBasic.defaultProps = {
  linkUrl: '',
  translationId: '',
};

export default LinkBasic;
