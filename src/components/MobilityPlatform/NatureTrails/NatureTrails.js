import React, { useContext } from 'react';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import Trails from '../TrailsComponent';

/* Show marked trails which are part of Paavo trails on the map */

const NatureTrails = () => {
  const { showNatureTrails, natureTrailsObj } = useContext(MobilityPlatformContext);

  const brownColor = 'rgba(117, 44, 23, 255)';

  return <Trails showTrail={showNatureTrails} trailsObj={natureTrailsObj} color={brownColor} />;
};

export default NatureTrails;
