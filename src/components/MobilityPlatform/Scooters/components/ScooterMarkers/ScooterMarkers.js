import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMap, useMapEvents } from 'react-leaflet';
import circleIcon from 'servicemap-ui-turku/assets/icons/icons-icon_circle_border.svg';
import circleIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_circle_border-bw.svg';
import rydeIcon from 'servicemap-ui-turku/assets/icons/icons-icon_ryde.svg';
import rydeIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_ryde-bw.svg';
import scooterIcon from 'servicemap-ui-turku/assets/icons/icons-icon_scooters_marker.svg';
import scooterIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_scooters_marker-bw.svg';
import { MobilityPlatformContext } from '../../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../../redux/selectors/settings';
import { fetchIotData } from '../../../mobilityPlatformRequests/mobilityPlatformRequests';
import ScooterInfo from './components/ScooterInfo';
import { isDataValid } from '../../../utils/utils';

const ScooterMarkers = () => {
  const [scooterData, setScooterData] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(13);

  const { openMobilityPlatform, showScootersRyde } = useContext(MobilityPlatformContext);

  const useContrast = useSelector(useAccessibleMap);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const map = useMap();

  const mapEvent = useMapEvents({
    zoomend() {
      setZoomLevel(mapEvent.getZoom());
    },
  });

  const setBaseIcon = useContrast ? scooterIconBw : scooterIcon;
  const setProviderIcon = useContrast ? rydeIconBw : rydeIcon;
  const setCircleIcon = useContrast ? circleIconBw : circleIcon;

  const setIcon = (zoomLvl) => {
    if (zoomLvl < 14) {
      return setCircleIcon;
    }
    if (zoomLvl > 16) {
      return setProviderIcon;
    }
    return setBaseIcon;
  };

  const setIconSize = (zoomLvl) => {
    if (zoomLvl < 14) {
      return [20, 20];
    }
    if (zoomLvl > 16) {
      return [40, 40];
    }
    return [45, 45];
  };

  const customIcon = icon({
    iconUrl: setIcon(zoomLevel),
    iconSize: setIconSize(zoomLevel),
  });

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchIotData('SDR', setScooterData, true);
    }
  }, [openMobilityPlatform, setScooterData]);

  const filterByBounds = (data) => {
    if (data && data.length > 0) {
      return data.filter(item => map.getBounds().contains([item.lat, item.lon]));
    }
    return [];
  };

  const filteredScooters = filterByBounds(scooterData);

  const renderData = isDataValid(showScootersRyde, filteredScooters);

  return (
    <>
      {renderData ? (
        filteredScooters.map(item => (
          <Marker
            key={item.bike_id}
            icon={customIcon}
            position={[item.lat, item.lon]}
          >
            <Popup>
              <ScooterInfo item={item} />
            </Popup>
          </Marker>
        ))
      ) : null}
    </>
  );
};

export default ScooterMarkers;
