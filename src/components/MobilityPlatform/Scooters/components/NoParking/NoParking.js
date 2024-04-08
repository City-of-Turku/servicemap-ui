/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { useMobilityPlatformContext } from '../../../../../context/MobilityPlatformContext';
import useMobilityDataFetch from '../../../utils/useMobilityDataFetch';
import { isDataValid, whiteOptionsBase, redOptionsBase } from '../../../utils/utils';
import { useAccessibleMap } from '../../../../../redux/selectors/settings';
import PolygonComponent from '../../../PolygonComponent';
import TextContent from '../../../TextContent';

/**
 * Displays no parking zones of scooters on the map in polygon format.
 */
const NoParking = () => {
  const options = {
    type_name: 'ScooterNoParkingArea',
    latlon: true,
  };

  const { showScooterNoParking } = useMobilityPlatformContext();
  const useContrast = useSelector(useAccessibleMap);

  const redOptions = redOptionsBase({ weight: 5 });
  const whiteOptions = whiteOptionsBase({
    fillOpacity: 0.3,
    weight: 5,
    dashArray: '11 2 11',
  });
  const pathOptions = useContrast ? whiteOptions : redOptions;
  const map = useMap();

  const { data } = useMobilityDataFetch(options, showScooterNoParking);

  /**
   * Filter point data from polygons. Polygons are an array and points are an object.
   */
  const noParkingFiltered = data.reduce((acc, curr) => {
    if (Array.isArray(curr.geometry_coords)) {
      acc.push(curr);
    }
    return acc;
  }, []);

  const renderData = isDataValid(showScooterNoParking, noParkingFiltered);

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      noParkingFiltered.forEach(item => {
        bounds.push(item.geometry_coords);
      });
      map.fitBounds(bounds);
    }
  }, [showScooterNoParking, data, map]);

  return (
    renderData
      ? noParkingFiltered.map(item => (
        <PolygonComponent
          key={item.id}
          item={item}
          useContrast={useContrast}
          pathOptions={pathOptions}
        >
          <TextContent
            titleId="mobilityPlatform.content.scooters.noParkingAreas.title"
            translationId="mobilityPlatform.info.scooters.noParking"
          />
        </PolygonComponent>
      ))
      : null
  );
};

export default NoParking;
