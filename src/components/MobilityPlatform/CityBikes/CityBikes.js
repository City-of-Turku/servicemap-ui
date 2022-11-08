import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import cityBikeIcon from 'servicemap-ui-turku/assets/icons/icons-icon_city_bike.svg';
import follariIcon from 'servicemap-ui-turku/assets/icons/icons-icon_follari.svg';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { fetchCityBikesData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { isDataValid } from '../utils/utils';
import config from '../../../../config';
import CityBikesContent from './components/CityBikesContent';

const CityBikes = () => {
  const [cityBikeStations, setCityBikeStations] = useState([]);
  const [cityBikeStatistics, setCityBikeStatistics] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(13);

  const { openMobilityPlatform, showCityBikes } = useContext(MobilityPlatformContext);

  const currentDate = moment();
  const seasonEndDate = config.seasonEnd;
  const seasonStartDate = config.seasonStart;
  const isWinterSeason = currentDate.isAfter(seasonEndDate) && currentDate.isBefore(seasonStartDate);

  const map = useMap();

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const mapEvent = useMapEvents({
    zoomend() {
      setZoomLevel(mapEvent.getZoom());
    },
  });

  const customIcon = icon({
    iconUrl: zoomLevel < 14 ? cityBikeIcon : follariIcon,
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
    if (renderData && !isWinterSeason) {
      const bounds = [];
      cityBikeStations.forEach((item) => {
        bounds.push([item.lat, item.lon]);
      });
      map.fitBounds(bounds);
    }
  }, [showCityBikes, cityBikeStations]);

  return (
    <>
      {renderData && !isWinterSeason
        && cityBikeStations.map(item => (
          <Marker key={item.station_id} icon={customIcon} position={[item.lat, item.lon]}>
            <Popup>
              <CityBikesContent bikeStation={item} cityBikeStatistics={cityBikeStatistics} />
            </Popup>
          </Marker>
        ))}
    </>
  );
};

export default CityBikes;
