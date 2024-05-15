import { Typography } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { format } from 'date-fns';
import { StyledContainer, StyledHeaderContainer, StyledTextContainer } from '../../../styled/styled';

const RoadworksContent = ({ item }) => {
  const roadworkDetails = item?.announcements[0];

  const formatDate = dateTimeValue => format(new Date(dateTimeValue), 'dd.MM.yyyy');

  const filterRestrictions = restrictionsData => {
    const restrictionTypes = ['SPEED_LIMIT', 'SPEED_LIMIT_LENGTH'];
    if (restrictionsData?.length > 0) {
      return restrictionsData.filter(restriction => restrictionTypes.includes(restriction.type));
    }
    return [];
  };

  const roadWorksRestrictions = filterRestrictions(roadworkDetails.additional_info?.restrictions);

  const renderRestrictions = () => (
    roadWorksRestrictions?.length > 0 ? (
      roadWorksRestrictions.map(limitItem => (
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
      roadworkDetails.features.map(feature => (
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
    if (roadworkDetails?.additional_info?.timeAndDuration?.startTime && roadworkDetails?.additional_info.timeAndDuration.endTime) {
      return (
        <StyledTextContainer>
          <StyledText variant="body2">
            {`Aika: ${formatDate(roadworkDetails?.additional_info?.timeAndDuration?.startTime)} - ${formatDate(
              roadworkDetails?.additional_info?.timeAndDuration?.endTime,
            )}`}
          </StyledText>
        </StyledTextContainer>
      );
    }
    if (roadworkDetails?.additional_info?.timeAndDuration?.startTime) {
      return (
        <StyledTextContainer>
          <StyledText variant="body2">
            {`Työ alkoi: ${formatDate(roadworkDetails?.additional_info?.timeAndDuration?.startTime)}`}
          </StyledText>
        </StyledTextContainer>
      );
    }
    return null;
  };

  return (
    <StyledContainer>
      <StyledHeaderContainer>
        <StyledText variant="subtitle2" component="h4">
          {roadworkDetails?.title}
        </StyledText>
      </StyledHeaderContainer>
      <div>
        <StyledTextContainer>
          <StyledText variant="body2">{roadworkDetails?.description}</StyledText>
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
    </StyledContainer>
  );
};

const StyledText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
}));

RoadworksContent.propTypes = {
  item: PropTypes.shape({
    situationType: PropTypes.string,
    announcements: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        comment: PropTypes.string,
        additional_info: PropTypes.shape({
          timeAndDuration: PropTypes.shape({
            startTime: PropTypes.string,
            endTime: PropTypes.string,
          }),
        }),
      }),
    ),
  }),
};

RoadworksContent.defaultProps = {
  item: {},
};

export default RoadworksContent;
