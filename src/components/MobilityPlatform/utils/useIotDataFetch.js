import { useState, useEffect } from 'react';
import { fetchIotData } from '../mobilityPlatformRequests/mobilityPlatformRequests';

const useIotDataFetch = (source, showData, embedded) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    if (showData || embedded) {
      fetchIotData(source, setData, signal);
    }
    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showData, embedded]);

  const setDataBySource = () => {
    if (source === 'SDR' || source === 'SDV') {
      return data?.data?.bikes;
    }
    if (source === 'CBI' || source === 'CBS') {
      return data?.data?.stations;
    }
    if (source === 'FAA') {
      return data?.flights?.arr?.body?.flight;
    }
    if (source === 'FAD') {
      return data?.flights?.dep?.body?.flight;
    }
    return data;
  };

  const iotData = setDataBySource();

  return { iotData };
};

export default useIotDataFetch;
