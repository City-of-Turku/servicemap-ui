import { useState, useEffect } from 'react';
import { fetchAreaGeometries, fetchParkingAreaStats } from '../mobilityPlatformRequests/mobilityPlatformRequests';

const useParkingDataFetch = (areaUrl, statsUrl, showData) => {
  const [areasData, setAreasData] = useState({});
  const [statisticsData, setStatisticsData] = useState([]);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    if (showData && areaUrl && statsUrl) {
      fetchAreaGeometries(areaUrl, setAreasData, setFetchError, signal);
      fetchParkingAreaStats(statsUrl, setStatisticsData, setFetchError, signal);
    }
    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showData]);

  return { areasData, statisticsData, fetchError };
};

export default useParkingDataFetch;
