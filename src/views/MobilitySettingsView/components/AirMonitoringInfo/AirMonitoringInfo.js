import { Link, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import useLocaleText from '../../../../utils/useLocaleText';

const AirMonitoringInfo = ({ infoTexts }) => {
  const [url, setUrl] = useState(infoTexts.url.fi);
  const intl = useIntl();
  const locale = useSelector(state => state.user.locale);

  const getLocaleText = useLocaleText();

  useEffect(() => {
    setUrl(getLocaleText(infoTexts.url));
  }, [locale]);

  const text = textValue => (
    <StyledTypography variant="body2" component="p">
      {intl.formatMessage({
        id: textValue,
      })}
    </StyledTypography>
  );

  return (
    <StyledContainer>
      {text(infoTexts.paragraph1)}
      {text(infoTexts.paragraph2)}
      {text(infoTexts.paragraph3)}
      <Link target="_blank" href={url}>
        {text(infoTexts.link)}
      </Link>
    </StyledContainer>
  );
};

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const StyledContainer = styled.div(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'left',
  paddingBottom: theme.spacing(1),
}));

AirMonitoringInfo.propTypes = {
  infoTexts: PropTypes.shape({
    paragraph1: PropTypes.string,
    paragraph2: PropTypes.string,
    paragraph3: PropTypes.string,
    link: PropTypes.string,
    url: PropTypes.shape({
      fi: PropTypes.string,
      en: PropTypes.string,
      sv: PropTypes.string,
    }),
  }),
};

AirMonitoringInfo.defaultProps = {
  infoTexts: {},
};

export default AirMonitoringInfo;
