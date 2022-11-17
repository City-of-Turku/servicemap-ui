import { PropTypes } from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import chargerIcon from 'servicemap-ui-turku/assets/icons/icons-icon_charging_station.svg';
import chargerIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_charging_station-bw.svg';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { createIcon, isDataValid } from '../utils/utils';
import ChargerStationContent from './components/ChargerStationContent';

const ChargerStationMarkers = ({ classes }) => {
  const [chargerStations, setChargerStations] = useState([]);

  const { openMobilityPlatform, showChargingStations } = useContext(MobilityPlatformContext);

  const map = useMap();

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);

  const chargerStationIcon = icon(createIcon(useContrast ? chargerIconBw : chargerIcon));

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapData('CGS', 500, setChargerStations);
    }
  }, [openMobilityPlatform, setChargerStations]);

  const renderData = isDataValid(showChargingStations, chargerStations);

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      chargerStations.forEach((item) => {
        bounds.push([item.geometry_coords.lat, item.geometry_coords.lon]);
      });
      map.fitBounds(bounds);
    }
  }, [showChargingStations, chargerStations]);

  return (
    <>
      {renderData ? (
        chargerStations.map(item => (
          <Marker
            key={item.id}
            icon={chargerStationIcon}
            position={[item.geometry_coords.lat, item.geometry_coords.lon]}
          >
            <div className={classes.popupWrapper}>
              <Popup className="popup-w350">
                <div className={classes.popupInner}>
                  <ChargerStationContent
                    station={item}
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

ChargerStationMarkers.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ChargerStationMarkers;
