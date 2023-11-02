/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import bikeServiceIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_bike_service_station-bw.svg';
import bikeServiceIcon from 'servicemap-ui-turku/assets/icons/icons-icon_bike_service_station.svg';
import { Typography } from '@mui/material';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { createIcon, isDataValid, fitToMapBounds } from '../utils/utils';
import MarkerComponent from '../MarkerComponent';

const BarbecuePlaces = () => {
  const [barbecuePlaces, setBarbecuePlaces] = useState([]);

  const { showBarbecuePlaces } = useMobilityPlatformContext();

  const map = useMap();

  const useContrast = useSelector(useAccessibleMap);

  const { icon } = global.L;

  // TODO change icon
  const customIcon = icon(createIcon(useContrast ? bikeServiceIconBw : bikeServiceIcon));

  useEffect(() => {
    const options = {
      type_name: 'BarbecuePlace',
    };
    if (showBarbecuePlaces) {
      fetchMobilityMapData(options, setBarbecuePlaces);
    }
  }, [showBarbecuePlaces]);

  const renderData = isDataValid(showBarbecuePlaces, barbecuePlaces);

  useEffect(() => {
    fitToMapBounds(renderData, barbecuePlaces, map);
  }, [showBarbecuePlaces, barbecuePlaces]);

  return (renderData
    ? barbecuePlaces.map((item) => (
      <MarkerComponent key={item.id} item={item} icon={customIcon}>
        <div>
          <Typography variant="subtitle2">Grillipaikka</Typography>
        </div>
      </MarkerComponent>
    ))
    : null
  );
};

export default BarbecuePlaces;
