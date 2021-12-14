import React, { useEffect, useState, useContext } from 'react';
import { PropTypes } from 'prop-types';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import EcoCounterContent from '../EcoCounterContent';
import { fetchEcoCounterStations } from '../EcoCounterRequests/ecoCounterRequests';
import markerIcon from '../../../../node_modules/servicemap-ui-turku/assets/icons/icons-icon_ecocounter.svg';

const EcoCounterMarkers = ({ classes }) => {
  const [ecoCounterStations, setEcoCounterStations] = useState(null);

  const { showEcoCounter } = useContext(MobilityPlatformContext);

  const apiUrl = window.nodeEnvSettings.ECOCOUNTER_API;

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const ecoCounterIcon = icon({
    iconUrl: markerIcon,
    iconSize: [45, 45],
  });

  useEffect(() => {
    fetchEcoCounterStations(apiUrl, setEcoCounterStations);
  }, [setEcoCounterStations]);

  return (
    <>
      {showEcoCounter ? (
        <div>
          <div>
            {ecoCounterStations && ecoCounterStations.map(item => (
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
          </div>
        </div>
      ) : null}
    </>
  );
};

EcoCounterMarkers.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default EcoCounterMarkers;
