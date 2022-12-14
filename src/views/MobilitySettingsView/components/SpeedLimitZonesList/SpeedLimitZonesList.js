import React from 'react';
import { Checkbox, FormControlLabel, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

const SpeedLimitZonesList = ({
  classes, intl, openSpeedLimitList, speedLimitListAsc, speedLimitSelections, setState,
}) => (openSpeedLimitList ? (
  <>
    <div className={`${classes.paragraph} ${classes.border}`}>
      <Typography
        variant="body2"
        aria-label={intl.formatMessage({ id: 'mobilityPlatform.menu.speedLimitZones.select' })}
      >
        {intl.formatMessage({ id: 'mobilityPlatform.menu.speedLimitZones.select' })}
      </Typography>
    </div>
    <div className={classes.buttonList}>
      {openSpeedLimitList
          && speedLimitListAsc.length > 0
          && speedLimitListAsc.map(item => (
            <div key={item} className={classes.checkBoxContainer}>
              <FormControlLabel
                control={(
                  <Checkbox
                    checked={speedLimitSelections.includes(item)}
                    aria-checked={speedLimitSelections.includes(item)}
                    className={classes.margin}
                    onChange={() => setState(item)}
                  />
                )}
                label={(
                  <Typography
                    variant="body2"
                    aria-label={intl.formatMessage(
                      {
                        id: 'mobilityPlatform.content.speedLimitZones.suffix',
                      },
                      { item },
                    )}
                  >
                    {intl.formatMessage(
                      {
                        id: 'mobilityPlatform.content.speedLimitZones.suffix',
                      },
                      { item },
                    )}
                  </Typography>
                )}
              />
            </div>
          ))}
    </div>
  </>
) : null);

SpeedLimitZonesList.propTypes = {
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  openSpeedLimitList: PropTypes.bool,
  speedLimitListAsc: PropTypes.arrayOf(PropTypes.number),
  speedLimitSelections: PropTypes.arrayOf(PropTypes.number),
  setState: PropTypes.func.isRequired,
};

SpeedLimitZonesList.defaultProps = {
  openSpeedLimitList: false,
  speedLimitListAsc: [],
  speedLimitSelections: [],
};

export default SpeedLimitZonesList;
