import React from 'react';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';
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
      {openSpeedLimitList && speedLimitListAsc.reduce((acc, curr) => {
        acc.push(
          <div key={curr} className={classes.checkBoxContainer}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={speedLimitSelections.includes(curr)}
                  aria-checked={speedLimitSelections.includes(curr)}
                  className={classes.margin}
                  onChange={() => setState(curr)}
                />
              )}
              label={(
                <Typography
                  variant="body2"
                  aria-label={intl.formatMessage(
                    {
                      id: 'mobilityPlatform.content.speedLimitZones.suffix',
                    },
                    { curr },
                  )}
                >
                  {intl.formatMessage(
                    {
                      id: 'mobilityPlatform.content.speedLimitZones.suffix',
                    },
                    { curr },
                  )}
                </Typography>
              )}
            />
          </div>,
        );
        return acc;
      }, [])}
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
