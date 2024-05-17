import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import moose from 'servicemap-ui-turku/assets/icons/icons-icon_moose.svg';
import fox from 'servicemap-ui-turku/assets/icons/icons-icon_fox.svg';
import deer from 'servicemap-ui-turku/assets/icons/icons-icon_deer.svg';
import rabbit from 'servicemap-ui-turku/assets/icons/icons-icon_rabbit.svg';
import marten from 'servicemap-ui-turku/assets/icons/icons-icon_marten.svg';
import capercaillie from 'servicemap-ui-turku/assets/icons/icons-icon_capercaillie.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { isDataValid, createIcon } from '../utils/utils';
import { fetchPostCodeAreas, fetchMobilityProfilesData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { StyledPopupWrapper, StyledPopupInner } from '../styled/styled';
import MobilityProfilesContent from './components/MobilityProfilesContent';

const MobilityProfiles = () => {
  const [postCodeAreas, setPostCodeAreas] = useState([]);
  const [mobilityProfilesData, setMobilityProfilesData] = useState([]);

  const { showMobilityResults } = useMobilityPlatformContext();

  const { Marker, Polygon, Popup } = global.rL;
  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    if (showMobilityResults) {
      fetchPostCodeAreas(setPostCodeAreas, signal);
      fetchMobilityProfilesData(setMobilityProfilesData, signal);
    }
    return () => controller.abort();
  }, [showMobilityResults]);

  const swapCoords = inputData => {
    if (inputData?.length) {
      return inputData.map(item => item.map(v => v.map(j => [j[1], j[0]])));
    }
    return inputData;
  };

  const blueColor = {
    color: 'rgba(7, 44, 115, 255)',
    fillOpacity: 0.2,
  };
  const whiteColor = {
    color: 'rgba(255, 255, 255, 255)',
    fillOpacity: 0.6,
    dashArray: '10 2 10',
  };

  const pathOptions = useContrast ? whiteColor : blueColor;
  const renderData = isDataValid(showMobilityResults, postCodeAreas);
  const areResultsValid = isDataValid(showMobilityResults, mobilityProfilesData);
  const renderMarkers = renderData && areResultsValid;

  const getIconByResult = resultValue => {
    const isObject = typeof resultValue;
    const result = isObject ? resultValue.result : 1;
    switch (result) {
      case 1:
        return icon(createIcon(moose));
      case 2:
        return icon(createIcon(fox));
      case 3:
        return icon(createIcon(rabbit));
      case 4:
        return icon(createIcon(marten));
      case 5:
        return icon(createIcon(deer));
      case 6:
        return icon(createIcon(capercaillie));
      default:
        return icon(createIcon(moose));
    }
  };

  const getCorrectIcon = (nameValue, mobilityProfiles) => {
    const filteredMobilityProfiles = mobilityProfiles?.filter(item => item.postal_code_string === nameValue);
    const maxCount = filteredMobilityProfiles?.reduce(
      (prev, current) => (prev.count > current.count ? prev : current),
      1,
    );
    return getIconByResult(maxCount);
  };

  const getSingleCoordinates = data => data[0][0][0];

  const swapAndGetCoordinates = coordinatesData => {
    const swapped = swapCoords(coordinatesData);
    const coords = getSingleCoordinates(swapped);
    return coords;
  };

  const renderMarkersData = (showData, data) => (showData
    ? data.map(item => (
      <Marker
        key={item.id}
        icon={getCorrectIcon(item.name.fi, mobilityProfilesData)}
        position={swapAndGetCoordinates(item.boundary.coordinates)}
      >
        <StyledPopupWrapper>
          <Popup>
            <StyledPopupInner>
              <MobilityProfilesContent postcodeArea={item} mobilityProfiles={mobilityProfilesData} />
            </StyledPopupInner>
          </Popup>
        </StyledPopupWrapper>
      </Marker>
    ))
    : null);

  const renderPostCodeAreas = (showData, data) => (showData
    ? data.map(item => (
      <Polygon key={item.id} pathOptions={pathOptions} positions={swapCoords(item.boundary.coordinates)}>
        <StyledPopupWrapper>
          <Popup>
            <StyledPopupInner>
              <MobilityProfilesContent postcodeArea={item} mobilityProfiles={mobilityProfilesData} />
            </StyledPopupInner>
          </Popup>
        </StyledPopupWrapper>
      </Polygon>
    ))
    : null
  );

  return (
    <>
      {renderMarkersData(renderMarkers, postCodeAreas)}
      {renderPostCodeAreas(renderData, postCodeAreas)}
    </>
  );
};

export default MobilityProfiles;
