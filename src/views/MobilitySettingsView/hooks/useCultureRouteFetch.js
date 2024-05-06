import { useState, useEffect } from 'react';
import { fetchCultureRouteNames } from '../../../components/MobilityPlatform/mobilityPlatformRequests/mobilityPlatformRequests';

const useCultureRouteFetch = (showData, locale) => {
  const [cultureRoutesData, setCultureRoutesData] = useState([]);

  const nameKeys = {
    fi: 'name_fi',
    en: 'name_en',
    sv: 'name_sv',
  };

  const sortRoutes = data => data.slice().sort((a, b) => a[nameKeys[locale]]?.localeCompare(b[nameKeys[locale]]));

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    if (showData) {
      fetchCultureRouteNames(setCultureRoutesData, signal);
    }
    return () => controller.abort();
  }, [showData]);

  const sortedCultureRoutes = sortRoutes(cultureRoutesData);
  const localizedCultureRoutes = cultureRoutesData?.filter(item => item[nameKeys[locale]]);
  const sortedLocalizedCultureRoutes = sortRoutes(localizedCultureRoutes);

  return { sortedCultureRoutes, sortedLocalizedCultureRoutes };
};

export default useCultureRouteFetch;
