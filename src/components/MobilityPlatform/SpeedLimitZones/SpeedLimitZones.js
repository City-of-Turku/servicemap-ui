import { useSelector } from 'react-redux';
import React, { useContext } from 'react';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { isDataValid, whiteOptionsBase } from '../utils/utils';
import PolygonComponent from '../PolygonComponent';
import SpeedLimitZonesContent from './components/SpeedLimitZonesContent';

const SpeedLimitZones = () => {
  const { showSpeedLimitZones, speedLimitSelections, speedLimitZones } = useContext(MobilityPlatformContext);

  const useContrast = useSelector(useAccessibleMap);

  const filterZones = (data) => {
    if (data && data.length > 0) {
      return data.filter(item => speedLimitSelections.includes(item.extra.speed_limit));
    }
    return [];
  };

  const whiteOptions = whiteOptionsBase();

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
      color: useContrast ? whiteOptions : `rgba(${rgba})`,
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
          <PolygonComponent
            key={item.id}
            item={item}
            useContrast={useContrast}
            pathOptions={getPathOptions(item.extra.speed_limit)}
          >
            <SpeedLimitZonesContent item={item} />
          </PolygonComponent>
        ))
      ) : null}
    </>
  );
};

export default SpeedLimitZones;
