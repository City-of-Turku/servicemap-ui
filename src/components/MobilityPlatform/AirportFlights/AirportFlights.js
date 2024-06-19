/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import airPlaneIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_airplane-bw.svg';
import airPlaneIcon from 'servicemap-ui-turku/assets/icons/icons-icon_airplane.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { selectMapRef } from '../../../redux/selectors/general';
import { createIcon } from '../utils/utils';
import useIotDataFetch from '../utils/useIotDataFetch';
import { StyledPopupWrapper, StyledPopupInner } from '../styled/styled';
import AirportFlightsContent from './components/AirportFlightsContent';

const AirportFlights = () => {
  const { showAirports } = useMobilityPlatformContext();

  const map = useSelector(selectMapRef);
  const useContrast = useSelector(useAccessibleMap);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const customIcon = icon(createIcon(useContrast ? airPlaneIconBw : airPlaneIcon));

  const airportData = {
    id: 'airports',
    lat: 60.514722,
    lon: 22.261667,
  };

  useEffect(() => {
    if (showAirports) {
      const bounds = [];
      bounds.push([airportData.lat, airportData.lon]);
      map.fitBounds(bounds);
    }
  }, [showAirports]);

  const { iotData: arrivalsData } = useIotDataFetch('FAA', showAirports);
  const { iotData: departeesData } = useIotDataFetch('FAD', showAirports);

  return showAirports ? (
    <Marker icon={customIcon} position={[airportData.lat, airportData.lon]}>
      <StyledPopupWrapper>
        <Popup className="popup-w350">
          <StyledPopupInner>
            <AirportFlightsContent arrivals={arrivalsData} departees={departeesData} />
          </StyledPopupInner>
        </Popup>
      </StyledPopupWrapper>
    </Marker>
  ) : null;
};

export default AirportFlights;
