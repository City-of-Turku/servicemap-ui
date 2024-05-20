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

  /** Separate roadworks that contain Point type geometry from the rest */
  const roadworksPoints = roadworksFiltered.reduce((acc, curr) => {
    if (curr?.announcements[0]?.location?.geometry?.includes('POINT')) {
      acc.push(curr);
    }
    return acc;
  }, []);

  /** Separate roadworks that contain MultiLineString type geometry from the rest */
  const roadworksMultiLines = roadworksFiltered.reduce((acc, curr) => {
    if (curr?.announcements[0]?.location?.geometry?.includes('MULTILINESTRING')) {
      acc.push(curr);
    }
    return acc;
  }, []);

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

  const getSingleCoordinates = data => {
    const coords = data[0][0];
    return [coords[0], coords[1]];
  };

  const parseAndGetSingleCoordinates = multilineStr => {
    const coordinates = getMultiLineCoordinates(multilineStr);
    return getSingleCoordinates(coordinates);
  };

  const areMarkersValid = isDataValid(showRoadworks, roadworksPoints);
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
          position={parseAndGetSingleCoordinates(item?.announcements[0]?.location?.geometry)}
        >
          {renderContent(item)}
        </Marker>
      </React.Fragment>
    ))
  ) : null);

  return (
    <>
      {renderMarkers()}
      {renderMultiLines()}
    </>
  );
};

export default Roadworks;
