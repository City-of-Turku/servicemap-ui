/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import railwayIcon from 'servicemap-ui-turku/assets/icons/icons-icon_railway_station.svg';
import railwayIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_railway_station-bw.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { createIcon, isDataValid } from '../utils/utils';

const TaxiStands = () => {
  const [taxiStands, setTaxiStands] = useState([]);

  const { showTaxiStands } = useMobilityPlatformContext();
  const map = useMap();
  const { Marker } = global.rL;
  const { icon } = global.L;
  const useContrast = useSelector(useAccessibleMap);
  // TODO: change icons
  const customIcon = icon(createIcon(useContrast ? railwayIconBw : railwayIcon));

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    if (showTaxiStands && !taxiStands.length) {
      const options = {
        type_name: 'TaxiStandSign',
        page_size: 1000,
      };
      fetchMobilityMapData(options, setTaxiStands, signal);
    }
    return () => controller.abort();
  }, [showTaxiStands]);

  const renderData = isDataValid(showTaxiStands, taxiStands);

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      taxiStands.forEach(item => {
        bounds.push([item.geometry_coords.lat, item.geometry_coords.lon]);
      });
      map.fitBounds(bounds);
    }
  }, [showTaxiStands, taxiStands]);

  return renderData
    ? taxiStands.map(item => (
      <Marker key={item.id} icon={customIcon} position={[item.geometry_coords.lat, item.geometry_coords.lon]} />
    ))
    : null;
};

export default TaxiStands;
