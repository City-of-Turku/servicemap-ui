import React, { useEffect, useState } from 'react';
import { format, subDays } from 'date-fns';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { fetchMaintenanceData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { getCoordinates } from './utils';

// TODO: check SnowPlows and build

const SkiTrails = () => {
  const [skiTrails1Day, setSkiTrails1Day] = useState([]);
  const [skiTrails2Day, setSkiTrails2Day] = useState([]);
  const [skiTrails3Day, setSkiTrails3Day] = useState([]);
  const [skiTrails4Day, setSkiTrails4Day] = useState([]);
  const [skiTrails5Day, setSkiTrails5Day] = useState([]);

  const {
    skiTrailsPeriod, showSkiTrails, isActiveSkiTrails, setIsActiveSkiTrails,
  } = useMobilityPlatformContext();

  const { Polyline } = global.rL;

  const currentDate = new Date();
  // TODO: handle correct time options
  const yesterDay = format(subDays(currentDate, 1), 'yyyy-MM-dd HH:mm:ss');
  const twoDays = format(subDays(currentDate, 2), 'yyyy-MM-dd HH:mm:ss');
  const threeDays = format(subDays(currentDate, 3), 'yyyy-MM-dd HH:mm:ss');
  const fourDays = format(subDays(currentDate, 4), 'yyyy-MM-dd HH:mm:ss');
  const fiveDays = format(subDays(currentDate, 90), 'yyyy-MM-dd HH:mm:ss');

  const createQuery = dateItem => `unit_maintenance?page_size=50000&event=ski_trail&maintained_at__gte=${dateItem}`;

  useEffect(() => {
    fetchMaintenanceData(createQuery(yesterDay), setSkiTrails1Day);
    fetchMaintenanceData(createQuery(twoDays), setSkiTrails2Day);
    fetchMaintenanceData(createQuery(threeDays), setSkiTrails3Day);
    fetchMaintenanceData(createQuery(fourDays), setSkiTrails4Day);
    fetchMaintenanceData(createQuery(fiveDays), setSkiTrails5Day);
  }, []);

  const validateData = inputData => inputData && inputData.length > 0;
  let isDataValid = false;

  useEffect(() => {
    if (!isDataValid) {
      setIsActiveSkiTrails(false);
    } else setIsActiveSkiTrails(true);
  }, [isDataValid, skiTrailsPeriod, isActiveSkiTrails, setIsActiveSkiTrails]);

  const renderData = inputData => {
    isDataValid = validateData(inputData);
    if (isDataValid) {
      return inputData.map((item, i) => (
        <Polyline
          // eslint-disable-next-line react/no-array-index-key
          key={`${item.id}${item.last_imported_time}${i}`}
          positions={getCoordinates(item.geometries[0]?.geometry)}
        />
      ));
    }
    return null;
  };

  const renderSkiTrails = () => {
    const works = new Map();
    // TODO: handle different time options
    works.set('1day', skiTrails1Day);
    works.set('2days', skiTrails2Day);
    works.set('3days', skiTrails3Day);
    works.set('4days', skiTrails4Day);
    works.set('5days', skiTrails5Day);
    if (works.has(skiTrailsPeriod)) {
      return renderData(works.get(skiTrailsPeriod));
    }
    return null;
  };

  return showSkiTrails ? renderSkiTrails() : null;
};

export default SkiTrails;
