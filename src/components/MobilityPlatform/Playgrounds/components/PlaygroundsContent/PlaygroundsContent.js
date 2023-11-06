import PropTypes from 'prop-types';
import React from 'react';
import { Typography } from '@mui/material';
import styled from '@emotion/styled';

const PlaygroundsContent = ({ intl, item }) => {
  const removeNumbers = (inputStr) => inputStr.replace(/[0-9]/g, '');

  const singleValueText = (translationId, itemValue) => (
    <StyledText>
      <Typography variant="body2" component="p">
        {intl.formatMessage({ id: translationId }, { value: itemValue })}
      </Typography>
    </StyledText>
  );

  const formatArea = (areaVal) => areaVal.toString().replace('.', ',');

  return (
    <StyledContainer>
      <StyledHeader>
        <Typography variant="subtitle2" component="h3">
          {intl.formatMessage({ id: 'mobilityPlatform.content.playgrounds.title' }, { value: removeNumbers(item.name) })}
        </Typography>
      </StyledHeader>
      {singleValueText('mobilityPlatform.content.playgrounds.owner', item.extra.omistaja)}
      {singleValueText('mobilityPlatform.content.playgrounds.maintain', item.extra.hoitaja)}
      {singleValueText('mobilityPlatform.content.playgrounds.area', formatArea(item.extra.laskettuPintaAla))}
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

PlaygroundsContent.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  item: PropTypes.shape({
    name: PropTypes.string,
    extra: PropTypes.shape({
      omistaja: PropTypes.string,
      hoitaja: PropTypes.string,
      laskettuPintaAla: PropTypes.number,
    }),
  }),
};

PlaygroundsContent.defaultProps = {
  item: {},
};

export default PlaygroundsContent;
