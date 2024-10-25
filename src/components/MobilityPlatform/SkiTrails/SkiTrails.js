import React, { useEffect, useState } from 'react';
import { format, subDays } from 'date-fns';
import { useSelector } from 'react-redux';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { fetchMaintenanceData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { getCoordinates } from './utils';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { blackOptionsBase, whiteOptionsBase } from '../utils/utils';

const SkiTrails = () => {
  const [loading, setLoading] = useState(true);
  const [skiTrails1Day, setSkiTrails1Day] = useState([]);
  const [skiTrails2Day, setSkiTrails2Day] = useState([]);
  const [skiTrails3Day, setSkiTrails3Day] = useState([]);
  const [skiTrails4Day, setSkiTrails4Day] = useState([]);
  const [skiTrails5Day, setSkiTrails5Day] = useState([]);

  const {
    skiTrailsPeriod, showSkiTrails, isActiveSkiTrails, setIsActiveSkiTrails,
  } = useMobilityPlatformContext();
  const useContrast = useSelector(useAccessibleMap);
  const { Polyline } = global.rL;

  const currentDate = new Date();
  // TODO: handle correct time options
  const yesterDay = format(subDays(currentDate, 1), 'yyyy-MM-dd HH:mm:ss');
  const twoDays = format(subDays(currentDate, 2), 'yyyy-MM-dd HH:mm:ss');
  const threeDays = format(subDays(currentDate, 3), 'yyyy-MM-dd HH:mm:ss');
  const fourDays = format(subDays(currentDate, 4), 'yyyy-MM-dd HH:mm:ss');
  const fiveDays = format(subDays(currentDate, 90), 'yyyy-MM-dd HH:mm:ss');

  const createQuery = dateItem => `unit_maintenance?page_size=50000&target__iexact=ski_trail&maintained_at__gte=${dateItem}`;

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        fetchMaintenanceData(createQuery(yesterDay), setSkiTrails1Day),
        fetchMaintenanceData(createQuery(twoDays), setSkiTrails2Day),
        fetchMaintenanceData(createQuery(threeDays), setSkiTrails3Day),
        fetchMaintenanceData(createQuery(fourDays), setSkiTrails4Day),
        fetchMaintenanceData(createQuery(fiveDays), setSkiTrails5Day),
      ]);

      setLoading(false);
    };

    fetchAllData();
  }, []);

  const validateData = inputData => inputData && inputData.length > 0;
  let isDataValid = false;

  useEffect(() => {
    if (!isDataValid && isActiveSkiTrails) {
      setIsActiveSkiTrails(false);
    } else if (isDataValid && !isActiveSkiTrails) {
      setIsActiveSkiTrails(true);
    }
  }, [isDataValid, skiTrailsPeriod, isActiveSkiTrails, setIsActiveSkiTrails, loading]);

  const renderData = inputData => {
    isDataValid = validateData(inputData);
    if (isDataValid) {
      return inputData.map((item, i) => {
        const coordinates = getCoordinates(item.geometries[0]?.geometry);

        return (
          useContrast ? (
            // eslint-disable-next-line react/no-array-index-key
            <React.Fragment key={`${item.id}${item.last_imported_time}${i}`}>
              <Polyline weight={8} pathOptions={whiteOptionsBase({ dashArray: null })} positions={coordinates} />
              <Polyline weight={4} pathOptions={blackOptionsBase({ dashArray: '2 9 9 9' })} positions={coordinates} />
            </React.Fragment>
          ) : (
            <Polyline
              // eslint-disable-next-line react/no-array-index-key
              key={`${item.id}${item.last_imported_time}${i}`}
              positions={coordinates}
            />
          )
        );
      });
    }

    return null;
  };

  const renderSkiTrails = () => {
    const trails = new Map();
    // TODO: handle different time options
    trails.set('1day', skiTrails1Day);
    trails.set('2days', skiTrails2Day);
    trails.set('3days', skiTrails3Day);
    trails.set('4days', skiTrails4Day);
    trails.set('5days', skiTrails5Day);
    if (trails.has(skiTrailsPeriod)) {
      return renderData(trails.get(skiTrailsPeriod));
    }
    return null;
  };

  return showSkiTrails && !loading ? renderSkiTrails() : null;
};

export default SkiTrails;
