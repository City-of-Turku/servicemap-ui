import { useEffect } from 'react';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { fetchMobilityMapData } from '../../../components/MobilityPlatform/mobilityPlatformRequests/mobilityPlatformRequests';

const useParkingChargeZoneFetch = showData => {
  const { parkingChargeZones, setParkingChargeZones } = useMobilityPlatformContext();

  const sortZones = data => data.slice().sort((a, b) => a.extra.maksuvyohyke - b.extra.maksuvyohyke);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const options = {
      type_name: 'PaymentZone',
      page_size: 10,
      latlon: true,
    };
    if (showData) {
      fetchMobilityMapData(options, setParkingChargeZones, signal);
    }
    return () => controller.abort();
  }, [showData, setParkingChargeZones]);

  const parkingChargeZonesSorted = sortZones(parkingChargeZones);

  return { parkingChargeZonesSorted };
};

export default useParkingChargeZoneFetch;
