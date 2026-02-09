import { Typography } from '@mui/material';
import React from 'react';
import { useIntl } from 'react-intl';
import { StyledContainer, StyledHeaderContainer, StyledTextContainer } from '../../../styled/styled';

const PublicToiletsContent = () => {
  const intl = useIntl();

  const titleTypo = messageId => (
    <StyledTextContainer>
      <Typography variant="subtitle1" component="h3">
        {intl.formatMessage({
          id: messageId,
        })}
      </Typography>
    </StyledTextContainer>
  );

  const singleValTypo = (messageId, isSubtitle) => (
    <StyledTextContainer>
      <Typography variant={isSubtitle ? 'subtitle2' : 'body2'} component={isSubtitle ? 'h4' : 'p'}>
        {intl.formatMessage({
          id: messageId,
        })}
      </Typography>
    </StyledTextContainer>
  );

  return (
    <StyledContainer>
      <StyledHeaderContainer>{titleTypo('mobilityPlatform.content.publicToilets.title')}</StyledHeaderContainer>
      <div>
        {singleValTypo('mobilityPlatform.content.publicToilets.openNormalTitle', true)}
        {/* {singleValTypo('mobilityPlatform.content.publicToilets.openNormalDate')} */}
        {singleValTypo('mobilityPlatform.content.publicToilets.openNormal')}
        {/* {singleValTypo('mobilityPlatform.content.publicToilets.openSummerTitle', true)} */}
        {/* {singleValTypo('mobilityPlatform.content.publicToilets.openSummerDate')} */}
        {/* {singleValTypo('mobilityPlatform.content.publicToilets.openSummer')} */}
      </div>
    </StyledContainer>
  );
};

export default PublicToiletsContent;
