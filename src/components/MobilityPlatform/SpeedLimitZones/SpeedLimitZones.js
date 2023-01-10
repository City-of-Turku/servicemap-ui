import { Typography } from '@material-ui/core';
import { PropTypes } from 'prop-types';
import { useSelector } from 'react-redux';
import React, { useContext } from 'react';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { isDataValid } from '../utils/utils';

const SpeedLimitZones = ({ classes, intl }) => {
  const { showSpeedLimitZones, speedLimitSelections, speedLimitZones } = useContext(MobilityPlatformContext);

  const { Polygon, Popup } = global.rL;

  const useContrast = useSelector(useAccessibleMap);

  const filterZones = (data) => {
    if (data && data.length > 0) {
      return data.filter(item => speedLimitSelections.includes(item.extra.speed_limit));
    }
    return [];
  };

  const filteredSpeedLimitZones = filterZones(speedLimitZones);

  const options = {
    black: {
      rgba: [0, 0, 0, 255], pattern: '2 8 8 8',
    },
    blue: {
      rgba: [7, 44, 115, 255], pattern: '2 10 10 10',
    },
    brown: {
      rgba: [117, 44, 23, 255], pattern: '10 2 10',
    },
    burgundy: {
      rgba: [128, 0, 32, 255], pattern: '11 3 11',
    },
    green: {
      rgba: [15, 115, 6, 255], pattern: '8 3 8',
    },
    orange: {
      rgba: [227, 97, 32, 255], pattern: '12 4',
    },
    purple: {
      rgba: [202, 15, 212, 255], pattern: '14 4 14',
    },
    red: {
      rgba: [251, 5, 21, 255], pattern: '10 5',
    },
    teal: {
      rgba: [0, 128, 128, 255], pattern: '7',
    },
    default: {
      rgba: [7, 44, 115, 255], pattern: '10 2 10',
    },
  };

  const getOption = (input) => {
    switch (input) {
      case 20:
        return options.brown;
      case 30:
        return options.green;
      case 40:
        return options.purple;
      case 50:
        return options.blue;
      case 60:
        return options.red;
      case 70:
        return options.teal;
      case 80:
        return options.burgundy;
      case 100:
        return options.orange;
      case 120:
        return options.black;
      default:
        return options.blue;
    }
  };

  const getPathOptions = (input) => {
    const { rgba, pattern } = getOption(input);
    return {
      color: useContrast ? 'rgba(255, 255, 255, 255)' : `rgba(${rgba})`,
      fillOpacity: 0.3,
      weight: 5,
      dashArray: useContrast ? pattern : null,
    };
  };

  const renderData = isDataValid(showSpeedLimitZones, filteredSpeedLimitZones);

  return (
    <>
      {renderData ? (
        filteredSpeedLimitZones.map(item => (
          <Polygon
            key={item.id}
            pathOptions={getPathOptions(item.extra.speed_limit)}
            positions={item.geometry_coords}
            eventHandlers={{
              mouseover: (e) => {
                e.target.setStyle({ fillOpacity: useContrast ? '0.6' : '0.3' });
              },
              mouseout: (e) => {
                e.target.setStyle({ fillOpacity: '0.3' });
              },
            }}
          >
            <div className={classes.popupWrapper}>
              <Popup>
                <div className={classes.popupInner}>
                  <div className={classes.subtitle}>
                    <Typography variant="subtitle1">
                      {intl.formatMessage({
                        id: 'mobilityPlatform.content.speedLimitZones.area',
                      })}
                    </Typography>
                  </div>
                  <Typography>
                    {intl.formatMessage({
                      id: 'mobilityPlatform.content.speedLimitZones.limit',
                    }, { item: item.extra.speed_limit })}
                  </Typography>
                </div>
              </Popup>
            </div>
          </Polygon>
        ))
      ) : null}
    </>
  );
};

SpeedLimitZones.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default SpeedLimitZones;
