import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import { StyledContainer, StyledHeaderContainer, StyledTextContainer } from '../../../styled/styled';

const BicycleStandContent = ({ bicycleStand }) => {
  const intl = useIntl();

  const messageIds = {
    model: 'mobilityPlatform.content.bicycleStands.model',
    places: 'mobilityPlatform.content.bicycleStands.numOfPlaces',
    stands: 'mobilityPlatform.content.bicycleStands.numOfStands',
    covered: 'mobilityPlatform.content.bicycleStands.covered',
    notCovered: 'mobilityPlatform.content.bicycleStands.notCovered',
    lockable: 'mobilityPlatform.content.bicycleStands.hullLockable',
    notLockable: 'mobilityPlatform.content.bicycleStands.hullNotLockable',
    maintained: 'mobilityPlatform.content.bicycleStands.maintainedByTku',
  };

  const titleTypo = () => (
    <StyledHeaderContainer>
      <Typography variant="subtitle1" component="h3">
        {bicycleStand.name}
      </Typography>
    </StyledHeaderContainer>
  );

  const multiValueTypo = messages => (
    <div>
      {bicycleStand.extra.model ? (
        <StyledTextContainer>
          <Typography component="p" variant="body2">
            {intl.formatMessage({
              id: messages.model,
            }, { value: bicycleStand.extra.model })}
          </Typography>
        </StyledTextContainer>
      ) : null}
      <StyledTextContainer>
        <Typography component="p" variant="body2">
          {intl.formatMessage({
            id: messages.places,
          }, { value: bicycleStand.extra.number_of_places })}
        </Typography>
      </StyledTextContainer>
      <StyledTextContainer>
        <Typography component="p" variant="body2">
          {intl.formatMessage({
            id: messages.stands,
          }, { value: bicycleStand.extra.number_of_stands })}
        </Typography>
      </StyledTextContainer>
      {bicycleStand.extra.covered ? (
        <StyledTextContainer>
          <Typography component="p" variant="body2" display="block">
            {intl.formatMessage({
              id: messages.covered,
            })}
          </Typography>
        </StyledTextContainer>
      ) : (
        <StyledTextContainer>
          <Typography component="p" variant="body2" display="block">
            {intl.formatMessage({
              id: messages.notCovered,
            })}
          </Typography>
        </StyledTextContainer>
      )}
      {bicycleStand.extra.hull_lockable ? (
        <StyledTextContainer>
          <Typography component="p" variant="body2" display="block">
            {intl.formatMessage({
              id: messages.lockable,
            })}
          </Typography>
        </StyledTextContainer>
      ) : (
        <StyledTextContainer>
          <Typography component="p" variant="body2" display="block">
            {intl.formatMessage({
              id: messages.notLockable,
            })}
          </Typography>
        </StyledTextContainer>
      )}
      {bicycleStand.extra.maintained_by_turku ? (
        <StyledTextContainer>
          <Typography component="p" variant="body2" display="block">
            {intl.formatMessage({
              id: messages.maintained,
            })}
          </Typography>
        </StyledTextContainer>
      ) : null}
    </div>
  );

  return (
    <StyledContainer>
      {titleTypo()}
      {multiValueTypo(messageIds)}
    </StyledContainer>
  );
};

BicycleStandContent.propTypes = {
  bicycleStand: PropTypes.shape({
    name: PropTypes.string,
    extra: PropTypes.shape({
      model: PropTypes.string,
      number_of_places: PropTypes.number,
      number_of_stands: PropTypes.number,
      covered: PropTypes.bool,
      hull_lockable: PropTypes.bool,
      maintained_by_turku: PropTypes.bool,
    }),
  }),
};

BicycleStandContent.defaultProps = {
  bicycleStand: {},
};

export default BicycleStandContent;
