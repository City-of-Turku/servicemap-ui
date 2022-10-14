import React, { useEffect, useState, useContext } from 'react';
import { PropTypes } from 'prop-types';
import { useMapEvents, useMap } from 'react-leaflet';
import rentalCarIcon from 'servicemap-ui-turku/assets/icons/icons-icon_rental_car.svg';
import providerIcon from 'servicemap-ui-turku/assets/icons/icons-icon_24rent.svg';
import RentalCarsContent from './components/RentalCarsContent';
import { fetchIotData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';

const RentalCars = ({ classes }) => {
  const [rentalCarsData, setRentalCarsData] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(13);

  const { openMobilityPlatform, mobilityMap } = useContext(MobilityPlatformContext);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const mapEvent = useMapEvents({
    zoomend() {
      setZoomLevel(mapEvent.getZoom());
    },
  });

  const customIcon = icon({
    iconUrl: zoomLevel < 14 ? rentalCarIcon : providerIcon,
    iconSize: zoomLevel < 14 ? [45, 45] : [50, 56],
  });

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchIotData('R24', setRentalCarsData);
    }
  }, [openMobilityPlatform, setRentalCarsData]);

  const map = useMap();

  useEffect(() => {
    if (mobilityMap.rentalCars && rentalCarsData && rentalCarsData.length > 0) {
      const bounds = [];
      rentalCarsData.forEach((item) => {
        bounds.push([item.homeLocationData.coordinates.latitude, item.homeLocationData.coordinates.longitude]);
      });
      map.fitBounds(bounds);
    }
  }, [mobilityMap.rentalCars]);

  return (
    <>
      {mobilityMap.rentalCars ? (
        <>
          {rentalCarsData && rentalCarsData.length > 0
            && rentalCarsData.filter(item => item.availabilityData.available).map(item => (
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
            ))}
        </>
      ) : null}
    </>
  );
};

RentalCars.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default RentalCars;
