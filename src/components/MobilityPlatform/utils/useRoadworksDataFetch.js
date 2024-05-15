import { useState, useEffect } from 'react';
import { fetchRoadworksData } from '../mobilityPlatformRequests/mobilityPlatformRequests';

const useRoadworksDataFetch = (options, showData) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    if (showData) {
      fetchRoadworksData(options, setData, signal);
    }
    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showData]);

  return { data };
};

export default useRoadworksDataFetch;
