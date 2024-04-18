import { Link, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import { useIntl } from 'react-intl';
import useLocaleText from '../../../../utils/useLocaleText';

const CityBikeInfo = ({ bikeInfo }) => {
  const intl = useIntl();
  const getLocaleText = useLocaleText();

  const text = textValue => (
    <StyledTextMargin>
      <Typography variant="body2">
        {intl.formatMessage({
          id: textValue,
        })}
      </Typography>
    </StyledTextMargin>
  );

  return (
    <StyledContainer>
      {text(bikeInfo.paragraph1)}
      {text(bikeInfo.paragraph2)}
      {text(bikeInfo.subtitle)}
      <Link target="_blank" href={getLocaleText(bikeInfo.url)}>
        {text(bikeInfo.link)}
      </Link>
      {text(bikeInfo.apiInfo)}
    </StyledContainer>
  );
};

const StyledContainer = styled.div(({ theme }) => ({
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
  textAlign: 'left',
}));

const StyledTextMargin = styled.div(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

CityBikeInfo.propTypes = {
  bikeInfo: PropTypes.shape({
    paragraph1: PropTypes.string,
    paragraph2: PropTypes.string,
    paragraph3: PropTypes.string,
    subtitle: PropTypes.string,
    link: PropTypes.string,
    apiInfo: PropTypes.string,
    url: PropTypes.objectOf(PropTypes.string),
  }),
};

CityBikeInfo.defaultProps = {
  bikeInfo: {},
};

export default CityBikeInfo;
