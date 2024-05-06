/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import { useSelector } from 'react-redux';
import rentalCarIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_rental_car-bw.svg';
import providerIcon from 'servicemap-ui-turku/assets/icons/icons-icon_24rent.svg';
import rentalCarIcon from 'servicemap-ui-turku/assets/icons/icons-icon_rental_car.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchIotData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { isDataValid, setRender, checkMapType } from '../utils/utils';
import { isEmbed } from '../../../utils/path';
import { StyledPopupWrapper, StyledPopupInner } from '../styled/styled';
import RentalCarsContent from './components/RentalCarsContent';

const RentalCars = () => {
  const [rentalCarsData, setRentalCarsData] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(13);

  const { showRentalCars } = useMobilityPlatformContext();

  const url = new URL(window.location);
  const embedded = isEmbed({ url: url.toString() });

  const useContrast = useSelector(useAccessibleMap);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const mapEvent = useMapEvents({
    zoomend() {
      setZoomLevel(mapEvent.getZoom());
    },
  });

  const setBaseIcon = checkMapType(embedded, useContrast, url) ? rentalCarIconBw : rentalCarIcon;

  const customIcon = icon({
    iconUrl: zoomLevel < 14 ? setBaseIcon : providerIcon,
    iconSize: zoomLevel < 14 ? [45, 45] : [50, 56],
  });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    if (showRentalCars || embedded) {
      fetchIotData('R24', setRentalCarsData, signal);
    }
    return () => controller.abort();
  }, [showRentalCars, embedded]);

  const map = useMap();

  const paramValue = url.searchParams.get('rental_cars') === '1';
  const renderData = setRender(paramValue, embedded, showRentalCars, rentalCarsData, isDataValid);

  useEffect(() => {
    if (renderData && !embedded) {
      const bounds = [];
      rentalCarsData.forEach(item => {
        bounds.push([item.homeLocationData.coordinates.latitude, item.homeLocationData.coordinates.longitude]);
      });
      map.fitBounds(bounds);
    }
  }, [showRentalCars, rentalCarsData]);

  return (
    renderData ? (
      rentalCarsData.filter(item => item.availabilityData.available).map(item => (
        <Marker
          key={item.id}
          icon={customIcon}
          position={[item.homeLocationData.coordinates.latitude, item.homeLocationData.coordinates.longitude]}
        >
          <StyledPopupWrapper>
            <Popup className="rental-cars-popup">
              <StyledPopupInner>
                <RentalCarsContent
                  car={item}
                />
              </StyledPopupInner>
            </Popup>
          </StyledPopupWrapper>
        </Marker>
      ))
    ) : null
  );
};

export default RentalCars;
