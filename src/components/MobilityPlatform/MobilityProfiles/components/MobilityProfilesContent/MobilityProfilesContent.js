import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import { ReactSVG } from 'react-svg';
import { css } from '@emotion/css';
import moose from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_moose-bw-v2.svg';
import fox from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_fox-bw-v2.svg';
import deer from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_deer-bw-v2.svg';
import rabbit from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_rabbit-bw-v2.svg';
import marten from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_marten-bw-v2.svg';
import capercaillie from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_capercaillie-bw-v2.svg';
import useLocaleText from '../../../../../utils/useLocaleText';
import {
  StyledContainer,
  StyledFlexContainer,
  StyledHeaderContainer,
  StyledTextContainer,
} from '../../../styled/styled';

const MobilityProfilesContent = ({ postcodeArea, mobilityProfiles }) => {
  const intl = useIntl();
  const getLocaleText = useLocaleText();

  const filteredMobilityProfiles = mobilityProfiles.filter(
    item => item.postal_code_string === postcodeArea.name.fi && item.postal_code_type_string === 'Home' && item.count >= 1,
  );

  const iconClass = css({
    width: '30px',
    height: '30px',
  });

  const getIconByTopic = resultNum => {
    switch (resultNum) {
      case 1:
        return moose;
      case 2:
        return fox;
      case 3:
        return rabbit;
      case 4:
        return marten;
      case 5:
        return deer;
      case 6:
        return capercaillie;
      default:
        return moose;
    }
  };

  const noResultsText = () => (
    <StyledTextContainer>
      <Typography variant="body2" component="p">
        {intl.formatMessage({ id: 'area.mobilityResults.empty' })}
      </Typography>
    </StyledTextContainer>
  );

  return (
    <StyledContainer>
      <StyledHeaderContainer>
        <Typography variant="subtitle1" component="p">
          {intl.formatMessage({ id: 'area.mobilityResults.postCodeArea' }, { value: postcodeArea.name.fi })}
        </Typography>
      </StyledHeaderContainer>
      {filteredMobilityProfiles?.length
        ? filteredMobilityProfiles.map(item => (
          <StyledFlexContainer key={item.id}>
            <StyledTextContainer>
              <ReactSVG src={getIconByTopic(item.result)} className={iconClass} />
            </StyledTextContainer>
            <StyledTextContainer>
              <Typography variant="body2" component="p">
                {getLocaleText(item.result_topics)}
              </Typography>
            </StyledTextContainer>
            <StyledTextContainer>
              <Typography variant="body2" component="p">
                {item.count}
              </Typography>
            </StyledTextContainer>
          </StyledFlexContainer>
        ))
        : noResultsText()}
    </StyledContainer>
  );
};

MobilityProfilesContent.propTypes = {
  postcodeArea: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.shape({
      fi: PropTypes.string,
    }),
  }),
  mobilityProfiles: PropTypes.arrayOf(
    PropTypes.shape({
      postal_code_string: PropTypes.string,
      postal_code_type_string: PropTypes.string,
      result: PropTypes.number,
    }),
  ),
};

MobilityProfilesContent.defaultProps = {
  postcodeArea: {},
  mobilityProfiles: [],
};

export default MobilityProfilesContent;
