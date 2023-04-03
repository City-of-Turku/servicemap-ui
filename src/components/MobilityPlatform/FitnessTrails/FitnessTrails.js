import React from 'react';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import Trails from '../TrailsComponent';

/* Show selected fitness trail on the map */

const FitnessTrails = () => {
  const { showFitnessTrails, fitnessTrailsObj } = useMobilityPlatformContext();

  const tealColor = 'rgba(102, 102, 153, 255)';
  const dashPattern = '10 2 7';

  return <Trails showTrail={showFitnessTrails} trailsObj={fitnessTrailsObj} color={tealColor} pattern={dashPattern} />;
};

export default FitnessTrails;
