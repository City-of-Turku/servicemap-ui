import { PropTypes } from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import chargerIcon from 'servicemap-ui-turku/assets/icons/icons-icon_charging_station.svg';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { isDataValid, createIcon } from '../utils/utils';
import ChargerStationContent from './components/ChargerStationContent';

const ChargerStationMarkers = ({ classes }) => {
  const [chargerStations, setChargerStations] = useState([]);

  const { openMobilityPlatform, mobilityMap } = useContext(MobilityPlatformContext);

  const map = useMap();

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const chargerStationIcon = icon(createIcon(chargerIcon));

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapData('CGS', 500, setChargerStations);
    }
  }, [openMobilityPlatform, setChargerStations]);

  const renderData = isDataValid(mobilityMap.chargingStations, chargerStations);

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      chargerStations.forEach((item) => {
        bounds.push([item.geometry_coords.lat, item.geometry_coords.lon]);
      });
      map.fitBounds(bounds);
    }
  }, [mobilityMap.chargingStations, chargerStations]);

  return (
    <>
      {renderData
        && chargerStations.map(item => (
          <Marker
            key={item.id}
            icon={chargerStationIcon}
            position={[item.geometry_coords.lat, item.geometry_coords.lon]}
          >
            <div className={classes.popupWrapper}>
              <Popup className="charger-stations-popup">
                <div className={classes.popupInner}>
                  <ChargerStationContent station={item} />
                </div>
              </Popup>
            </div>
          </Marker>
        ))}
    </>
  );
};

ChargerStationMarkers.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ChargerStationMarkers;
