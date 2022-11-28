import React from 'react';
import { Checkbox, FormControlLabel, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

const ScooterProviderList = ({
  intl, classes, openList, scooterProviders,
}) => {
  const renderData = scooterProviders && scooterProviders.length > 0;

  return (
    openList ? (
      <>
        <div className={`${classes.paragraph} ${classes.border}`}>
          <Typography
            variant="body2"
            aria-label={intl.formatMessage({ id: 'mobilityPlatform.menu.scooters.list.info' })}
          >
            {intl.formatMessage({ id: 'mobilityPlatform.menu.scooters.list.info' })}
          </Typography>
        </div>
        {renderData
              && scooterProviders.map(item => (
                <div key={item.type} className={classes.checkBoxContainer}>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={item.checkedValue}
                        aria-checked={item.checkedValue}
                        className={classes.margin}
                        onChange={() => item.onChangeValue()}
                      />
                    )}
                    label={(
                      <Typography
                        variant="body2"
                        aria-label={intl.formatMessage({ id: 'mobilityPlatform.menu.show.scootersRyde' })}
                      >
                        {intl.formatMessage({ id: 'mobilityPlatform.menu.show.scootersRyde' })}
                      </Typography>
                    )}
                  />
                </div>
              ))}
      </>
    ) : null
  );
};

ScooterProviderList.propTypes = {
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  openList: PropTypes.bool,
  scooterProviders: PropTypes.arrayOf(PropTypes.object),
};

ScooterProviderList.defaultProps = {
  openList: false,
  scooterProviders: [],
};

export default ScooterProviderList;
