import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import useLocaleText from '../../../../utils/useLocaleText';

const Description = ({ route }) => {
  const getLocaleText = useLocaleText();

  // Hide references to sizes of audio files.
  // Only finnish and english descriptions have those.
  const replaceWord = inputStr => inputStr.replace(/Latauskoko ~90M|koko ~43M|Size ~6MB/gi, '');

  const descriptions = {
    fi: replaceWord(route.description),
    en: replaceWord(route.description_en),
    sv: route.description_sv,
  };

  return (
    <StyledParagraph>
      <Typography
        component="p"
        variant="body2"
      >
        {getLocaleText(descriptions)}
      </Typography>
    </StyledParagraph>
  );
};

const StyledParagraph = styled.div(({ theme }) => ({
  textAlign: 'left',
  padding: theme.spacing(1.5),
  width: '85%',
}));

Description.propTypes = {
  route: PropTypes.shape({
    description: PropTypes.string,
    description_en: PropTypes.string,
    description_sv: PropTypes.string,
  }),
};

Description.defaultProps = {
  route: {},
};

export default Description;
