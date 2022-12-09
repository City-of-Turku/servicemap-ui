import { PropTypes } from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import gasFillingIcon from 'servicemap-ui-turku/assets/icons/icons-icon_gas_station.svg';
import gasFillingIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_gas_station-bw.svg';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { createIcon, isDataValid, fitToMapBounds } from '../utils/utils';
import GasFillingStationContent from './components/GasFillingStationContent';

const GasFillingStationMarkers = ({ classes }) => {
  const [gasFillingStations, setGasFillingStations] = useState([]);

  const { openMobilityPlatform, showGasFillingStations } = useContext(MobilityPlatformContext);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);

  const gasStationIcon = icon(createIcon(useContrast ? gasFillingIconBw : gasFillingIcon));

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapData('GasFillingStation', 10, setGasFillingStations);
    }
  }, [openMobilityPlatform, setGasFillingStations]);

  const renderData = isDataValid(showGasFillingStations, gasFillingStations);

  const map = useMap();

  useEffect(() => {
    fitToMapBounds(renderData, gasFillingStations, map);
  }, [showGasFillingStations, gasFillingStations]);

  return (
    <>
      {renderData ? (
        gasFillingStations.map(item => (
          <Marker
            key={item.id}
            icon={gasStationIcon}
            position={[item.geometry_coords.lat, item.geometry_coords.lon]}
          >
            <div className={classes.popupWrapper}>
              <Popup className="popup-w350">
                <div className={classes.popupInner}>
                  <GasFillingStationContent
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

GasFillingStationMarkers.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};


export default GasFillingStationMarkers;
