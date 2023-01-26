import { PropTypes } from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import bicycleStandIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_bicycle_stand-bw.svg';
import sportIcon from 'servicemap-ui-turku/assets/icons/icons-icon_sport.svg';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { isDataValid, fitToMapBounds, createIcon } from '../utils/utils';
import OutdoorGymDevicesContent from './components/OutdoorGymDevicesContent';

const OutdoorGymDevices = ({ classes }) => {
  const [outdoorGymDevices, setOutdoorGymDevices] = useState([]);

  const { openMobilityPlatform, showOutdoorGymDevices } = useContext(MobilityPlatformContext);

  const useContrast = useSelector(useAccessibleMap);

  const map = useMap();

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const customIcon = icon(createIcon(useContrast ? bicycleStandIconBw : sportIcon));

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapData('OutdoorGymDevice', 100, setOutdoorGymDevices);
    }
  }, [openMobilityPlatform, setOutdoorGymDevices]);

  const renderData = isDataValid(showOutdoorGymDevices, outdoorGymDevices);

  useEffect(() => {
    fitToMapBounds(renderData, outdoorGymDevices, map);
  }, [showOutdoorGymDevices, outdoorGymDevices]);

  return (
    <>
      {renderData ? (
        outdoorGymDevices.map(item => (
          <Marker
            key={item.id}
            icon={customIcon}
            position={[item.geometry_coords.lat, item.geometry_coords.lon]}
          >
            <div className={classes.popupWrapper}>
              <Popup className="popup-w350">
                <div className={classes.popupInner}>
                  <OutdoorGymDevicesContent item={item} />
                </div>
              </Popup>
            </div>
          </Marker>
        ))
      ) : null}
    </>
  );
};

OutdoorGymDevices.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default OutdoorGymDevices;
