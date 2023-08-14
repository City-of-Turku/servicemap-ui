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
  const [cityBikeStationsData, setCityBikeStationsData] = useState([]);
  const [cityBikeStatistics, setCityBikeStatistics] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(13);

  const { openMobilityPlatform, showCityBikes, showCargoBikes } = useMobilityPlatformContext();

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

  // TODO add icon for cargo bikes
  const setBaseIcon = checkMapType(embedded, useContrast, url) ? cityBikeIconBw : cityBikeIcon;
  const setFollariIcon = checkMapType(embedded, useContrast, url) ? follariIconBw : follariIcon;

  const customIcon = icon({
    iconUrl: zoomLevel < 14 ? setBaseIcon : setFollariIcon,
    iconSize: zoomLevel < 14 ? [45, 45] : [35, 35],
  });

  useEffect(() => {
    if (openMobilityPlatform || embedded) {
      fetchCityBikesData('CBI', setCityBikeStationsData);
    }
  }, [openMobilityPlatform, setCityBikeStationsData]);

  useEffect(() => {
    if (openMobilityPlatform || embedded) {
      fetchCityBikesData('CBS', setCityBikeStatistics);
    }
  }, [openMobilityPlatform, setCityBikeStatistics]);

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

  // TODO add param value for cargo bikes
  const paramValue = url.searchParams.get('city_bikes') === '1';
  const renderCityBikes = setRender(paramValue, embedded, showCityBikes, cityBikeStations, isDataValid);
  const renderCargoBikes = setRender(paramValue, embedded, showCargoBikes, cargoBikeStations, isDataValid);

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

  const renderCityBikeMarkers = (isValid, data) => (isValid ? (
    data.map(item => (
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
  ) : null);

  return (
    <>
      {renderCityBikeMarkers(renderCityBikes, cityBikeStations)}
      {renderCityBikeMarkers(renderCargoBikes, cargoBikeStations)}
    </>
  );
};

export default CityBikes;
