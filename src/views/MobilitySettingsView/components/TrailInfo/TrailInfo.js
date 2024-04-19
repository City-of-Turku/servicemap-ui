import { Typography } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import styled from '@emotion/styled';

const TrailInfo = ({ item }) => {
  const intl = useIntl();

  const renderLength = () => {
    const formatLength = item.extra.length_km.toString().replace('.', ',');

    return (
      <Typography
        component="p"
        variant="body2"
      >
        {intl.formatMessage(
          { id: 'mobilityPlatform.menu.markedTrails.length' },
          { value: formatLength },
        )}
      </Typography>
    );
  };

  return (
    <div>
      <StyledParagraph>{renderLength()}</StyledParagraph>
    </div>
  );
};

const StyledParagraph = styled.div(({ theme }) => ({
  textAlign: 'left',
  padding: theme.spacing(1.5),
  width: '85%',
  marginLeft: theme.spacing(3),
}));

TrailInfo.propTypes = {
  item: PropTypes.shape({
    extra: PropTypes.shape({
      length_km: PropTypes.number,
    }),
  }),
};

TrailInfo.defaultProps = {
  item: {},
};

export default TrailInfo;
