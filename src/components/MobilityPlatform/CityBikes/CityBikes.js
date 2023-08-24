/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMap, useMapEvents } from 'react-leaflet';
import cityBikeIcon from 'servicemap-ui-turku/assets/icons/icons-icon_city_bike.svg';
import cityBikeIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_city_bike-bw.svg';
import follariIcon from 'servicemap-ui-turku/assets/icons/icons-icon_follari.svg';
import follariIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_follari-bw.svg';
import cargoBikeIconMain from 'servicemap-ui-turku/assets/icons/icons-icon_cargo_bikes.svg';
import cargoBikeIconMainBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_cargo_bikes-bw.svg';
import cargoBikesIconProvider from 'servicemap-ui-turku/assets/icons/icons-icon_cargo_bikes_provider.svg';
import cargoBikesIconProviderBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_cargo_bikes_provider-bw.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchCityBikesData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { isDataValid, setRender, checkMapType } from '../utils/utils';
import { isEmbed } from '../../../utils/path';
import CityBikesContent from './components/CityBikesContent';

const CityBikes = () => {
  const [cityBikeStationsData, setCityBikeStationsData] = useState([]);
  const [cityBikeStatistics, setCityBikeStatistics] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(13);

  const { showCityBikes, showCargoBikes } = useMobilityPlatformContext();

  const url = new URL(window.location);
  const embedded = isEmbed({ url: url.toString() });

  const map = useMap();
  const useContrast = useSelector(useAccessibleMap);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const mapEvent = useMapEvents({
    zoomend() {
      setZoomLevel(mapEvent.getZoom());
    },
  });

  const setBaseIcon = checkMapType(embedded, useContrast, url) ? cityBikeIconBw : cityBikeIcon;
  const setFollariIcon = checkMapType(embedded, useContrast, url) ? follariIconBw : follariIcon;
  const setCargoBikesIcon = checkMapType(embedded, useContrast, url) ? cargoBikeIconMainBw : cargoBikeIconMain;
  const setCargoBikesProviderIcon = checkMapType(embedded, useContrast, url) ? cargoBikesIconProviderBw : cargoBikesIconProvider;

  const iconForCityBikes = icon({
    iconUrl: zoomLevel < 14 ? setBaseIcon : setFollariIcon,
    iconSize: zoomLevel < 14 ? [45, 45] : [35, 35],
  });

  const iconForCargoBikes = icon({
    iconUrl: zoomLevel < 14 ? setCargoBikesIcon : setCargoBikesProviderIcon,
    iconSize: zoomLevel < 14 ? [45, 45] : [60, 60],
  });

  useEffect(() => {
    if (showCityBikes || showCargoBikes || embedded) {
      fetchCityBikesData('CBI', setCityBikeStationsData);
    }
  }, [showCityBikes, showCargoBikes, embedded]);

  useEffect(() => {
    if (showCityBikes || showCargoBikes || embedded) {
      fetchCityBikesData('CBS', setCityBikeStatistics);
    }
  }, [showCityBikes, showCargoBikes, embedded]);

  const cityBikeStations = [];

  /** Separate cargo bike stations from city bike stations */
  const cargoBikeStations = cityBikeStationsData.reduce((acc, curr) => {
    if (curr.name.includes('eCargo bikes')) {
      acc.push(curr);
    } else {
      cityBikeStations.push(curr);
    }
    return acc;
  }, []);

  const paramCityBikes = url.searchParams.get('city_bikes') === '1';
  const paramCargoBikes = url.searchParams.get('cargo_bikes') === '1';
  const renderCityBikes = setRender(paramCityBikes, embedded, showCityBikes, cityBikeStations, isDataValid);
  const renderCargoBikes = setRender(paramCargoBikes, embedded, showCargoBikes, cargoBikeStations, isDataValid);

  const fitBounds = (renderData, data) => {
    if (renderData) {
      const bounds = [];
      data.forEach((item) => {
        bounds.push([item.lat, item.lon]);
      });
      map.fitBounds(bounds);
    }
  };

  useEffect(() => {
    if (!embedded) {
      fitBounds(renderCityBikes, cityBikeStations);
      fitBounds(renderCargoBikes, cargoBikeStations);
    }
  }, [showCityBikes, showCargoBikes]);

  const renderCityBikeMarkers = (isValid, data, icon) => (isValid ? (
    data.map(item => (
      <Marker
        key={item.station_id}
        icon={icon}
        position={[item.lat, item.lon]}
      >
        <Popup>
          <CityBikesContent bikeStation={item} cityBikeStatistics={cityBikeStatistics} />
        </Popup>
      </Marker>
    ))
  ) : null);

  return (
    <>
      {renderCityBikeMarkers(renderCityBikes, cityBikeStations, iconForCityBikes)}
      {renderCityBikeMarkers(renderCargoBikes, cargoBikeStations, iconForCargoBikes)}
    </>
  );
};

export default CityBikes;
