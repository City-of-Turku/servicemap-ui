import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import parkingMachineIcon from 'servicemap-ui-turku/assets/icons/icons-icon_parking_machine.svg';
import parkingMachineIconContrast from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_parking_machine-bw.svg';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { createIcon, isDataValid } from '../utils/utils';
import MarkerComponent from '../MarkerComponent';

/** Shows crosswalks on the map in marker form */

const CrossWalks = () => {
  const [crossWalksData, setCrossWalksData] = useState([]);

  // TODO optimize performance
  const { openMobilityPlatform, showCrossWalks } = useContext(MobilityPlatformContext);

  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);

  // TODO use different icons
  const customIcon = icon(createIcon(useContrast ? parkingMachineIconContrast : parkingMachineIcon));

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapData('CrossWalkSign', 5000, setCrossWalksData);
    }
  }, [openMobilityPlatform, setCrossWalksData]);

  const renderData = isDataValid(showCrossWalks, crossWalksData);

  return (
    <>
      {renderData ? (
        crossWalksData.map(item => (
          <MarkerComponent
            key={item.id}
            item={item}
            icon={customIcon}
          >
            <p>temp</p>
          </MarkerComponent>
        ))
      ) : null}
    </>
  );
};

export default CrossWalks;
