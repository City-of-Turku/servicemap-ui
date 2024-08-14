import { useState, useEffect } from 'react';
import { fetchScootersData } from '../mobilityPlatformRequests/mobilityPlatformRequests';

const useScootersDataFetch = showData => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    if (showData) {
      fetchScootersData(setData, signal);
    }
    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showData]);

  return { data };
};

export default useScootersDataFetch;
