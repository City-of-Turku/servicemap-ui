import { Typography } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { format } from 'date-fns';

const RoadworksContent = ({ item }) => {
  const roadworkDetails = item?.properties?.announcements[0];

  const formatDate = (dateTimeValue) => format(new Date(dateTimeValue), 'dd.MM.yyyy');

  const filterRestrictions = (restrictionsData) => {
    const restrictionTypes = ['SPEED_LIMIT', 'SPEED_LIMIT_LENGTH'];
    if (restrictionsData?.length > 0) {
      return restrictionsData.filter((restriction) => restrictionTypes.includes(restriction.type));
    }
    return [];
  };

  const roadWorksRestrictions = filterRestrictions(roadworkDetails.roadWorkPhases[0]?.restrictions);

  const renderRestrictions = () => (
    roadWorksRestrictions?.length > 0 ? (
      roadWorksRestrictions.map((limitItem) => (
        <StyledTextContainer key={limitItem.restriction.quantity}>
          <Typography variant="body2">
            {`${limitItem.restriction.name}: ${limitItem.restriction.quantity} ${limitItem.restriction.unit}`}
          </Typography>
        </StyledTextContainer>
      ))
    ) : null
  );

  const renderExtraFeatures = () => (
    roadworkDetails.features?.length > 0 ? (
      roadworkDetails.features.map((feature) => (
        <React.Fragment key={feature.name}>
          {feature.quantity && feature.unit ? (
            <StyledTextContainer>
              <Typography variant="body2">
                {`${feature.name}: ${feature.quantity} ${feature.unit}`}
              </Typography>
            </StyledTextContainer>
          ) : (
            <StyledTextContainer>
              <Typography variant="body2">
                {feature.name}
              </Typography>
            </StyledTextContainer>
          )}
        </React.Fragment>
      ))
    ) : null
  );

  const renderDateValues = () => {
    if (roadworkDetails?.timeAndDuration.startTime && roadworkDetails?.timeAndDuration.endTime) {
      return (
        <StyledTextContainer>
          <StyledText variant="body2">
            {`Aika: ${formatDate(roadworkDetails?.timeAndDuration.startTime)} - ${formatDate(
              roadworkDetails?.timeAndDuration.endTime,
            )}`}
          </StyledText>
        </StyledTextContainer>
      );
    }
    if (roadworkDetails.timeAndDuration.startTime) {
      return (
        <StyledTextContainer>
          <StyledText variant="body2">
            {`Työ alkoi: ${formatDate(roadworkDetails?.timeAndDuration.startTime)}`}
          </StyledText>
        </StyledTextContainer>
      );
    }
    return null;
  };

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
        {roadworkDetails.comment ? (
          <StyledTextContainer>
            <StyledText variant="body2">{roadworkDetails?.comment}</StyledText>
          </StyledTextContainer>
        ) : null}
        {renderRestrictions()}
        {renderExtraFeatures()}
        {renderDateValues()}
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
      situationType: PropTypes.string,
      announcements: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string,
          location: PropTypes.shape({
            description: PropTypes.string,
          }),
          timeAndDuration: PropTypes.shape({
            startTime: PropTypes.string,
            endTime: PropTypes.string,
          }),
        }),
      ),
    }),
  }),
};

RoadworksContent.defaultProps = {
  item: {},
};

export default RoadworksContent;
