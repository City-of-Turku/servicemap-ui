import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { isDataValid } from '../utils/utils';
import { fetchPostCodeAreas, fetchMobilityProfilesData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { StyledPopupWrapper, StyledPopupInner } from '../styled/styled';
import MobilityProfilesContent from './components/MobilityProfilesContent';

// TODO Fetch data about mobility profiles and show relevant info.

const MobilityProfiles = () => {
  const [postCodeAreas, setPostCodeAreas] = useState([]);
  const [mobilityProfilesData, setMobilityProfilesData] = useState([]);

  const { showMobilityResults } = useMobilityPlatformContext();

  const { Polygon, Popup } = global.rL;

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

  return (
    renderData
      ? postCodeAreas.map(item => (
        <Polygon
          key={item.id}
          pathOptions={pathOptions}
          positions={swapCoords(item.boundary.coordinates)}
        >
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
};

export default MobilityProfiles;
