import PropTypes from 'prop-types';
import React from 'react';
import { Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import { StyledContainer, StyledHeaderContainer, StyledTextContainer } from '../../../styled/styled';

const BarbecuePlacesContent = ({ item }) => {
  const intl = useIntl();

  return (
    <StyledContainer>
      <StyledHeaderContainer>
        <Typography variant="subtitle1" component="p">
          {intl.formatMessage({ id: 'mobilityPlatform.content.barbecuePlace.title' })}
        </Typography>
      </StyledHeaderContainer>
      <div>
        <StyledTextContainer>
          <Typography variant="body2" component="p">
            {intl.formatMessage(
              { id: 'mobilityPlatform.content.barbecuePlace.manufacturer' },
              { value: item.extra.valmistaja },
            )}
          </Typography>
        </StyledTextContainer>
        <StyledTextContainer>
          <Typography variant="body2" component="p">
            {intl.formatMessage(
              { id: 'mobilityPlatform.content.barbecuePlace.model' },
              { value: item.extra.malli.trim() },
            )}
          </Typography>
        </StyledTextContainer>
      </div>
    </StyledContainer>
  );
};

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
