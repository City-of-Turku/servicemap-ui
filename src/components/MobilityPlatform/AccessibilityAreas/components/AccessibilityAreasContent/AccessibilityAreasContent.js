import PropTypes from 'prop-types';
import React from 'react';
import { Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import { StyledContainer, StyledHeaderContainer, StyledTextContainer } from '../../../styled/styled';

const AccessibilityAreasContent = ({ item }) => {
  const intl = useIntl();

  const contentInfo = (
    <StyledContainer>
      <StyledHeaderContainer>
        <Typography variant="subtitle1" component="h4">
          {item.name_fi}
        </Typography>
      </StyledHeaderContainer>
      <div>
        <StyledTextContainer>
          <Typography variant="subtitle2" component="p">
            {intl.formatMessage({ id: 'unit.accessibilityAreas.content.subtitle' })}
          </Typography>
        </StyledTextContainer>
        <StyledTextContainer>
          <Typography variant="body2" component="p">
            {intl.formatMessage({ id: 'unit.accessibilityAreas.content.transport' }, { value: item?.extra?.kulkumuoto })}
          </Typography>
        </StyledTextContainer>
        <StyledTextContainer>
          <Typography variant="body2" component="p">
            {intl.formatMessage({ id: 'unit.accessibilityAreas.content.duration' }, { value: item?.extra?.minuutit })}
          </Typography>
        </StyledTextContainer>
      </div>
    </StyledContainer>
  );

  return <div>{contentInfo}</div>;
};

AccessibilityAreasContent.propTypes = {
  item: PropTypes.shape({
    name_fi: PropTypes.string,
    extra: PropTypes.shape({
      kulkumuoto: PropTypes.string,
      minuutit: PropTypes.number,
    }),
  }),
};

AccessibilityAreasContent.defaultProps = {
  item: {},
};

export default AccessibilityAreasContent;
