import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const BicycleStandContent = ({
  classes, bicycleStand, intl,
}) => {
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
    <div className={classes.title}>
      <Typography variant="subtitle1" component="h3" className={classes.titleText}>
        {bicycleStand.name}
      </Typography>
    </div>
  );

  const multiValueTypo = messages => (
    <div className={classes.content}>
      {bicycleStand.extra.model ? (
        <div className={classes.paragraph}>
          <Typography component="p" variant="body2">
            {intl.formatMessage({
              id: messages.model,
            }, { value: bicycleStand.extra.model })}
          </Typography>
        </div>
      ) : null}
      <div className={classes.paragraph}>
        <Typography component="p" variant="body2">
          {intl.formatMessage({
            id: messages.places,
          }, { value: bicycleStand.extra.number_of_places })}
        </Typography>
      </div>
      <div className={classes.paragraph}>
        <Typography component="p" variant="body2">
          {intl.formatMessage({
            id: messages.stands,
          }, { value: bicycleStand.extra.number_of_stands })}
        </Typography>
      </div>
      {bicycleStand.extra.covered ? (
        <div className={classes.paragraph}>
          <Typography component="p" variant="body2" display="block">
            {intl.formatMessage({
              id: messages.covered,
            })}
          </Typography>
        </div>
      ) : (
        <div className={classes.paragraph}>
          <Typography component="p" variant="body2" display="block">
            {intl.formatMessage({
              id: messages.notCovered,
            })}
          </Typography>
        </div>
      )}
      {bicycleStand.extra.hull_lockable ? (
        <div className={classes.paragraph}>
          <Typography component="p" variant="body2" display="block">
            {intl.formatMessage({
              id: messages.lockable,
            })}
          </Typography>
        </div>
      ) : (
        <div className={classes.paragraph}>
          <Typography component="p" variant="body2" display="block">
            {intl.formatMessage({
              id: messages.notLockable,
            })}
          </Typography>
        </div>
      )}
      {bicycleStand.extra.maintained_by_turku ? (
        <div className={classes.paragraph}>
          <Typography component="p" variant="body2" display="block">
            {intl.formatMessage({
              id: messages.maintained,
            })}
          </Typography>
        </div>
      ) : null}
    </div>
  );

  return (
    <div className={classes.padding}>
      {titleTypo()}
      {multiValueTypo(messageIds)}
    </div>
  );
};

BicycleStandContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  bicycleStand: PropTypes.objectOf(PropTypes.any),
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

BicycleStandContent.defaultProps = {
  bicycleStand: {},
};

export default BicycleStandContent;
