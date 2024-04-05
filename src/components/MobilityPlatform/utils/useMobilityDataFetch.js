import { useState, useEffect } from 'react';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';

const useMobilityDataFetch = (options, showData, embedded) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (showData || embedded) {
      fetchMobilityMapData(options, setData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showData, embedded]);

  return { data };
};

export default useMobilityDataFetch;
