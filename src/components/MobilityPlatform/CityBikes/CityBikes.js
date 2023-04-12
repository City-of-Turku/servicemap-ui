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
import { isDataValid, setRender, checkMapType } from '../utils/utils';
import { isEmbed } from '../../../utils/path';
import CityBikesContent from './components/CityBikesContent';

const CityBikes = () => {
  const [cityBikeStations, setCityBikeStations] = useState([]);
  const [cityBikeStatistics, setCityBikeStatistics] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(13);

  const { openMobilityPlatform, showCityBikes } = useMobilityPlatformContext();

  const url = new URL(window.location);
  const embeded = isEmbed({ url: url.toString() });

  const map = useMap();
  const useContrast = useSelector(useAccessibleMap);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const mapEvent = useMapEvents({
    zoomend() {
      setZoomLevel(mapEvent.getZoom());
    },
  });

  const setBaseIcon = checkMapType(embeded, useContrast, url) ? cityBikeIconBw : cityBikeIcon;
  const setFollariIcon = checkMapType(embeded, useContrast, url) ? follariIconBw : follariIcon;

  const customIcon = icon({
    iconUrl: zoomLevel < 14 ? setBaseIcon : setFollariIcon,
    iconSize: zoomLevel < 14 ? [45, 45] : [35, 35],
  });

  useEffect(() => {
    if (openMobilityPlatform || embeded) {
      fetchCityBikesData('CBI', setCityBikeStations);
    }
  }, [openMobilityPlatform, setCityBikeStations]);

  useEffect(() => {
    if (openMobilityPlatform || embeded) {
      fetchCityBikesData('CBS', setCityBikeStatistics);
    }
  }, [openMobilityPlatform, setCityBikeStatistics]);

  const paramValue = url.searchParams.get('city_bikes') === '1';
  const renderData = setRender(paramValue, embeded, showCityBikes, cityBikeStations, isDataValid);

  const fitBounds = () => {
    if (renderData) {
      const bounds = [];
      cityBikeStations.forEach((item) => {
        bounds.push([item.lat, item.lon]);
      });
      map.fitBounds(bounds);
    }
  };

  useEffect(() => {
    if (!embeded) {
      fitBounds();
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
