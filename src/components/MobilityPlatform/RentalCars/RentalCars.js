/* eslint-disable react-hooks/exhaustive-deps */
import { PropTypes } from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import { useSelector } from 'react-redux';
import rentalCarIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_rental_car-bw.svg';
import providerIcon from 'servicemap-ui-turku/assets/icons/icons-icon_24rent.svg';
import rentalCarIcon from 'servicemap-ui-turku/assets/icons/icons-icon_rental_car.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchIotData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { isDataValid } from '../utils/utils';
import { isEmbed } from '../../../utils/path';
import RentalCarsContent from './components/RentalCarsContent';

const RentalCars = ({ classes }) => {
  const [rentalCarsData, setRentalCarsData] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(13);

  const { openMobilityPlatform, showRentalCars } = useMobilityPlatformContext();

  const url = new URL(window.location);
  const embeded = isEmbed({ url: url.toString() });

  const useContrast = useSelector(useAccessibleMap);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const mapEvent = useMapEvents({
    zoomend() {
      setZoomLevel(mapEvent.getZoom());
    },
  });

  const setBaseIcon = useContrast ? rentalCarIconBw : rentalCarIcon;

  const customIcon = icon({
    iconUrl: zoomLevel < 14 ? setBaseIcon : providerIcon,
    iconSize: zoomLevel < 14 ? [45, 45] : [50, 56],
  });

  useEffect(() => {
    if (openMobilityPlatform || embeded) {
      fetchIotData('R24', setRentalCarsData);
    }
  }, [openMobilityPlatform, setRentalCarsData]);

  const map = useMap();

  const setRender = () => {
    const paramValue = url.searchParams.get('rental_cars') === '1';
    if (embeded) {
      return isDataValid(paramValue, rentalCarsData);
    }
    return isDataValid(showRentalCars, rentalCarsData);
  };

  const renderData = setRender();

  useEffect(() => {
    if (renderData && !embeded) {
      const bounds = [];
      rentalCarsData.forEach((item) => {
        bounds.push([item.homeLocationData.coordinates.latitude, item.homeLocationData.coordinates.longitude]);
      });
      map.fitBounds(bounds);
    }
  }, [showRentalCars, rentalCarsData]);

  return (
    <>
      {renderData ? (
        rentalCarsData.filter(item => item.availabilityData.available).map(item => (
          <Marker
            key={item.id}
            icon={customIcon}
            position={[item.homeLocationData.coordinates.latitude, item.homeLocationData.coordinates.longitude]}
          >
            <div className={classes.popupWrapper}>
              <Popup className="rental-cars-popup">
                <div className={classes.popupInner}>
                  <RentalCarsContent
                    car={item}
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

RentalCars.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default RentalCars;
