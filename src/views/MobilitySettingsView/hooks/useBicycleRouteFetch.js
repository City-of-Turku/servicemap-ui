import { useState, useEffect } from 'react';
import { fetchBicycleRouteNames } from '../../../components/MobilityPlatform/mobilityPlatformRequests/mobilityPlatformRequests';

const useBicycleRouteFetch = (showData, locale) => {
  const [bicycleRoutesData, setBicycleRoutesData] = useState([]);

  const nameKeys = {
    fi: 'name_fi',
    en: 'name_en',
    sv: 'name_sv',
  };

  const sortRoutes = data => data.slice().sort((a, b) => a[nameKeys[locale]]?.localeCompare(b[nameKeys[locale]], undefined, {
    numeric: true,
    sensivity: 'base',
  }));

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    if (showData) {
      fetchBicycleRouteNames(setBicycleRoutesData, signal);
    }
    return () => controller.abort();
  }, [showData]);

  const sortedBicycleRoutes = sortRoutes(bicycleRoutesData);

  return { sortedBicycleRoutes };
};

export default useBicycleRouteFetch;
