import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useMap, useMapEvents } from 'react-leaflet';
import rydeIcon from 'servicemap-ui-turku/assets/icons/icons-icon_ryde.svg';
import rydeIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_ryde-bw.svg';
import { useMobilityPlatformContext } from '../../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../../redux/selectors/settings';
import { fetchIotData } from '../../../mobilityPlatformRequests/mobilityPlatformRequests';
import ScooterInfo from './components/ScooterInfo';
import { isDataValid } from '../../../utils/utils';

const ScooterMarkers = ({ mapObject }) => {
  const [scooterData, setScooterData] = useState([]);

  const { showScootersRyde } = useMobilityPlatformContext();

  const useContrast = useSelector(useAccessibleMap);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const map = useMap();
  const [zoomLevel, setZoomLevel] = useState(map.getZoom());

  const mapEvent = useMapEvents({
    zoomend() {
      setZoomLevel(mapEvent.getZoom());
    },
  });

  const isDetailZoom = zoomLevel >= mapObject.options.detailZoom;

  const setProviderIcon = useContrast ? rydeIconBw : rydeIcon;

  const customIcon = icon({
    iconUrl: setProviderIcon,
    iconSize: [40, 40],
  });

  useEffect(() => {
    if (showScootersRyde) {
      fetchIotData('SDR', setScooterData, true);
    }
  }, [showScootersRyde, setScooterData]);

  const filterByBounds = (data) => {
    if (data && data.length > 0) {
      return data.filter(item => map.getBounds().contains([item.lat, item.lon]));
    }
    return [];
  };

  const filteredScooters = filterByBounds(scooterData);

  const renderData = isDataValid(showScootersRyde, filteredScooters) && isDetailZoom;

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

ScooterMarkers.propTypes = {
  mapObject: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ScooterMarkers;
