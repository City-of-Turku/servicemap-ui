/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import roadworksIcon from 'servicemap-ui-turku/assets/icons/icons-icon_roadworks.svg';
import roadworksIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_roadworks-bw.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import {
  createIcon, isDataValid, grayOptionsBase, whiteOptionsBase,
} from '../utils/utils';
import { useAccessibleMap, getCitySettings } from '../../../redux/selectors/settings';
import config from '../../../../config';
import useRoadworksDataFetch from '../utils/useRoadworksDataFetch';
import { StyledPopupWrapper, StyledPopupInner } from '../styled/styled';
import RoadworksContent from './components/RoadworksContent';

const Roadworks = () => {
  const getOptions = typeStr => {
    const options = {
      page_size: 200,
      is_active: true,
      situation_type_str: typeStr,
    };
    return options;
  };

  const { showRoadworks } = useMobilityPlatformContext();

  const { icon } = global.L;
  const { Marker, Polyline, Popup } = global.rL;

  const map = useMap();

  const useContrast = useSelector(useAccessibleMap);
  const citySettings = useSelector(getCitySettings);

  const customIcon = icon(createIcon(useContrast ? roadworksIconBw : roadworksIcon));

  const grayOptions = grayOptionsBase({ dashArray: '2, 5, 8' });
  const whiteOptions = whiteOptionsBase({ dashArray: !useContrast ? '1, 8' : null });

  const { data: roadworksData } = useRoadworksDataFetch(getOptions('ROAD_WORK'), showRoadworks);
  const { data: trafficAnnouncementsData } = useRoadworksDataFetch(getOptions('TRAFFIC_ANNOUNCEMENT'), showRoadworks);
  const roadworksDataFull = [].concat(roadworksData, trafficAnnouncementsData);

  const checkCitySettings = citiesArray => {
    if (citiesArray?.length > 0) {
      return citiesArray;
    }
    return config.cities;
  };

  /** Separate roadworks of Turku from the rest */
  const roadworksFiltered = roadworksDataFull.reduce((acc, curr) => {
    const roadWorkDetails = curr?.announcements[0];
    const selectedCities = config.cities.filter(c => citySettings[c]);
    const cities = checkCitySettings(selectedCities);
    if (
      cities.includes(roadWorkDetails?.location?.details?.primaryPoint?.municipality.toLowerCase())
    ) {
      acc.push(curr);
    }
    return acc;
  }, []);

  /**
   * Separate roadworks from the rest by geometry type (eg. POINT or LINESTRING)
   * @param {array} data
   * @param {string} geomType
   * @returns array
   */
  const filterRoadworksByGeometry = (data, geomType) => data.reduce((acc, curr) => {
    if (curr?.announcements[0]?.location?.geometry?.includes(geomType)) {
      acc.push(curr);
    }
    return acc;
  }, []);

  const roadworksPoints = filterRoadworksByGeometry(roadworksFiltered, 'POINT');
  const roadworksLines = filterRoadworksByGeometry(roadworksFiltered, ';LINESTRING');
  const roadworksMultiLines = filterRoadworksByGeometry(roadworksFiltered, 'MULTILINESTRING');

  /**
   * Gets coordinates from string, for example 'SRID=4326;POINT (22.37835 60.40831)'.
   * Use regex to get numerical values and place those inside an array
   * @param {string} inputString
   * @returns {*array} coordinates
   */
  const getPointCoordinates = inputString => {
    const regex = /POINT \((\d+\.\d+) (\d+\.\d+)\)/;
    const match = inputString.match(regex);
    if (match) {
      const coordinates = [parseFloat(match[2]), parseFloat(match[1])];
      return coordinates;
    }
    return [];
  };

  /**
   * Get coordinates from string that includes geometry in multilinestring format.
   * Remove letters and special characters and return nested array from numbers.
   * @param {string} lineString
   * @returns array
   */
  const getLineCoordinates = lineString => {
    const coordinatesString = lineString.replace(/^SRID=\d+;LINESTRING \((.*)\)$/, '$1');
    const coordinatePairs = coordinatesString.split(', ').map(pair => pair.split(' '));
    const coordinates = coordinatePairs.map(pair => [parseFloat(pair[1]), parseFloat(pair[0])]);
    return coordinates;
  };

  /**
   * Get coordinates from string that includes geometry in multilinestring format.
   * Remove letters and special characters and return nested array from numbers.
   * @param {string} inputString
   * @returns array
   */
  const getMultiLineCoordinates = inputString => {
    const multiLineStrings = inputString.replace(/^SRID=\d+;MULTILINESTRING \((.*)\)$/, '$1').split('), ');
    const nestedCoordinates = multiLineStrings.map(lineString => {
      const cleanedLineString = lineString.replace(/^\(/, '').replace(/\)$/, '');
      const coordinatePairs = cleanedLineString.split(', ').map(pair => pair.split(' '));
      return coordinatePairs.map(pair => [parseFloat(pair[1]), parseFloat(pair[0])]);
    });
    return nestedCoordinates;
  };

  /**
   * Get single pair of coordinates from nested arrays (2 or 3 levels).
   * @param {array} data
   * @param {boolean} isMulti
   * @returns array
   */
  const getSingleCoordinates = (data, isMulti) => {
    const coords = isMulti ? data[0][0] : data[0];
    return [coords[0], coords[1]];
  };

  const parseMultiAndGetSingleCoordinates = multilineStr => {
    const coordinates = getMultiLineCoordinates(multilineStr);
    return getSingleCoordinates(coordinates, true);
  };

  const parseLineAndGetSingleCoordinates = lineStr => {
    const coordinates = getLineCoordinates(lineStr);
    return getSingleCoordinates(coordinates, false);
  };

  const areMarkersValid = isDataValid(showRoadworks, roadworksPoints);
  const areLinesValid = isDataValid(showRoadworks, roadworksLines);
  const areMultiLinesValid = isDataValid(showRoadworks, roadworksMultiLines);

  useEffect(() => {
    if (areMultiLinesValid) {
      const bounds = [];
      roadworksMultiLines.forEach(item => {
        bounds.push(getMultiLineCoordinates(item?.announcements[0]?.location?.geometry));
      });
      map.fitBounds(bounds);
    }
  }, [showRoadworks, roadworksMultiLines]);

  const renderContent = item => (
    <StyledPopupWrapper>
      <Popup className="popup-w350">
        <StyledPopupInner>
          <RoadworksContent item={item} />
        </StyledPopupInner>
      </Popup>
    </StyledPopupWrapper>
  );

  const renderMarkers = () => (areMarkersValid
    ? roadworksPoints.map(item => (
      <Marker
        key={item.situation_id}
        icon={customIcon}
        position={getPointCoordinates(item?.announcements[0]?.location?.geometry)}
      >
        {renderContent(item)}
      </Marker>
    ))
    : null);

  const renderLines = () => (areLinesValid ? (
    roadworksLines.map(item => (
      <React.Fragment key={item.id}>
        <Polyline
          weight={useContrast ? 10 : 8}
          pathOptions={useContrast ? whiteOptions : grayOptions}
          positions={getLineCoordinates(item?.announcements[0]?.location?.geometry)}
        />
        <Marker
          icon={customIcon}
          position={parseLineAndGetSingleCoordinates(item?.announcements[0]?.location?.geometry)}
        >
          {renderContent(item)}
        </Marker>
      </React.Fragment>
    ))
  ) : null);

  const renderMultiLines = () => (areMultiLinesValid ? (
    roadworksMultiLines.map(item => (
      <React.Fragment key={item.id}>
        <Polyline
          weight={useContrast ? 10 : 8}
          pathOptions={useContrast ? whiteOptions : grayOptions}
          positions={getMultiLineCoordinates(item?.announcements[0]?.location?.geometry)}
        />
        <Marker
          icon={customIcon}
          position={parseMultiAndGetSingleCoordinates(item?.announcements[0]?.location?.geometry)}
        >
          {renderContent(item)}
        </Marker>
      </React.Fragment>
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
