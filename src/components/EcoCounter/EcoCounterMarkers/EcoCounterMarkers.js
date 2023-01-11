/* eslint-disable react-hooks/exhaustive-deps */
import { PropTypes } from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import ecoCounterIcon from 'servicemap-ui-turku/assets/icons/icons-icon_ecocounter.svg';
import ecoCounterIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_ecocounter-bw.svg';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { createIcon, isDataValid } from '../../MobilityPlatform/utils/utils';
import { fetchTrafficCounterStations } from '../EcoCounterRequests/ecoCounterRequests';
import EcoCounterContent from '../EcoCounterContent';

const EcoCounterMarkers = ({ classes }) => {
  const [ecoCounterStations, setEcoCounterStations] = useState([]);

  const { openMobilityPlatform, showEcoCounter } = useContext(MobilityPlatformContext);

  const useContrast = useSelector(useAccessibleMap);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const customIcon = icon(createIcon(useContrast ? ecoCounterIconBw : ecoCounterIcon));

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchTrafficCounterStations('EC', setEcoCounterStations);
    }
  }, [openMobilityPlatform, setEcoCounterStations]);

  const map = useMap();

  const stationNames = ['Teatterisilta', 'Auransilta', 'Kirjastosilta', 'Teatteri ranta'];

  /**
   * Filter out stations that only show data about cycling
   * @param {array} data
   * @returns array
   */
  const filterStations = data => data.reduce((acc, curr) => {
    if (stationNames.includes(curr.name)) {
      acc.push(curr);
    }
    return acc;
  }, []);

  const stationsWithPedestrians = filterStations(ecoCounterStations);
  /** All stations contain data about cyclists */
  const renderAllStations = isDataValid(showEcoCounter.cycling, ecoCounterStations);
  /** 4 stations contain data about pedestrians as well */
  const renderFilteredStations = isDataValid(showEcoCounter.walking, stationsWithPedestrians);

  /**
   * Fit markers to map bounds
   * @param {boolean} isValid
   * @param {array} data
   */
  const fitToMapBounds = (isValid, data) => {
    if (isValid) {
      const bounds = [];
      data.forEach((item) => {
        bounds.push([item.lat, item.lon]);
      });
      map.fitBounds(bounds);
    }
  };

  useEffect(() => {
    fitToMapBounds(showEcoCounter.walking, stationsWithPedestrians);
  }, [showEcoCounter.walking, ecoCounterStations]);

  useEffect(() => {
    fitToMapBounds(showEcoCounter.cycling, ecoCounterStations);
  }, [showEcoCounter.cycling, ecoCounterStations]);

  /**
   * Render markers on the map
   * @param {boolean} isValid
   * @param {array} data
   * @returns {JSX element}
   */
  const renderStations = (isValid, data) => (isValid ? (
    data.map(item => (
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
    ))
  ) : null
  );

  return (
    <>
      {renderStations(renderAllStations, ecoCounterStations)}
      {renderStations(renderFilteredStations, stationsWithPedestrians)}
    </>
  );
};

EcoCounterMarkers.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default EcoCounterMarkers;
