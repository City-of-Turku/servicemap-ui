import { PropTypes } from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import ecoCounterIcon from 'servicemap-ui-turku/assets/icons/icons-icon_ecocounter.svg';
import ecoCounterIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_ecocounter-bw.svg';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { createIcon, isDataValid } from '../../MobilityPlatform/utils/utils';
import { fetchEcoCounterStations } from '../EcoCounterRequests/ecoCounterRequests';
import EcoCounterContent from '../EcoCounterContent';

const EcoCounterMarkers = ({ classes }) => {
  const [ecoCounterStations, setEcoCounterStations] = useState([]);

  const { openMobilityPlatform, mobilityMap } = useContext(MobilityPlatformContext);

  const useContrast = useSelector(useAccessibleMap);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const customIcon = icon(createIcon(useContrast ? ecoCounterIconBw : ecoCounterIcon));

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchEcoCounterStations(setEcoCounterStations);
    }
  }, [openMobilityPlatform, setEcoCounterStations]);

  const map = useMap();

  const renderData = isDataValid(mobilityMap.ecoCounter, ecoCounterStations);

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      ecoCounterStations.forEach((item) => {
        bounds.push([item.lat, item.lon]);
      });
      map.fitBounds(bounds);
    }
  }, [mobilityMap.ecoCounter]);

  return (
    <>
      {renderData
        && ecoCounterStations.map(item => (
          <Marker key={item.id} icon={customIcon} position={[item.lat, item.lon]}>
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
  );
};

EcoCounterMarkers.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default EcoCounterMarkers;
