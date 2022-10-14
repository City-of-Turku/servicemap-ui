import React, { useEffect, useState, useContext } from 'react';
import { PropTypes } from 'prop-types';
import { useMap } from 'react-leaflet';
import markerIcon from 'servicemap-ui-turku/assets/icons/icons-icon_ecocounter.svg';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import EcoCounterContent from '../EcoCounterContent';
import { fetchEcoCounterStations } from '../EcoCounterRequests/ecoCounterRequests';

const EcoCounterMarkers = ({ classes }) => {
  const [ecoCounterStations, setEcoCounterStations] = useState([]);

  const { openMobilityPlatform, mobilityMap } = useContext(MobilityPlatformContext);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const ecoCounterIcon = icon({
    iconUrl: markerIcon,
    iconSize: [45, 45],
  });

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchEcoCounterStations(setEcoCounterStations);
    }
  }, [openMobilityPlatform, setEcoCounterStations]);

  const map = useMap();

  useEffect(() => {
    if (mobilityMap.ecoCounter && ecoCounterStations && ecoCounterStations.length > 0) {
      const bounds = [];
      ecoCounterStations.forEach((item) => {
        bounds.push([item.lat, item.lon]);
      });
      map.fitBounds(bounds);
    }
  }, [mobilityMap.ecoCounter]);

  return (
    <>
      {mobilityMap.ecoCounter ? (
        <>
          {ecoCounterStations && ecoCounterStations.length > 0 && ecoCounterStations.map(item => (
            <Marker key={item.id} icon={ecoCounterIcon} position={[item.lat, item.lon]}>
              <div className={classes.popupWrapper}>
                <Popup className="ecocounter-popup">
                  <div className={classes.popupInner}>
                    <EcoCounterContent
                      stationId={item.id}
                      stationName={item.name}
                    />
                  </div>
                </Popup>
              </div>
            </Marker>
          ))}
        </>
      ) : null}
    </>
  );
};

EcoCounterMarkers.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default EcoCounterMarkers;
