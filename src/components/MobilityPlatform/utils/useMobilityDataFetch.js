import { useState, useEffect } from 'react';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';

const useMobilityDataFetch = (options, showData, embedded) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    if (showData || embedded) {
      fetchMobilityMapData(options, setData, signal);
    }
    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showData, embedded]);

  return { data };
};

export default useMobilityDataFetch;
