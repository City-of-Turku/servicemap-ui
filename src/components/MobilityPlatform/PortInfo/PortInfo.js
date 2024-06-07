/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import { subDays, addDays, format } from 'date-fns';
import ferryIcon from 'servicemap-ui-turku/assets/icons/icons-icon_ferry.svg';
import ferryIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_ferry-bw.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchPortNetData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { createIcon, isDataValid } from '../utils/utils';
import { StyledPopupWrapper, StyledPopupInner } from '../styled/styled';
import PortInfoContent from './components/PortInfoContent';

const PortInfo = () => {
  const [portInfoData, setPortInfoData] = useState({});
  const [portVisitsDataObj, setPortVisitsDataObj] = useState({});

  const { showPortInfo } = useMobilityPlatformContext();

  const map = useMap();

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);
  const customIcon = icon(createIcon(useContrast ? ferryIconBw : ferryIcon));

  const yesterday = subDays(new Date(), 1);
  const tomorrow = addDays(new Date(), 1);
  const yesterdayStr = format(yesterday, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
  const tomorrowStr = format(tomorrow, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    if (showPortInfo) {
      fetchPortNetData('ports/FITKU', setPortInfoData, signal);
      fetchPortNetData(
        `port-calls?from=${yesterdayStr}&to=${tomorrowStr}&vesselTypeCode=20`,
        setPortVisitsDataObj,
        signal,
      );
    }
    return () => controller.abort();
  }, [showPortInfo]);

  const portName = 'Matkustajasatama';
  const portAreasData = portInfoData?.portAreas?.features;
  const portAreasDataTku = portAreasData?.filter(item => item?.properties?.portAreaName === portName);
  const portCallsData = portVisitsDataObj?.portCalls;
  const portCallsDataTku = portCallsData?.filter(item => item?.portAreaDetails[0]?.portAreaName === portName);

  const renderData = isDataValid(showPortInfo, portAreasDataTku);

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      portAreasDataTku.forEach(item => {
        bounds.push([item.geometry.coordinates[1], item.geometry.coordinates[0]]);
      });
      map.fitBounds(bounds);
    }
  }, [showPortInfo, portAreasDataTku]);

  return renderData
    ? portAreasDataTku.map(item => (
      <Marker
        key={item.portAreaCode}
        icon={customIcon}
        position={[item.geometry.coordinates[1], item.geometry.coordinates[0]]}
      >
        <StyledPopupWrapper>
          <Popup className="popup-w350">
            <StyledPopupInner>
              <PortInfoContent portItem={item} portCalls={portCallsDataTku} />
            </StyledPopupInner>
          </Popup>
        </StyledPopupWrapper>
      </Marker>
    ))
    : null;
};

export default PortInfo;
