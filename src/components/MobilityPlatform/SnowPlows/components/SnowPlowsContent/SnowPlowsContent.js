import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import { StyledContainer, StyledHeaderContainer, StyledTextContainer } from '../../../styled/styled';

const SnowPlowsContent = ({
  formatOperation, operation, formatTime, timestamp,
}) => {
  const intl = useIntl();

  return (
    <StyledContainer>
      <StyledHeaderContainer>
        <Typography variant="subtitle1" component="h3">
          {intl.formatMessage({
            id: 'mobilityPlatform.content.streetMaintenance.title',
          })}
        </Typography>
      </StyledHeaderContainer>
      <div>
        <StyledTextContainer>
          <Typography>
            <strong>{intl.formatMessage({ id: 'mobilityPlatform.content.streetMaintenance' })}</strong>
            :
            {' '}
            {formatOperation(operation)}
          </Typography>
        </StyledTextContainer>
        <StyledTextContainer>
          <Typography>
            <strong>{intl.formatMessage({ id: 'mobilityPlatform.content.streetMaintenance.time' })}</strong>
            :
            {' '}
            {formatTime(timestamp)}
          </Typography>
        </StyledTextContainer>
      </div>
    </StyledContainer>
  );
};

SnowPlowsContent.propTypes = {
  formatOperation: PropTypes.func.isRequired,
  operation: PropTypes.string,
  formatTime: PropTypes.func.isRequired,
  timestamp: PropTypes.string,
};

SnowPlowsContent.defaultProps = {
  operation: '',
  timestamp: '',
};

export default SnowPlowsContent;
