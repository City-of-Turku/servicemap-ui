import { useEffect, useMemo } from 'react';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { fetchMobilityMapData } from '../../../components/MobilityPlatform/mobilityPlatformRequests/mobilityPlatformRequests';

const useSpeedLimitZoneFetch = showData => {
  const { speedLimitZones, setSpeedLimitZones } = useMobilityPlatformContext();

  const sortZones = data => data.slice().sort((a, b) => a - b);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const options = {
      type_name: 'SpeedLimitZone',
      page_size: 1000,
      latlon: true,
    };
    if (showData) {
      fetchMobilityMapData(options, setSpeedLimitZones, signal);
    }
    return () => controller.abort();
  }, [showData, setSpeedLimitZones]);

  const speedLimitList = useMemo(
    () => [...new Set(speedLimitZones.map(item => item.extra.speed_limit))],
    [speedLimitZones],
  );

  const speedLimitListAsc = sortZones(speedLimitList);

  return { speedLimitListAsc };
};

export default useSpeedLimitZoneFetch;
