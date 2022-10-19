import React, { useContext, useEffect, useState } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import circleIcon from 'servicemap-ui-turku/assets/icons/icons-icon_circle_border.svg';
import rydeIcon from 'servicemap-ui-turku/assets/icons/icons-icon_ryde.svg';
import scooterIcon from 'servicemap-ui-turku/assets/icons/icons-icon_scooters_marker.svg';
import MobilityPlatformContext from '../../../../../context/MobilityPlatformContext';
import { fetchIotData } from '../../../mobilityPlatformRequests/mobilityPlatformRequests';
import ScooterInfo from './components/ScooterInfo';

const ScooterMarkers = () => {
  const [scooterData, setScooterData] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(13);

  const { openMobilityPlatform, showScootersRyde } = useContext(MobilityPlatformContext);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const map = useMap();

  const mapEvent = useMapEvents({
    zoomend() {
      setZoomLevel(mapEvent.getZoom());
    },
  });

  const setIcon = (zoomLvl) => {
    if (zoomLvl < 14) {
      return circleIcon;
    }
    if (zoomLvl > 16) {
      return rydeIcon;
    }
    return scooterIcon;
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

  const filteredScooters = scooterData.filter(item => map.getBounds().contains([item.lat, item.lon]));

  return (
    <>
      {showScootersRyde ? (
        <div>
          {filteredScooters && filteredScooters.length > 0
            && filteredScooters.map(item => (
              <Marker
                key={item.bike_id}
                icon={customIcon}
                position={[item.lat, item.lon]}
              >
                <Popup>
                  <ScooterInfo item={item} />
                </Popup>
              </Marker>
            ))}
        </div>
      ) : null}
    </>
  );
};

export default ScooterMarkers;
