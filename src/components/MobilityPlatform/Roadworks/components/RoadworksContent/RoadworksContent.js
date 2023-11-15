import { Typography } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { format } from 'date-fns';

const RoadworksContent = ({ item }) => {
  const roadworkDetails = item?.properties?.announcements[0];

  const formatDate = (dateTimeValue) => format(new Date(dateTimeValue), 'dd.MM.yyyy');

  return (
    <StyledPopupInner>
      <StyledHeader>
        <StyledText variant="subtitle2" component="h4">
          {roadworkDetails?.title}
        </StyledText>
      </StyledHeader>
      <div>
        <StyledTextContainer>
          <StyledText variant="body2">{roadworkDetails?.location?.description}</StyledText>
        </StyledTextContainer>
        <StyledTextContainer>
          <StyledText variant="body2">
            {`Aika: ${formatDate(roadworkDetails.timeAndDuration.startTime)} - ${formatDate(
              roadworkDetails.timeAndDuration.endTime,
            )}`}
          </StyledText>
        </StyledTextContainer>
      </div>
    </StyledPopupInner>
  );
};

const StyledText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
}));

const StyledTextContainer = styled.div(({ theme }) => ({
  marginBottom: theme.spacing(0.75),
}));

const StyledPopupInner = styled.div(({ theme }) => ({
  borderRadius: '3px',
  marginBottom: theme.spacing(1),
  marginLeft: theme.spacing(1.2),
  lineHeight: 1.2,
  overflowX: 'hidden',
}));

const StyledHeader = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  marginTop: theme.spacing(0.5),
  marginBottom: theme.spacing(1),
  alignItems: 'flex-end',
  borderBottom: '2px solid gray',
  justifyContent: 'space-between',
  width: '86%',
}));

RoadworksContent.propTypes = {
  item: PropTypes.shape({
    properties: PropTypes.shape({
      announcements: PropTypes.shape({
        title: PropTypes.string,
        location: PropTypes.shape({
          description: PropTypes.string,
        }),
        timeAndDuration: PropTypes.shape({
          startTime: PropTypes.string,
          endTime: PropTypes.string,
        }),
      }),
    }),
  }),
};

RoadworksContent.defaultProps = {
  item: {},
};

export default RoadworksContent;
