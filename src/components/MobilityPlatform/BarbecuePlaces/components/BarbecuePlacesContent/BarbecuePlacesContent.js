import PropTypes from 'prop-types';
import React from 'react';
import { Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import styled from '@emotion/styled';

const BarbecuePlacesContent = ({ item }) => {
  const intl = useIntl();
  return (
    <StyledContainer>
      <StyledHeader>
        <Typography variant="subtitle2" component="h3">
          {intl.formatMessage({ id: 'mobilityPlatform.content.barbecuePlace.title' })}
        </Typography>
      </StyledHeader>
      <StyledText>
        <Typography variant="body2" component="p">
          {`${item.extra.malli.trim()} (${item.extra.valmistaja})`}
        </Typography>
      </StyledText>
    </StyledContainer>
  );
};

const StyledContainer = styled.div(({ theme }) => ({
  margin: theme.spacing(1),
}));

const StyledHeader = styled.div(({ theme }) => ({
  width: '85%',
  borderBottom: '1px solid #000',
  paddingBottom: theme.spacing(0.5),
}));

const StyledText = styled.div(({ theme }) => ({
  marginTop: theme.spacing(0.5),
}));

BarbecuePlacesContent.propTypes = {
  item: PropTypes.shape({
    extra: PropTypes.shape({
      malli: PropTypes.string,
      valmistaja: PropTypes.string,
    }),
  }),
};

BarbecuePlacesContent.defaultProps = {
  item: {},
};

export default BarbecuePlacesContent;
