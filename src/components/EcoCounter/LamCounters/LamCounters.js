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

const LamCounters = ({ classes }) => {
  const [lamCounterStations, setLamCounterStations] = useState([]);

  const { openMobilityPlatform, showLamCounter } = useContext(MobilityPlatformContext);

  const useContrast = useSelector(useAccessibleMap);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const customIcon = icon(createIcon(useContrast ? ecoCounterIconBw : ecoCounterIcon));

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchTrafficCounterStations('LC', setLamCounterStations);
    }
  }, [openMobilityPlatform, setLamCounterStations]);

  const map = useMap();

  const renderData = isDataValid(showLamCounter, lamCounterStations);

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      lamCounterStations.forEach((item) => {
        bounds.push([item.lat, item.lon]);
      });
      map.fitBounds(bounds);
    }
  }, [showLamCounter, lamCounterStations]);

  return (
    <>
      {renderData ? (
        lamCounterStations.map(item => (
          <Marker key={item.id} icon={customIcon} position={[item.lat, item.lon]}>
            <div className={classes.popupWrapper}>
              <Popup className="ecocounter-popup">
                <div className={classes.popupInner}>
                  <p>{item.name}</p>
                </div>
              </Popup>
            </div>
          </Marker>
        ))
      ) : null}
    </>
  );
};

LamCounters.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default LamCounters;
