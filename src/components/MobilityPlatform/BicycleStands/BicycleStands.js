import { PropTypes } from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import { useSelector } from 'react-redux';
import bicycleStandIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_bicycle_stand-bw.svg';
import circleIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_circle_border-bw.svg';
import bicycleStandIcon from 'servicemap-ui-turku/assets/icons/icons-icon_bicycle-stand.svg';
import circleIcon from 'servicemap-ui-turku/assets/icons/icons-icon_circle_border.svg';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { isDataValid, fitToMapBounds } from '../utils/utils';
import BicycleStandContent from './components/BicycleStandContent';

const BicycleStands = ({ classes }) => {
  const [bicycleStands, setBicycleStands] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(13);

  const { openMobilityPlatform, showBicycleStands } = useContext(MobilityPlatformContext);

  const useContrast = useSelector(useAccessibleMap);

  const map = useMap();

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const setBaseIcon = useContrast ? bicycleStandIconBw : bicycleStandIcon;
  const setCircleIcon = useContrast ? circleIconBw : circleIcon;

  const customIcon = icon({
    iconUrl: zoomLevel < 14 ? setCircleIcon : setBaseIcon,
    iconSize: zoomLevel < 14 ? [20, 20] : [45, 45],
  });

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapData('BicycleStand', 1000, setBicycleStands);
    }
  }, [openMobilityPlatform, setBicycleStands]);

  const mapEvent = useMapEvents({
    zoomend() {
      setZoomLevel(mapEvent.getZoom());
    },
  });

  const renderData = isDataValid(showBicycleStands, bicycleStands);

  useEffect(() => {
    fitToMapBounds(renderData, bicycleStands, map);
  }, [showBicycleStands, bicycleStands]);

  return (
    <>
      {renderData ? (
        bicycleStands.map(item => (
          <Marker
            key={item.id}
            icon={customIcon}
            position={[item.geometry_coords.lat, item.geometry_coords.lon]}
          >
            <div className={classes.popupWrapper}>
              <Popup>
                <div className={classes.popupInner}>
                  <BicycleStandContent
                    bicycleStand={item}
                  />
                </div>
              </Popup>
            </div>
          </Marker>
        ))
      ) : null}
    </>
  );
};

BicycleStands.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default BicycleStands;
