import React, { useContext } from 'react';
import { MobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import Trails from '../TrailsComponent';

/* Show marked trails which are part of Paavo trails on the map */

const NatureTrails = () => {
  const { showNatureTrails, natureTrailsObj } = useContext(MobilityPlatformContext);

  const blueColor = 'rgba(0, 0, 153, 255)';
  const dashPattern = '12 9';

  return <Trails showTrail={showNatureTrails} trailsObj={natureTrailsObj} color={blueColor} pattern={dashPattern} />;
};

export default NatureTrails;
