import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { fetchStreetMaintenanceData } from '../mobilityPlatformRequests/mobilityPlatformRequests';

const SnowPlows = () => {
  const [streetMaintenanceSanitation1Day, setStreetMaintenanceSanitation1Day] = useState([]);
  const [streetMaintenanceSanitation3Days, setStreetMaintenanceSanitation3Days] = useState([]);
  const [streetMaintenanceSanitation1Hour, setStreetMaintenanceSanitation1Hour] = useState([]);
  const [streetMaintenanceSanitation3Hours, setStreetMaintenanceSanitation3Hours] = useState([]);
  const [streetMaintenanceSanitation6Hours, setStreetMaintenanceSanitation6Hours] = useState([]);
  const [streetMaintenanceSanitation12Hours, setStreetMaintenanceSanitation12Hours] = useState([]);
  const [streetMaintenanceSandRemoval1Day, setStreetMaintenanceSandRemoval1Day] = useState([]);
  const [streetMaintenanceSandRemoval3Days, setStreetMaintenanceSandRemoval3Days] = useState([]);
  const [streetMaintenanceSandRemoval1Hour, setStreetMaintenanceSandRemoval1Hour] = useState([]);
  const [streetMaintenanceSandRemoval3Hours, setStreetMaintenanceSandRemoval3Hours] = useState([]);
  const [streetMaintenanceSandRemoval6Hours, setStreetMaintenanceSandRemoval6Hours] = useState([]);
  const [streetMaintenanceSandRemoval12Hours, setStreetMaintenanceSandRemoval12Hours] = useState([]);
  const [streetMaintenanceSnowplow1Day, setStreetMaintenanceSnowplow1Day] = useState([]);
  const [streetMaintenanceSnowplow3Days, setStreetMaintenanceSnowplow3Days] = useState([]);
  const [streetMaintenanceSnowplow1Hour, setStreetMaintenanceSnowplow1Hour] = useState([]);
  const [streetMaintenanceSnowplow3Hours, setStreetMaintenanceSnowplow3Hours] = useState([]);
  const [streetMaintenanceSnowplow6Hours, setStreetMaintenanceSnowplow6Hours] = useState([]);
  const [streetMaintenanceSnowplow12Hours, setStreetMaintenanceSnowplow12Hours] = useState([]);
  const [streetMaintenanceDeIcing1Day, setStreetMaintenanceDeIcing1Day] = useState([]);
  const [streetMaintenanceDeIcing3Days, setStreetMaintenanceDeIcing3Days] = useState([]);
  const [streetMaintenanceDeIcing1Hour, setStreetMaintenanceDeIcing1Hour] = useState([]);
  const [streetMaintenanceDeIcing3Hours, setStreetMaintenanceDeIcing3Hours] = useState([]);
  const [streetMaintenanceDeIcing6Hours, setStreetMaintenanceDeIcing6Hours] = useState([]);
  const [streetMaintenanceDeIcing12Hours, setStreetMaintenanceDeIcing12Hours] = useState([]);

  const {
    streetMaintenancePeriod, showStreetMaintenance, isActiveStreetMaintenance, setIsActiveStreetMaintenance,
  } = useContext(MobilityPlatformContext);

  const { Polyline } = global.rL;

  const options = {
    black: {
      rgba: [0, 0, 0, 255], pattern: '10 3',
    },
    blue: {
      rgba: [7, 44, 115, 255], pattern: '2 9 9 9',
    },
    burgundy: {
      rgba: [128, 0, 32, 255], pattern: '11 3 11',
    },
    green: {
      rgba: [15, 115, 6, 255], pattern: '8 3 8',
    },
    purple: {
      rgba: [202, 15, 212, 255], pattern: '14 4 14',
    },
  };

  const getOption = (input) => {
    switch (input) {
      case 'puhtaanapito':
        return options.green;
      case 'auraus':
        return options.blue;
      case 'hiekanpoisto':
        return options.burgundy;
      case 'liukkaudentorjunta':
        return options.purple;
      default:
        return options.black;
    }
  };

  const getPathOptions = (input) => {
    const { rgba, pattern } = getOption(input);
    return {
      color: `rgba(${rgba})`,
      fillOpacity: 0.3,
      dashArray: pattern,
      weight: 5,
    };
  };

  const maintenanceEvents = {
    sanitation: 'puhtaanapito',
    snowplow: 'auraus',
    deIcing: 'liukkaudentorjunta',
    sandRemoval: 'hiekanpoisto',
  };

  const getEvent = (input) => {
    switch (input) {
      case 'sanitation':
        return maintenanceEvents.sanitation;
      case 'snowplow':
        return maintenanceEvents.snowplow;
      case 'deIcing':
        return maintenanceEvents.deIcing;
      case 'sandRemoval':
        return maintenanceEvents.sandRemoval;
      default:
        return maintenanceEvents.sanitation;
    }
  };

  const yesterDay = moment().clone().add(-1, 'days').format('YYYY-MM-DD HH:mm:ss');
  const threeDays = moment().clone().add(-3, 'days').format('YYYY-MM-DD HH:mm:ss');
  const oneHour = moment().clone().add(-1, 'hours').format('YYYY-MM-DD HH:mm:ss');
  const threeHours = moment().clone().add(-3, 'hours').format('YYYY-MM-DD HH:mm:ss');
  const sixHours = moment().clone().add(-6, 'hours').format('YYYY-MM-DD HH:mm:ss');
  const twelveHours = moment().clone().add(-12, 'hours').format('YYYY-MM-DD HH:mm:ss');

  const createQuery = (type, dateItem) => `geometry_history?page_size=50000&event=${getEvent(type)}&start_date_time=${dateItem}`;

  useEffect(() => {
    fetchStreetMaintenanceData(createQuery('sanitation', yesterDay), setStreetMaintenanceSanitation1Day);
    fetchStreetMaintenanceData(createQuery('sanitation', threeDays), setStreetMaintenanceSanitation3Days);
    fetchStreetMaintenanceData(createQuery('sanitation', oneHour), setStreetMaintenanceSanitation1Hour);
    fetchStreetMaintenanceData(createQuery('sanitation', threeHours), setStreetMaintenanceSanitation3Hours);
    fetchStreetMaintenanceData(createQuery('sanitation', sixHours), setStreetMaintenanceSanitation6Hours);
    fetchStreetMaintenanceData(createQuery('sanitation', twelveHours), setStreetMaintenanceSanitation12Hours);
    fetchStreetMaintenanceData(createQuery('snowplow', yesterDay), setStreetMaintenanceSnowplow1Day);
    fetchStreetMaintenanceData(createQuery('snowplow', threeDays), setStreetMaintenanceSnowplow3Days);
    fetchStreetMaintenanceData(createQuery('snowplow', oneHour), setStreetMaintenanceSnowplow1Hour);
    fetchStreetMaintenanceData(createQuery('snowplow', threeHours), setStreetMaintenanceSnowplow3Hours);
    fetchStreetMaintenanceData(createQuery('snowplow', sixHours), setStreetMaintenanceSnowplow6Hours);
    fetchStreetMaintenanceData(createQuery('snowplow', twelveHours), setStreetMaintenanceSnowplow12Hours);
    fetchStreetMaintenanceData(createQuery('deIcing', yesterDay), setStreetMaintenanceDeIcing1Day);
    fetchStreetMaintenanceData(createQuery('deIcing', threeDays), setStreetMaintenanceDeIcing3Days);
    fetchStreetMaintenanceData(createQuery('deIcing', oneHour), setStreetMaintenanceDeIcing1Hour);
    fetchStreetMaintenanceData(createQuery('deIcing', threeHours), setStreetMaintenanceDeIcing3Hours);
    fetchStreetMaintenanceData(createQuery('deIcing', sixHours), setStreetMaintenanceDeIcing6Hours);
    fetchStreetMaintenanceData(createQuery('deIcing', twelveHours), setStreetMaintenanceDeIcing12Hours);
    fetchStreetMaintenanceData(createQuery('sandRemoval', yesterDay), setStreetMaintenanceSandRemoval1Day);
    fetchStreetMaintenanceData(createQuery('sandRemoval', threeDays), setStreetMaintenanceSandRemoval3Days);
    fetchStreetMaintenanceData(createQuery('sandRemoval', oneHour), setStreetMaintenanceSandRemoval1Hour);
    fetchStreetMaintenanceData(createQuery('sandRemoval', threeHours), setStreetMaintenanceSandRemoval3Hours);
    fetchStreetMaintenanceData(createQuery('sandRemoval', sixHours), setStreetMaintenanceSandRemoval6Hours);
    fetchStreetMaintenanceData(createQuery('sandRemoval', twelveHours), setStreetMaintenanceSandRemoval12Hours);
  }, []);

  const streetMaintenance1Day = [].concat(
    streetMaintenanceSanitation1Day,
    streetMaintenanceSandRemoval1Day,
    streetMaintenanceSnowplow1Day,
    streetMaintenanceDeIcing1Day,
  );

  const streetMaintenance3Days = [].concat(
    streetMaintenanceSanitation3Days,
    streetMaintenanceSandRemoval3Days,
    streetMaintenanceSnowplow3Days,
    streetMaintenanceDeIcing3Days,
  );

  const streetMaintenance1Hour = [].concat(
    streetMaintenanceSanitation1Hour,
    streetMaintenanceSandRemoval1Hour,
    streetMaintenanceSnowplow1Hour,
    streetMaintenanceDeIcing1Hour,
  );

  const streetMaintenance3Hours = [].concat(
    streetMaintenanceSanitation3Hours,
    streetMaintenanceSandRemoval3Hours,
    streetMaintenanceSnowplow3Hours,
    streetMaintenanceDeIcing3Hours,
  );

  const streetMaintenance6Hours = [].concat(
    streetMaintenanceSanitation6Hours,
    streetMaintenanceSandRemoval6Hours,
    streetMaintenanceSnowplow6Hours,
    streetMaintenanceDeIcing6Hours,
  );

  const streetMaintenance12Hours = [].concat(
    streetMaintenanceSanitation12Hours,
    streetMaintenanceSandRemoval12Hours,
    streetMaintenanceSnowplow12Hours,
    streetMaintenanceDeIcing12Hours,
  );

  const validateData = inputData => inputData && inputData.length > 0;

  let isDataValid = false;

  const swapCoords = (coordsData) => {
    const isValid = validateData(coordsData);
    if (isValid) {
      const swapped = coordsData.map(item => [item[1], item[0]]);
      return swapped;
    }
    return coordsData;
  };

  useEffect(() => {
    if (!isDataValid) {
      setIsActiveStreetMaintenance(false);
    } else setIsActiveStreetMaintenance(true);
  }, [isDataValid, streetMaintenancePeriod, isActiveStreetMaintenance, setIsActiveStreetMaintenance]);

  const renderData = (inputData) => {
    const filtered = inputData.reduce((acc, curr) => {
      if (curr.geometry_type === 'LineString') {
        acc.push(curr);
      }
      return acc;
    }, []);

    isDataValid = validateData(filtered);
    if (isDataValid) {
      return filtered.map((item, i) => (
        <Polyline
          // eslint-disable-next-line react/no-array-index-key
          key={`${item.id}${item.timestamp}${i}`}
          pathOptions={getPathOptions(item.events[0])}
          positions={swapCoords(item.coordinates)}
        />
      ));
    }
    return null;
  };

  const renderMaintenanceWorks = () => {
    const works = new Map();
    works.set('1day', streetMaintenance1Day);
    works.set('3days', streetMaintenance3Days);
    works.set('1hour', streetMaintenance1Hour);
    works.set('3hours', streetMaintenance3Hours);
    works.set('6hours', streetMaintenance6Hours);
    works.set('12hours', streetMaintenance12Hours);
    if (works.has(streetMaintenancePeriod)) {
      return renderData(works.get(streetMaintenancePeriod));
    }
    return null;
  };

  return <>{showStreetMaintenance ? renderMaintenanceWorks() : null}</>;
};

export default SnowPlows;
