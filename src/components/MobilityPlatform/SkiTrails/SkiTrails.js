import React, { useEffect, useState } from 'react';
import { format, subDays, subHours } from 'date-fns';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { fetchMaintenanceData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { getCoordinates } from './utils';

// TODO: check SnowPlows and build

const SkiTrails = () => {
  const [skiTrails1Day, setSkiTrails1Day] = useState([]);

  const {
    skiTrailsPeriod, showSkiTrails, isActiveSkiTrails, setIsActiveSkiTrails,
  } = useMobilityPlatformContext();

  const { Polyline } = global.rL;

  const getPathOptions = () => {
    const rgba = [15, 115, 6, 255];
    const pattern = '8 3 8';
    return {
      color: `rgba(${rgba})`,
      fillOpacity: 0.3,
      dashArray: pattern,
      weight: 5,
    };
  };

  const currentDate = new Date();
  // TODO: handle correct time options
  const yesterDay = format(subDays(currentDate, 90), 'yyyy-MM-dd HH:mm:ss');

  const createQuery = dateItem => `unit_maintenance?page_size=50000&event=ski_trail&start_date_time=${dateItem}`;

  useEffect(() => {
    fetchMaintenanceData(createQuery(yesterDay), setSkiTrails1Day);
  }, []);

  const validateData = inputData => inputData && inputData.length > 0;
  let isDataValid = false;
  // TODO: swapping can be done in coords get util
  const swapCoords = coordsData => {
    const isValid = validateData(coordsData);
    if (isValid) {
      const swapped = coordsData.map(item => [item[1], item[0]]);
      return swapped;
    }
    return coordsData;
  };

  useEffect(() => {
    if (!isDataValid) {
      setIsActiveSkiTrails(false);
    } else setIsActiveSkiTrails(true);
  }, [isDataValid, skiTrailsPeriod, isActiveSkiTrails, setIsActiveSkiTrails]);

  const renderData = inputData => {
    // TODO: below dont work. Handle geometries.geometry string
    // geometry: "SRID=4326;LINESTRING(x y, x y, x y)"
    // handle possible empty data?
    const filtered = inputData.reduce((acc, curr) => {
      if (curr.geometry_type === 'LineString') {
        acc.push(curr);
      }
      return acc;
    }, []);
    const mapped = inputData.map(item => {
      // eslint-disable-next-line camelcase
      const { id, last_imported_time, geometries } = item;
      const coordinates = getCoordinates(geometries[0].geometry);
      // eslint-disable-next-line camelcase
      return { id, last_imported_time, coordinates };
    });

    isDataValid = validateData(mapped);

    if (isDataValid) {
      return mapped.map((item, i) => (
        <Polyline
          // eslint-disable-next-line react/no-array-index-key
          key={`${item.id}${item.last_imported_time}${i}`}
          // pathOptions={getPathOptions(item.events[0])}
          positions={swapCoords(item.coordinates)}
        />
      ));
    }
    return null;
  };

  const renderSkiTrails = () => {
    const works = new Map();
    // TODO: handle different time options
    works.set('1day', skiTrails1Day);
    if (works.has(skiTrailsPeriod)) {
      return renderData(works.get(skiTrailsPeriod));
    }
    return null;
  };

  return showSkiTrails ? renderSkiTrails() : null;
};

export default SkiTrails;
