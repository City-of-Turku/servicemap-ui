import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useMap, useMapEvents } from 'react-leaflet';
import rydeIcon from 'servicemap-ui-turku/assets/icons/icons-icon_ryde.svg';
import rydeIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_ryde-bw.svg';
import { useMobilityPlatformContext } from '../../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../../redux/selectors/settings';
import useIotDataFetch from '../../../utils/useIotDataFetch';
import useScootersDataFetch from '../../../utils/useScooterDataFetch';
import ScooterInfo from './components/ScooterInfo';
import { isDataValid } from '../../../utils/utils';
import { StyledPopupWrapper, StyledPopupInner } from '../../../styled/styled';

const ScooterMarkers = ({ mapObject }) => {
  const { showScooters } = useMobilityPlatformContext();

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

  // TODO Add secure way to fetch & store token

  const { iotData: scooterDataRyde } = useIotDataFetch('SDR', showScooters.ryde);
  const token = 'loremipsum';
  const { data: scooterDataVoi } = useScootersDataFetch(token, showScooters.voi);

  const filterByBounds = data => {
    if (data?.length) {
      return data?.filter(item => map.getBounds().contains([item.lat, item.lon]));
    }
    return [];
  };

  const filteredScootersRyde = filterByBounds(scooterDataRyde);
  const validDataRyde = isDataValid(showScooters.ryde, filteredScootersRyde) && isDetailZoom;

  const filteredScootersVoi = filterByBounds(scooterDataVoi);
  const validDataVoi = isDataValid(showScooters.voi, filteredScootersVoi) && isDetailZoom;

  const renderScooterData = (isValid, data) => (
    isValid ? (
      data.map(item => (
        <Marker
          key={item.bike_id}
          icon={customIcon}
          position={[item.lat, item.lon]}
        >
          <StyledPopupWrapper>
            <Popup>
              <StyledPopupInner>
                <ScooterInfo item={item} />
              </StyledPopupInner>
            </Popup>
          </StyledPopupWrapper>
        </Marker>
      ))
    ) : null
  );

  return (
    <>
      {renderScooterData(validDataRyde, filteredScootersRyde)}
      {renderScooterData(validDataVoi, filteredScootersVoi)}
    </>
  );
};

ScooterMarkers.propTypes = {
  mapObject: PropTypes.shape({
    options: PropTypes.shape({
      detailZoom: PropTypes.number,
    }),
  }).isRequired,
};

export default ScooterMarkers;
