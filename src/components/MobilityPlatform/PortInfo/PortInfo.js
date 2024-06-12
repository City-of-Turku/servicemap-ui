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
import { createIcon, isDataValid, optionsToParams } from '../utils/utils';
import { StyledPopupWrapper, StyledPopupInner } from '../styled/styled';
import PortInfoContent from './components/PortInfoContent';

const PortInfo = () => {
  const [portsDataTku, setPortsDataTku] = useState([]);
  const [portsDataNli, setPortsDataNli] = useState([]);
  const [portCallsData, setPortCallsData] = useState([]);

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

  const options = {
    from: yesterdayStr,
    to: tomorrowStr,
    vesselTypeCode: 20,
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const params = optionsToParams(options);
    if (showPortInfo) {
      fetchPortNetData('ports/FITKU', setPortsDataTku, false, signal);
      fetchPortNetData('ports/FINLI', setPortsDataNli, false, signal);
      fetchPortNetData(`port-calls?${params}`, setPortCallsData, true, signal);
    }
    return () => controller.abort();
  }, [showPortInfo]);

  const portNames = ['Matkustajasatama', 'Kantasatama'];
  const portAreasData = [].concat(portsDataTku, portsDataNli);
  const portAreasFiltered = portAreasData?.filter(item => portNames.includes(item?.properties?.portAreaName));
  const filterByPortName = (data, portName) => data?.filter(item => item?.portAreaDetails[0]?.portAreaName === portName);

  const renderData = isDataValid(showPortInfo, portAreasFiltered);

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      portAreasFiltered.forEach(item => {
        bounds.push([item?.geometry?.coordinates[1], item?.geometry?.coordinates[0]]);
      });
      map.fitBounds(bounds);
    }
  }, [showPortInfo, portAreasFiltered]);

  return renderData
    ? portAreasFiltered.map(item => (
      <Marker
        key={item.portAreaCode}
        icon={customIcon}
        position={[item?.geometry?.coordinates[1], item?.geometry?.coordinates[0]]}
      >
        <StyledPopupWrapper>
          <Popup className="popup-w350">
            <StyledPopupInner>
              <PortInfoContent
                portItem={item}
                portCalls={filterByPortName(portCallsData, item?.properties?.portAreaName)}
              />
            </StyledPopupInner>
          </Popup>
        </StyledPopupWrapper>
      </Marker>
    ))
    : null;
};

export default PortInfo;
