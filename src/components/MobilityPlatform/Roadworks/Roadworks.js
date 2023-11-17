/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import roadworksIcon from 'servicemap-ui-turku/assets/icons/icons-icon_roadworks.svg';
import roadworksIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_roadworks-bw.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { fetchParkingAreaGeometries } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import {
  createIcon, isDataValid, grayOptionsBase, whiteOptionsBase,
} from '../utils/utils';
import { useAccessibleMap, getCitySettings } from '../../../redux/selectors/settings';
import config from '../../../../config';
import RoadworksContent from './components/RoadworksContent';

const Roadworks = () => {
  const [roadworksData, setRoadworksData] = useState([]);

  const { showRoadworks } = useMobilityPlatformContext();

  const { icon } = global.L;
  const { Marker, Polyline, Popup } = global.rL;

  const map = useMap();

  const useContrast = useSelector(useAccessibleMap);
  const citySettings = useSelector(getCitySettings);

  const roadworksUrl = config.roadworksAPI;
  const isRoadworksUrl = !roadworksUrl || roadworksUrl === 'undefined' ? null : roadworksUrl;

  const customIcon = icon(createIcon(useContrast ? roadworksIconBw : roadworksIcon));

  const grayOptions = grayOptionsBase({ dashArray: '2, 5, 8' });
  const whiteOptions = whiteOptionsBase({ dashArray: !useContrast ? '1, 8' : null });

  useEffect(() => {
    const endpoint = `${isRoadworksUrl}?inactiveHours=0&includeAreaGeometry=true&situationType=ROAD_WORK`;
    if (showRoadworks && isRoadworksUrl) {
      fetchParkingAreaGeometries(endpoint, setRoadworksData);
    }
  }, [showRoadworks]);

  const checkCitySettings = (citiesArray) => {
    if (citiesArray?.length > 0) {
      return citiesArray;
    }
    return config.cities;
  };

  /** Separate roadworks of Turku from the rest */
  const roadworksFiltered = roadworksData.reduce((acc, curr) => {
    const roadWorkDetails = curr?.properties?.announcements[0];
    const selectedCities = config.cities.filter((c) => citySettings[c]);
    const cities = checkCitySettings(selectedCities);
    if (
      cities.includes(roadWorkDetails?.locationDetails?.roadAddressLocation?.primaryPoint?.municipality.toLowerCase())
    ) {
      acc.push(curr);
    }
    return acc;
  }, []);

  /** Separate roadworks that contain Point type geometry from the rest */
  const roadworksPoints = roadworksFiltered.reduce((acc, curr) => {
    if (curr.geometry.type === 'Point') {
      acc.push(curr);
    }
    return acc;
  }, []);

  /** Separate roadworks that contain LineString type geometry from the rest */
  const roadworksLines = roadworksFiltered.reduce((acc, curr) => {
    if (curr.geometry.type === 'LineString') {
      acc.push(curr);
    }
    return acc;
  }, []);

  /** Separate roadworks that contain MultiLineString type geometry from the rest */
  const roadworksMultiLines = roadworksFiltered.reduce((acc, curr) => {
    if (curr.geometry.type === 'MultiLineString') {
      acc.push(curr);
    }
    return acc;
  }, []);

  /**
   * Swap coordinates of linestrings
   * @param {array} inputData
   * @returns array
   */
  const swapCoords = (inputData) => {
    if (inputData?.length > 0) {
      return inputData.map((coordinates) => [coordinates[1], coordinates[0]]);
    }
    return inputData;
  };

  /**
   * Swap coordinates of multi linestring
   * @param {array} inputData
   * @returns array
   */
  const swapCoordsMulti = (inputData) => {
    if (inputData?.length > 0) {
      return inputData.map((innerArray) => innerArray.map((coordinates) => [coordinates[1], coordinates[0]]));
    }
    return inputData;
  };

  const areMarkersValid = isDataValid(showRoadworks, roadworksPoints);
  const areLinesValid = isDataValid(showRoadworks, roadworksLines);
  const areMultiLinesValid = isDataValid(showRoadworks, roadworksMultiLines);

  useEffect(() => {
    if (areMultiLinesValid) {
      const bounds = [];
      roadworksMultiLines.forEach((item) => {
        bounds.push(swapCoordsMulti(item.geometry.coordinates));
      });
      map.fitBounds(bounds);
    }
  }, [showRoadworks, roadworksMultiLines]);

  const renderContent = (item) => (
    <Popup className="popup-w350">
      <RoadworksContent item={item} />
    </Popup>
  );

  const getSingleCoordinates = (data) => {
    const coords = data[0][0];
    return [coords[1], coords[0]];
  };

  const renderMarkers = () => (areMarkersValid
    ? roadworksPoints.map((item) => (
      <Marker
        key={item.properties.situationId}
        icon={customIcon}
        position={[item?.geometry?.coordinates[1], item?.geometry?.coordinates[0]]}
      >
        {renderContent(item)}
      </Marker>
    ))
    : null);

  const renderLines = () => (areLinesValid ? roadworksLines.map((item) => (
    <Polyline
      key={item.properties.situationId}
      weight={useContrast ? 10 : 8}
      pathOptions={useContrast ? whiteOptions : grayOptions}
      positions={swapCoords(item.geometry.coordinates)}
    >
      {renderContent(item)}
    </Polyline>
  )) : null);

  const renderMultiLines = () => (areMultiLinesValid ? (
    roadworksMultiLines.map((item) => (
      <>
        <Polyline
          key={item.properties.situationId}
          weight={useContrast ? 10 : 8}
          pathOptions={useContrast ? whiteOptions : grayOptions}
          positions={swapCoordsMulti(item.geometry.coordinates)}
        />
        <Marker
          key={item.properties.releaseTime}
          icon={customIcon}
          position={getSingleCoordinates(item.geometry.coordinates)}
        >
          {renderContent(item)}
        </Marker>
      </>
    ))
  ) : null);

  return (
    <>
      {renderMarkers()}
      {renderLines()}
      {renderMultiLines()}
    </>
  );
};

export default Roadworks;
