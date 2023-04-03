/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMap, useMapEvents } from 'react-leaflet';
import cityBikeIcon from 'servicemap-ui-turku/assets/icons/icons-icon_city_bike.svg';
import cityBikeIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_city_bike-bw.svg';
import follariIcon from 'servicemap-ui-turku/assets/icons/icons-icon_follari.svg';
import follariIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_follari-bw.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchCityBikesData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { isDataValid } from '../utils/utils';
import CityBikesContent from './components/CityBikesContent';

const CityBikes = () => {
  const [cityBikeStations, setCityBikeStations] = useState([]);
  const [cityBikeStatistics, setCityBikeStatistics] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(13);

  const { openMobilityPlatform, showCityBikes } = useMobilityPlatformContext();

  const useContrast = useSelector(useAccessibleMap);

  const map = useMap();

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const mapEvent = useMapEvents({
    zoomend() {
      setZoomLevel(mapEvent.getZoom());
    },
  });

  const setBaseIcon = useContrast ? cityBikeIconBw : cityBikeIcon;
  const setFollariIcon = useContrast ? follariIconBw : follariIcon;

  const customIcon = icon({
    iconUrl: zoomLevel < 14 ? setBaseIcon : setFollariIcon,
    iconSize: zoomLevel < 14 ? [45, 45] : [35, 35],
  });

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchCityBikesData('CBI', setCityBikeStations);
    }
  }, [openMobilityPlatform, setCityBikeStations]);

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchCityBikesData('CBS', setCityBikeStatistics);
    }
  }, [openMobilityPlatform, setCityBikeStatistics]);

  const renderData = isDataValid(showCityBikes, cityBikeStations);

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      cityBikeStations.forEach((item) => {
        bounds.push([item.lat, item.lon]);
      });
      map.fitBounds(bounds);
    }
  }, [showCityBikes, cityBikeStations]);

  return (
    <>
      {renderData ? (
        cityBikeStations.map(item => (
          <Marker
            key={item.station_id}
            icon={customIcon}
            position={[item.lat, item.lon]}
          >
            <Popup>
              <CityBikesContent bikeStation={item} cityBikeStatistics={cityBikeStatistics} />
            </Popup>
          </Marker>
        ))
      ) : null}
    </>
  );
};

export default CityBikes;
