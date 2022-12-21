import {
  Checkbox, FormControlLabel, Typography, List, ListItem,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React, {
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { ReactSVG } from 'react-svg';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import iconBicycle from 'servicemap-ui-turku/assets/icons/icons-icon_bicycle.svg';
import iconBoat from 'servicemap-ui-turku/assets/icons/icons-icon_boating.svg';
import iconCar from 'servicemap-ui-turku/assets/icons/icons-icon_car.svg';
import iconScooter from 'servicemap-ui-turku/assets/icons/icons-icon_scooter.svg';
import iconSnowplow from 'servicemap-ui-turku/assets/icons/icons-icon_street_maintenance.svg';
import iconWalk from 'servicemap-ui-turku/assets/icons/icons-icon_walk.svg';
import InfoTextBox from '../../components/MobilityPlatform/InfoTextBox';
import {
  fetchBicycleRouteNames,
  fetchCultureRouteNames,
  fetchMobilityMapPolygonData,
} from '../../components/MobilityPlatform/mobilityPlatformRequests/mobilityPlatformRequests';
import { isDataValid } from '../../components/MobilityPlatform/utils/utils';
import TitleBar from '../../components/TitleBar';
import MobilityPlatformContext from '../../context/MobilityPlatformContext';
import CityBikeInfo from './components/CityBikeInfo';
import Description from './components/Description';
import EmptyRouteList from './components/EmptyRouteList';
import ExtendedInfo from './components/ExtendedInfo';
import FormLabel from './components/FormLabel';
import RouteLength from './components/RouteLength';
import SliceList from './components/SliceListButton';
import TrailList from './components/TrailList';
import ParkingChargeZoneList from './components/ParkingChargeZoneList';
import ScooterProviderList from './components/ScooterProviderList';
import SMAccordion from '../../components/SMAccordion';
import SpeedLimitZonesList from './components/SpeedLimitZonesList';
import RouteListItem from './components/RouteListItem';

const MobilitySettingsView = ({ classes, intl, navigator }) => {
  const [openWalkSettings, setOpenWalkSettings] = useState(false);
  const [openBicycleSettings, setOpenBicycleSettings] = useState(false);
  const [openCarSettings, setOpenCarSettings] = useState(false);
  const [openBoatingSettings, setOpenBoatingSettings] = useState(false);
  const [openScooterSettings, setOpenScooterSettings] = useState(false);
  const [openStreetMaintenanceSettings, setOpenStreetMaintenanceSettings] = useState(false);
  const [openCultureRouteList, setOpenCultureRouteList] = useState(false);
  const [cultureRouteList, setCultureRouteList] = useState([]);
  const [localizedCultureRoutes, setLocalizedCultureRoutes] = useState([]);
  const [cultureRoutesToShow, setCultureRoutesToShow] = useState(4);
  const [bicycleRouteList, setBicycleRouteList] = useState([]);
  const [openBicycleRouteList, setOpenBicycleRouteList] = useState(false);
  const [bicycleRoutesToShow, setBicycleRoutesToShow] = useState(4);
  const [openSpeedLimitList, setOpenSpeedLimitList] = useState(false);
  const [openParkingChargeZoneList, setOpenParkingChargeZoneList] = useState(false);
  const [openScooterProviderList, setOpenScooterProviderList] = useState(false);
  const [openStreetMaintenanceSelectionList, setOpenStreetMaintenanceSelectionList] = useState(false);
  const [openMarkedTrailsList, setOpenMarkedTrailsList] = useState(false);
  const [markedTrailsList, setMarkedTrailsList] = useState([]);
  const [markedTrailsToShow, setMarkedTrailsToShow] = useState(4);
  const [openNatureTrailsList, setOpenNatureTrailsList] = useState(false);
  const [natureTrailsList, setNatureTrailsList] = useState([]);
  const [natureTrailsToShow, setNatureTrailsToShow] = useState(4);
  const [openFitnessTrailsList, setOpenFitnessTrailsList] = useState(false);
  const [fitnessTrailsList, setFitnessTrailsList] = useState([]);
  const [fitnessTrailsToShow, setFitnessTrailsToShow] = useState(4);

  const {
    setOpenMobilityPlatform,
    cultureRouteId,
    setCultureRouteId,
    bicycleRouteName,
    setBicycleRouteName,
    parkingChargeZones,
    setParkingChargeZones,
    parkingChargeZoneId,
    setParkingChargeZoneId,
    speedLimitSelections,
    setSpeedLimitSelections,
    speedLimitZones,
    setSpeedLimitZones,
    mobilityMap,
    setMobilityMap,
    mobilityMapWalk,
    setMobilityMapWalk,
    mobilityMapBicycle,
    setMobilityMapBicycle,
    streetMaintenancePeriod,
    setStreetMaintenancePeriod,
    isActiveStreetMaintenance,
    markedTrailsObj,
    setMarkedTrailsObj,
    natureTrailsObj,
    setNatureTrailsObj,
    fitnessTrailsObj,
    setFitnessTrailsObj,
  } = useContext(MobilityPlatformContext);

  const locale = useSelector(state => state.user.locale);
  const location = useLocation();

  const showEcoCounter = mobilityMapWalk.ecoCounter;
  const showRestRooms = mobilityMapWalk.restRooms;
  const showCultureRoutes = mobilityMapWalk.cultureRoutes;
  const showMarkedTrails = mobilityMapWalk.markedTrails;
  const showNatureTrails = mobilityMapWalk.natureTrails;
  const showFitnessTrails = mobilityMapWalk.fitnessTrails;

  const showBicycleStands = mobilityMapBicycle.bicycleStands;
  const showCityBikes = mobilityMapBicycle.cityBikes;
  const showBikeServiceStations = mobilityMapBicycle.bikeServiceStations;
  const showBicycleRoutes = mobilityMapBicycle.bicycleRoutes;
  const showBrushSandedRoads = mobilityMapBicycle.brushSandedRoads;
  const showBrushSaltedRoads = mobilityMapBicycle.brushSaltedRoads;

  const bikeInfo = {
    paragraph1: 'mobilityPlatform.info.cityBikes.paragraph.1',
    paragraph2: 'mobilityPlatform.info.cityBikes.paragraph.2',
    subtitle: 'mobilityPlatform.info.cityBikes.subtitle',
    link: 'mobilityPlatform.info.cityBikes.link',
    apiInfo: 'mobilityPlatform.info.cityBikes.apiInfo',
    url: {
      fi: 'https://foli.fi/föllärit',
      en: 'https://www.foli.fi/en/f%C3%B6li-bikes',
      sv: 'https://www.foli.fi/sv/fölicyklar',
    },
  };

  const chargeZoneTranslations = {
    message1: 'mobilityPlatform.info.parkingChargeZones.paragraph.1',
    message2: 'mobilityPlatform.info.parkingChargeZones.paragraph.2',
    message3: 'mobilityPlatform.info.parkingChargeZones.paragraph.3',
    zones: [
      'mobilityPlatform.info.parkingChargeZones.zone.1',
      'mobilityPlatform.info.parkingChargeZones.zone.2',
      'mobilityPlatform.info.parkingChargeZones.zone.3',
    ],
  };

  useEffect(() => {
    setOpenMobilityPlatform(true);
  }, [setOpenMobilityPlatform]);

  /**
   * Fetch list of routes
   * @param {('react').SetStateAction}
   * @returns {Array} and sets it into state
   */
  useEffect(() => {
    fetchCultureRouteNames(setCultureRouteList);
  }, [setCultureRouteList]);

  useEffect(() => {
    fetchBicycleRouteNames(setBicycleRouteList);
  }, [setBicycleRouteList]);

  useEffect(() => {
    fetchMobilityMapPolygonData('SpeedLimitZone', 1000, setSpeedLimitZones);
  }, [setSpeedLimitZones]);

  useEffect(() => {
    fetchMobilityMapPolygonData('PaymentZone', 10, setParkingChargeZones);
  }, [setParkingChargeZones]);

  useEffect(() => {
    fetchMobilityMapPolygonData('PaavonPolku', 50, setMarkedTrailsList);
  }, [setMarkedTrailsList]);

  useEffect(() => {
    fetchMobilityMapPolygonData('NatureTrail', 200, setNatureTrailsList);
  }, [setNatureTrailsList]);

  useEffect(() => {
    fetchMobilityMapPolygonData('FitnessTrail', 200, setFitnessTrailsList);
  }, [setFitnessTrailsList]);

  /** If direct link is used to navigate, open correct content view
   * @param {string} pathname
   * @return {('react').SetStateAction}
   */
  useEffect(() => {
    if (location.pathname.includes('walking')) {
      setOpenWalkSettings(true);
    } else if (location.pathname.includes('cycling')) {
      setOpenBicycleSettings(true);
    } else if (location.pathname.includes('driving')) {
      setOpenCarSettings(true);
    } else if (location.pathname.includes('scooters')) {
      setOpenScooterSettings(true);
    } else if (location.pathname.includes('boating')) {
      setOpenBoatingSettings(true);
    } else if (location.pathname.includes('snowplows')) {
      setOpenStreetMaintenanceSettings(true);
    }
  }, [location]);

  const walkingTypes = ['restRooms'];
  const bicycleTypes = ['bicycleStands', 'bikeServiceStations', 'cityBikes'];
  const drivingTypes = ['rentalCars', 'chargingStations', 'gasFillingStations', 'parkingSpaces', 'disabledParking', 'loadingPlaces'];
  const boatingTypes = ['marinas', 'boatParking', 'guestHarbour'];
  const scooterTypes = ['scooterNoParking', 'scooterParking', 'scooterSpeedLimit'];
  const streetMaintenanceTypes = ['brushSandedRoads', 'brushSaltedRoads'];

  /**
   * Check is visibility boolean values are true
   * This would be so if user has not hid them, but left mobility map before returning
   * @param {obj} mobilityMap
   */
  // These open only one view
  const checkVisibilityValues = (obj) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (value && walkingTypes.includes(key)) {
        setOpenWalkSettings(true);
      } else if (value && boatingTypes.includes(key)) {
        setOpenBoatingSettings(true);
      } else if (value && bicycleTypes.includes(key)) {
        setOpenBicycleSettings(true);
      } else if (value && scooterTypes.includes(key)) {
        setOpenScooterSettings(true);
      } else if (value && drivingTypes.includes(key)) {
        setOpenCarSettings(true);
      } else if (value && streetMaintenanceTypes.includes(key)) {
        setOpenStreetMaintenanceSettings(true);
      }
    });
  };

  // These open multiple views
  const checkVisibilityValuesOfList = (obj) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (value && key === 'cultureRoutes') {
        setOpenWalkSettings(true);
        setOpenCultureRouteList(true);
      } else if (value && key === 'bicycleRoutes') {
        setOpenBicycleSettings(true);
        setOpenBicycleRouteList(true);
      } else if (value && key === 'speedLimitZones') {
        setOpenCarSettings(true);
        setOpenSpeedLimitList(true);
      } else if (value && key === 'parkingChargeZones') {
        setOpenCarSettings(true);
        setOpenParkingChargeZoneList(true);
      } else if (value && key === 'scootersRyde') {
        setOpenScooterSettings(true);
        setOpenScooterProviderList(true);
      } else if (value && key === 'streetMaintenance') {
        setOpenStreetMaintenanceSettings(true);
        setOpenStreetMaintenanceSelectionList(true);
      } else if (value && key === 'ecoCounter') {
        setOpenWalkSettings(true);
        setOpenBicycleSettings(true);
      }
    });
  };

  useEffect(() => {
    checkVisibilityValues(mobilityMap);
    checkVisibilityValuesOfList(mobilityMap);
  }, [mobilityMap]);

  const nameKeys = {
    fi: 'name',
    en: 'name_en',
    sv: 'name_sv',
  };

  /**
   * @var {(Array|locale)}
   * @function filter array
   * @returns {(Array|('react').SetStateAction)}
   */
  useEffect(() => {
    if (cultureRouteList && cultureRouteList.length > 0) {
      setLocalizedCultureRoutes(cultureRouteList.filter(item => item[nameKeys[locale]]));
    }
  }, [cultureRouteList, locale]);

  /**
   * Sort routes in alphapethical order based on current locale.
   * If locale is not finnish the filtered list is used.
   * @param {Array && locale}
   * @function sort
   * @returns {Array}
   */
  useEffect(() => {
    if (cultureRouteList && cultureRouteList.length > 0 && locale === 'fi') {
      cultureRouteList.sort((a, b) => a[nameKeys[locale]].localeCompare(b[nameKeys[locale]]));
    } else if (localizedCultureRoutes && localizedCultureRoutes.length > 0 && locale !== 'fi') {
      localizedCultureRoutes.sort((a, b) => a[nameKeys[locale]].localeCompare(b[nameKeys[locale]]));
    }
  }, [cultureRouteList, localizedCultureRoutes, locale]);

  const sortMarkedTrails = (data) => {
    if (data && data.length > 0) {
      return data.sort((a, b) => a[nameKeys[locale]].split(': ').slice(-1)[0].localeCompare(b[nameKeys[locale]].split(': ').slice(-1)[0]));
    }
    return [];
  };

  const markedTrailsSorted = sortMarkedTrails(markedTrailsList);

  /**
   * Sort routes in alphapethical order.
   * @param {Array && locale}
   * @function sort
   * @returns {Array}
   */

  useEffect(() => {
    const objKeys = {
      fi: 'name_fi',
      en: 'name_en',
      sv: 'name_sv',
    };

    if (bicycleRouteList) {
      bicycleRouteList.sort((a, b) => a[objKeys[locale]].localeCompare(b[objKeys[locale]], undefined, {
        numeric: true,
        sensivity: 'base',
      }));
    }
  }, [bicycleRouteList, locale]);

  const sortTrails = (data) => {
    if (data && data.length > 0) {
      return data.sort((a, b) => a.name.localeCompare(b.name));
    }
    return [];
  };

  /**
   * Get trails that are in Turku.
   * @param {Array} data
   * @function reduce
   * @returns {Array}
   */
  const getLocalTrails = data => data.reduce((acc, curr) => {
    if (curr.municipality === 'turku') {
      acc.push(curr);
    }
    return acc;
  }, []);

  const natureTrailsTku = getLocalTrails(natureTrailsList);
  const natureTrailsTkuSorted = sortTrails(natureTrailsTku);

  const fitnessTrailsTku = getLocalTrails(fitnessTrailsList);
  const fitnessTrailsTkuSorted = sortTrails(fitnessTrailsTku);

  /**
   * Toggle functions for main user types
   * @var {Boolean}
   * @returns {Boolean}
   */
  const walkSettingsToggle = () => {
    setOpenWalkSettings(current => !current);
    if (!openWalkSettings) {
      navigator.push('mobilityPlatform', 'walking');
    }
  };

  const bicycleSettingsToggle = () => {
    setOpenBicycleSettings(current => !current);
    if (!openBicycleSettings) {
      navigator.push('mobilityPlatform', 'cycling');
    }
  };

  const carSettingsToggle = () => {
    setOpenCarSettings(current => !current);
    if (!openCarSettings) {
      navigator.push('mobilityPlatform', 'driving');
    }
  };

  const boatingSettingsToggle = () => {
    setOpenBoatingSettings(current => !current);
    if (!openBoatingSettings) {
      navigator.push('mobilityPlatform', 'boating');
    }
  };

  const scooterSettingsToggle = () => {
    setOpenScooterSettings(current => !current);
    if (!openScooterSettings) {
      navigator.push('mobilityPlatform', 'scooters');
    }
  };

  const streetMaintenanceSettingsToggle = () => {
    setOpenStreetMaintenanceSettings(current => !current);
    if (!openStreetMaintenanceSettings) {
      navigator.push('mobilityPlatform', 'snowplows');
    }
  };

  /**
   * Toggle functions for content types
   * @var {boolean}
   * @returns {boolean}
   */
  const ecoCounterStationsToggle = () => {
    if (!showEcoCounter) {
      setMobilityMapWalk(mobilityMapWalk => ({ ...mobilityMapWalk, ecoCounter: true }));
    } else setMobilityMapWalk(mobilityMapWalk => ({ ...mobilityMapWalk, ecoCounter: false }));
  };

  const publicRestroomsToggle = () => {
    if (!showRestRooms) {
      setMobilityMapWalk(mobilityMapWalk => ({ ...mobilityMapWalk, restRooms: true }));
    } else setMobilityMapWalk(mobilityMapWalk => ({ ...mobilityMapWalk, restRooms: false }));
  };

  const bicycleStandsToggle = () => {
    if (!showBicycleStands) {
      setMobilityMapBicycle(mobilityMapBicycle => ({ ...mobilityMapBicycle, bicycleStands: true }));
    } else setMobilityMapBicycle(mobilityMapBicycle => ({ ...mobilityMapBicycle, bicycleStands: false }));
  };

  const bikeServiceStationsToggle = () => {
    if (!showBikeServiceStations) {
      setMobilityMapBicycle(mobilityMapBicycle => ({ ...mobilityMapBicycle, bikeServiceStations: true }));
    } else setMobilityMapBicycle(mobilityMapBicycle => ({ ...mobilityMapBicycle, bikeServiceStations: false }));
  };

  const cityBikesToggle = () => {
    if (!showCityBikes) {
      setMobilityMapBicycle(mobilityMapBicycle => ({ ...mobilityMapBicycle, cityBikes: true }));
    } else setMobilityMapBicycle(mobilityMapBicycle => ({ ...mobilityMapBicycle, cityBikes: false }));
  };

  const brushSandedRouteToggle = () => {
    if (!showBrushSandedRoads) {
      setMobilityMapBicycle(mobilityMapBicycle => ({ ...mobilityMapBicycle, brushSandedRoads: true }));
    } else setMobilityMapBicycle(mobilityMapBicycle => ({ ...mobilityMapBicycle, brushSandedRoads: false }));
  };

  const brushSaltedRouteToggle = () => {
    if (!showBrushSaltedRoads) {
      setMobilityMapBicycle(mobilityMapBicycle => ({ ...mobilityMapBicycle, brushSaltedRoads: true }));
    } else setMobilityMapBicycle(mobilityMapBicycle => ({ ...mobilityMapBicycle, brushSaltedRoads: false }));
  };

  const rentalCarsToggle = () => {
    if (!mobilityMap.rentalCars) {
      setMobilityMap(mobilityMap => ({ ...mobilityMap, rentalCars: true }));
    } else setMobilityMap(mobilityMap => ({ ...mobilityMap, rentalCars: false }));
  };

  const gasFillingStationsToggle = () => {
    if (!mobilityMap.gasFillingStations) {
      setMobilityMap(mobilityMap => ({ ...mobilityMap, gasFillingStations: true }));
    } else setMobilityMap(mobilityMap => ({ ...mobilityMap, gasFillingStations: false }));
  };

  const chargingStationsToggle = () => {
    if (!mobilityMap.chargingStations) {
      setMobilityMap(mobilityMap => ({ ...mobilityMap, chargingStations: true }));
    } else setMobilityMap(mobilityMap => ({ ...mobilityMap, chargingStations: false }));
  };

  const parkingSpacesToggle = () => {
    if (!mobilityMap.parkingSpaces) {
      setMobilityMap(mobilityMap => ({ ...mobilityMap, parkingSpaces: true }));
    } else setMobilityMap(mobilityMap => ({ ...mobilityMap, parkingSpaces: false }));
  };

  const disabledParkingToggle = () => {
    if (!mobilityMap.disabledParking) {
      setMobilityMap(mobilityMap => ({ ...mobilityMap, disabledParking: true }));
    } else setMobilityMap(mobilityMap => ({ ...mobilityMap, disabledParking: false }));
  };

  const loadingPlacesToggle = () => {
    if (!mobilityMap.loadingPlaces) {
      setMobilityMap(mobilityMap => ({ ...mobilityMap, loadingPlaces: true }));
    } else setMobilityMap(mobilityMap => ({ ...mobilityMap, loadingPlaces: false }));
  };

  const marinasToggle = () => {
    if (!mobilityMap.marinas) {
      setMobilityMap(mobilityMap => ({ ...mobilityMap, marinas: true }));
    } else setMobilityMap(mobilityMap => ({ ...mobilityMap, marinas: false }));
  };

  const boatParkingToggle = () => {
    if (!mobilityMap.boatParking) {
      setMobilityMap(mobilityMap => ({ ...mobilityMap, boatParking: true }));
    } else setMobilityMap(mobilityMap => ({ ...mobilityMap, boatParking: false }));
  };

  const guestHarbourToggle = () => {
    if (!mobilityMap.guestHarbour) {
      setMobilityMap(mobilityMap => ({ ...mobilityMap, guestHarbour: true }));
    } else setMobilityMap(mobilityMap => ({ ...mobilityMap, guestHarbour: false }));
  };

  const scooterNoParkingToggle = () => {
    if (!mobilityMap.scooterNoParking) {
      setMobilityMap(mobilityMap => ({ ...mobilityMap, scooterNoParking: true }));
    } else setMobilityMap(mobilityMap => ({ ...mobilityMap, scooterNoParking: false }));
  };

  const scooterParkingAreasToggle = () => {
    if (!mobilityMap.scooterParking) {
      setMobilityMap(mobilityMap => ({ ...mobilityMap, scooterParking: true }));
    } else setMobilityMap(mobilityMap => ({ ...mobilityMap, scooterParking: false }));
  };

  const scooterSpeedLimitAreasToggle = () => {
    if (!mobilityMap.scooterSpeedLimit) {
      setMobilityMap(mobilityMap => ({ ...mobilityMap, scooterSpeedLimit: true }));
    } else setMobilityMap(mobilityMap => ({ ...mobilityMap, scooterSpeedLimit: false }));
  };

  const scooterListToggle = () => {
    setOpenScooterProviderList(current => !current);
    if (mobilityMap.scootersRyde) {
      setMobilityMap(mobilityMap => ({ ...mobilityMap, scootersRyde: false }));
    }
  };

  const scootersRydeToggle = () => {
    if (!mobilityMap.scootersRyde) {
      setMobilityMap(mobilityMap => ({ ...mobilityMap, scootersRyde: true }));
    } else setMobilityMap(mobilityMap => ({ ...mobilityMap, scootersRyde: false }));
  };

  const cultureRouteListToggle = () => {
    setOpenCultureRouteList(current => !current);
    if (cultureRouteId) {
      setCultureRouteId(null);
    }
    if (showCultureRoutes) {
      setMobilityMapWalk(mobilityMapWalk => ({ ...mobilityMapWalk, cultureRoutes: false }));
    }
    if (cultureRoutesToShow === (cultureRouteList.length || localizedCultureRoutes.length)) {
      setCultureRoutesToShow(4);
    }
  };

  const resetItemsToShow = (itemsToShow, data, setItems) => {
    if (itemsToShow === data.length) {
      setItems(4);
    }
  };

  const markedTrailListToggle = () => {
    setOpenMarkedTrailsList(current => !current);
    if (markedTrailsObj) {
      setMarkedTrailsObj({});
    }
    if (showMarkedTrails) {
      setMobilityMapWalk(mobilityMapWalk => ({ ...mobilityMapWalk, markedTrails: false }));
    }
    if (markedTrailsToShow === markedTrailsSorted.length) {
      setMarkedTrailsToShow(4);
    }
  };

  const natureTrailListToggle = () => {
    setOpenNatureTrailsList(current => !current);
    if (natureTrailsObj) {
      setNatureTrailsObj({});
    }
    if (showNatureTrails) {
      setMobilityMapWalk(mobilityMapWalk => ({ ...mobilityMapWalk, natureTrails: false }));
    }
    resetItemsToShow(natureTrailsToShow, natureTrailsTkuSorted, setNatureTrailsToShow);
  };

  const fitnessTrailListToggle = () => {
    setOpenFitnessTrailsList(current => !current);
    if (fitnessTrailsObj) {
      setFitnessTrailsObj({});
    }
    if (showFitnessTrails) {
      setMobilityMapWalk(mobilityMapWalk => ({ ...mobilityMapWalk, fitnessTrails: false }));
    }
    resetItemsToShow(fitnessTrailsToShow, fitnessTrailsTkuSorted, setFitnessTrailsToShow);
  };

  const bicycleRouteListToggle = () => {
    setOpenBicycleRouteList(current => !current);
    if (bicycleRouteName) {
      setBicycleRouteName(null);
    }
    if (showBicycleRoutes) {
      setMobilityMapBicycle(mobilityMapBicycle => ({ ...mobilityMapBicycle, bicycleRoutes: false }));
    }
    resetItemsToShow(bicycleRoutesToShow, bicycleRouteList, setBicycleRoutesToShow);
  };

  const streetMaintenanceListToggle = () => {
    setOpenStreetMaintenanceSelectionList(current => !current);
    if (streetMaintenancePeriod) {
      setStreetMaintenancePeriod(null);
    }
    if (mobilityMap.streetMaintenance) {
      setMobilityMap(mobilityMap => ({ ...mobilityMap, streetMaintenance: false }));
    }
  };

  /**
   * Stores previous value
   */
  const prevCultureRouteIdRef = useRef();

  useEffect(() => {
    prevCultureRouteIdRef.current = cultureRouteId;
  }, [cultureRouteId]);

  /**
   * If user clicks same route again, then reset id and set visiblity to false
   * Otherwise new values are set
   * @param {string} itemId
   */
  const setCultureRouteState = (itemId) => {
    setCultureRouteId(itemId);
    setMobilityMap(mobilityMap => ({ ...mobilityMap, cultureRoutes: true }));
    if (itemId === prevCultureRouteIdRef.current) {
      setCultureRouteId(null);
      setMobilityMap(mobilityMap => ({ ...mobilityMap, cultureRoutes: false }));
    }
  };

  /**
   * Stores previous value
   */
  const prevBicycleRouteNameRef = useRef();

  /**
   * If user clicks same route again, then reset name and set visiblity to false
   * Otherwise new values are set
   */
  useEffect(() => {
    prevBicycleRouteNameRef.current = bicycleRouteName;
  }, [bicycleRouteName]);

  /**
   * @param {string} routeName
   */
  const setBicycleRouteState = (routeName) => {
    setBicycleRouteName(routeName);
    setMobilityMapBicycle(mobilityMapBicycle => ({ ...mobilityMapBicycle, bicycleRoutes: true }));
    if (routeName === prevBicycleRouteNameRef.current) {
      setBicycleRouteName(null);
      setMobilityMapBicycle(mobilityMapBicycle => ({ ...mobilityMapBicycle, bicycleRoutes: false }));
    }
  };

  /**
   * Stores previous value
   */
  const prevMarkedTrailObjRef = useRef();

  /**
   * If user clicks same trail again, then reset name and set visiblity to false
   * Otherwise new values are set
   */
  useEffect(() => {
    prevMarkedTrailObjRef.current = markedTrailsObj;
  }, [markedTrailsObj]);

  /**
   * @param {obj}
   */
  const setMarkedTrailState = (obj) => {
    setMarkedTrailsObj(obj);
    setMobilityMapWalk(mobilityMapWalk => ({ ...mobilityMapWalk, markedTrails: true }));
    if (obj === prevMarkedTrailObjRef.current) {
      setMarkedTrailsObj({});
      setMobilityMapWalk(mobilityMapWalk => ({ ...mobilityMapWalk, markedTrails: false }));
    }
  };

  const prevNatureTrailObjRef = useRef();

  /**
   * If user clicks same trail again, then reset name and set visiblity to false
   * Otherwise new values are set
   */
  useEffect(() => {
    prevNatureTrailObjRef.current = natureTrailsObj;
  }, [natureTrailsObj]);

  /**
   * @param {obj}
   */
  const setNatureTrailState = (obj) => {
    setNatureTrailsObj(obj);
    setMobilityMapWalk(mobilityMapWalk => ({ ...mobilityMapWalk, natureTrails: true }));
    if (obj === prevNatureTrailObjRef.current) {
      setNatureTrailsObj({});
      setMobilityMapWalk(mobilityMapWalk => ({ ...mobilityMapWalk, natureTrails: false }));
    }
  };

  /**
   * Stores previous value
   */
  const prevFitnessTrailObjRef = useRef();

  /**
   * If user clicks same trail again, then reset name and set visiblity to false
   * Otherwise new values are set
   */
  useEffect(() => {
    prevFitnessTrailObjRef.current = fitnessTrailsObj;
  }, [fitnessTrailsObj]);

  /**
   * @param {obj}
   */
  const setFitnessTrailState = (obj) => {
    setFitnessTrailsObj(obj);
    setMobilityMapWalk(mobilityMapWalk => ({ ...mobilityMapWalk, fitnessTrails: true }));
    if (obj === prevFitnessTrailObjRef.current) {
      setFitnessTrailsObj({});
      setMobilityMapWalk(mobilityMapWalk => ({ ...mobilityMapWalk, fitnessTrails: false }));
    }
  };

  const speedLimitZonesToggle = () => {
    setOpenSpeedLimitList(current => !current);

    if (!mobilityMap.speedLimitZones) {
      setMobilityMap(mobilityMap => ({ ...mobilityMap, speedLimitZones: true }));
    } else setMobilityMap(mobilityMap => ({ ...mobilityMap, speedLimitZones: false }));

    if (speedLimitSelections && speedLimitSelections.length > 0) {
      setSpeedLimitSelections([]);
    }
  };

  const setSpeedLimitState = (limitItem) => {
    if (!speedLimitSelections.includes(limitItem)) {
      setSpeedLimitSelections(speedLimitSelections => [...speedLimitSelections, limitItem]);
      setMobilityMap(mobilityMap => ({ ...mobilityMap, speedLimitZones: true }));
    } else setSpeedLimitSelections(speedLimitSelections.filter(item => item !== limitItem));
  };

  const parkingChargeZonesListToggle = () => {
    setOpenParkingChargeZoneList(current => !current);
    if (mobilityMap.parkingChargeZones) {
      setMobilityMap(mobilityMap => ({ ...mobilityMap, parkingChargeZones: false }));
    }
    if (parkingChargeZoneId) {
      setParkingChargeZoneId(null);
    }
  };

  /**
   * Stores previous value
   */
  const prevParkingChargeZoneIdRef = useRef();

  useEffect(() => {
    prevParkingChargeZoneIdRef.current = parkingChargeZoneId;
  }, [parkingChargeZoneId]);

  /**
   * If user clicks same route again, then reset id and set visiblity to false
   * Otherwise new values are set
   * @param {string} id
   */
  const selectParkingChargeZone = (id) => {
    setParkingChargeZoneId(id);
    setMobilityMap(mobilityMap => ({ ...mobilityMap, parkingChargeZones: true }));
    if (id === prevParkingChargeZoneIdRef.current) {
      setParkingChargeZoneId(null);
      setMobilityMap(mobilityMap => ({ ...mobilityMap, parkingChargeZones: false }));
    }
  };

  /**
   * Stores previous value
   */
  const prevStreetMaintenancePeriodRef = useRef();

  useEffect(() => {
    prevStreetMaintenancePeriodRef.current = streetMaintenancePeriod;
  }, [streetMaintenancePeriod]);

  const setStreetMaintenancePeriodSelection = (periodType) => {
    setStreetMaintenancePeriod(periodType);
    setMobilityMap(mobilityMap => ({ ...mobilityMap, streetMaintenance: true }));
    if (periodType === prevStreetMaintenancePeriodRef.current) {
      setStreetMaintenancePeriod(null);
      setMobilityMap(mobilityMap => ({ ...mobilityMap, streetMaintenance: false }));
    }
  };

  const streetMaintenanceSelections = [
    {
      type: '1hour',
      msgId: 'mobilityPlatform.menu.streetMaintenance.1hour',
      onChangeValue: setStreetMaintenancePeriodSelection,
    },
    {
      type: '3hours',
      msgId: 'mobilityPlatform.menu.streetMaintenance.3hours',
      onChangeValue: setStreetMaintenancePeriodSelection,
    },
    {
      type: '6hours',
      msgId: 'mobilityPlatform.menu.streetMaintenance.6hours',
      onChangeValue: setStreetMaintenancePeriodSelection,
    },
    {
      type: '12hours',
      msgId: 'mobilityPlatform.menu.streetMaintenance.12hours',
      onChangeValue: setStreetMaintenancePeriodSelection,
    },
    {
      type: '1day',
      msgId: 'mobilityPlatform.menu.streetMaintenance.1day',
      onChangeValue: setStreetMaintenancePeriodSelection,
    },
    {
      type: '3days',
      msgId: 'mobilityPlatform.menu.streetMaintenance.3days',
      onChangeValue: setStreetMaintenancePeriodSelection,
    },
  ];

  /**
   * Control types for different user types
   */
  const walkingControlTypes = [
    {
      type: 'ecoCounterStations',
      msgId: 'mobilityPlatform.menu.showEcoCounter',
      checkedValue: showEcoCounter,
      onChangeValue: ecoCounterStationsToggle,
    },
    {
      type: 'cultureRoutes',
      msgId: 'mobilityPlatform.menu.showCultureRoutes',
      checkedValue: openCultureRouteList,
      onChangeValue: cultureRouteListToggle,
    },
    {
      type: 'markedTrails',
      msgId: 'mobilityPlatform.menu.show.paavoTrails',
      checkedValue: openMarkedTrailsList,
      onChangeValue: markedTrailListToggle,
    },
    {
      type: 'natureTrails',
      msgId: 'mobilityPlatform.menu.show.natureTrails',
      checkedValue: openNatureTrailsList,
      onChangeValue: natureTrailListToggle,
    },
    {
      type: 'fitnessTrails',
      msgId: 'mobilityPlatform.menu.show.fitnessTrails',
      checkedValue: openFitnessTrailsList,
      onChangeValue: fitnessTrailListToggle,
    },
    {
      type: 'publicRestrooms',
      msgId: 'mobilityPlatform.menu.show.publicRestrooms',
      checkedValue: showRestRooms,
      onChangeValue: publicRestroomsToggle,
    },
  ];

  const bicycleControlTypes = [
    {
      type: 'bicycleRoutes',
      msgId: 'mobilityPlatform.menu.showBicycleRoutes',
      checkedValue: openBicycleRouteList,
      onChangeValue: bicycleRouteListToggle,
    },
    {
      type: 'bicycleStands',
      msgId: 'mobilityPlatform.menu.showBicycleStands',
      checkedValue: showBicycleStands,
      onChangeValue: bicycleStandsToggle,
    },
    {
      type: 'cityBikes',
      msgId: 'mobilityPlatform.menu.showCityBikes',
      checkedValue: showCityBikes,
      onChangeValue: cityBikesToggle,
    },
    {
      type: 'bikeServiceStations',
      msgId: 'mobilityPlatform.menu.showBikeServiceStations',
      checkedValue: showBikeServiceStations,
      onChangeValue: bikeServiceStationsToggle,
    },
    {
      type: 'brushSandedRoute',
      msgId: 'mobilityPlatform.menu.show.brushSandedRoute',
      checkedValue: showBrushSandedRoads,
      onChangeValue: brushSandedRouteToggle,
    },
    {
      type: 'brushSaltedRoute',
      msgId: 'mobilityPlatform.menu.show.brushSaltedRoute',
      checkedValue: showBrushSaltedRoads,
      onChangeValue: brushSaltedRouteToggle,
    },
  ];

  const carControlTypes = [
    {
      type: 'rentalCars',
      msgId: 'mobilityPlatform.menu.showRentalCars',
      checkedValue: mobilityMap.rentalCars,
      onChangeValue: rentalCarsToggle,
    },
    {
      type: 'chargingStations',
      msgId: 'mobilityPlatform.menu.showChargingStations',
      checkedValue: mobilityMap.chargingStations,
      onChangeValue: chargingStationsToggle,
    },
    {
      type: 'gasFillingStations',
      msgId: 'mobilityPlatform.menu.showGasFillingStations',
      checkedValue: mobilityMap.gasFillingStations,
      onChangeValue: gasFillingStationsToggle,
    },
    {
      type: 'parkingSpaces',
      msgId: 'mobilityPlatform.menu.showParkingSpaces',
      checkedValue: mobilityMap.parkingSpaces,
      onChangeValue: parkingSpacesToggle,
    },
    {
      type: 'disabledParking',
      msgId: 'mobilityPlatform.menu.show.disabledParking',
      checkedValue: mobilityMap.disabledParking,
      onChangeValue: disabledParkingToggle,
    },
    {
      type: 'parkingChargeZones',
      msgId: 'mobilityPlatform.menu.showParkingChargeZones',
      checkedValue: openParkingChargeZoneList,
      onChangeValue: parkingChargeZonesListToggle,
    },
    {
      type: 'speedLimitZones',
      msgId: 'mobilityPlatform.menu.speedLimitZones.show',
      checkedValue: openSpeedLimitList,
      onChangeValue: speedLimitZonesToggle,
    },
    {
      type: 'loadingPlaces',
      msgId: 'mobilityPlatform.menu.loadingPlaces.show',
      checkedValue: mobilityMap.loadingPlaces,
      onChangeValue: loadingPlacesToggle,
    },
  ];

  const boatingControlTypes = [
    {
      type: 'marinas',
      msgId: 'mobilityPlatform.menu.show.marinas',
      checkedValue: mobilityMap.marinas,
      onChangeValue: marinasToggle,
    },
    {
      type: 'boatParking',
      msgId: 'mobilityPlatform.menu.show.boatParking',
      checkedValue: mobilityMap.boatParking,
      onChangeValue: boatParkingToggle,
    },
    {
      type: 'guestHarbour',
      msgId: 'mobilityPlatform.menu.show.guestHarbour',
      checkedValue: mobilityMap.guestHarbour,
      onChangeValue: guestHarbourToggle,
    },
  ];

  const scooterControlTypes = [
    {
      type: 'scooterProviders',
      msgId: 'mobilityPlatform.menu.show.scooterProviders',
      checkedValue: openScooterProviderList,
      onChangeValue: scooterListToggle,
    },
    {
      type: 'noParking',
      msgId: 'mobilityPlatform.menu.show.scooterNoParking',
      checkedValue: mobilityMap.scooterNoParking,
      onChangeValue: scooterNoParkingToggle,
    },
    {
      type: 'parkingAreas',
      msgId: 'mobilityPlatform.menu.show.scooterParkingAreas',
      checkedValue: mobilityMap.scooterParking,
      onChangeValue: scooterParkingAreasToggle,
    },
    {
      type: 'speedLimitAreas',
      msgId: 'mobilityPlatform.menu.show.scooterSpeedLimitAreas',
      checkedValue: mobilityMap.scooterSpeedLimit,
      onChangeValue: scooterSpeedLimitAreasToggle,
    },
  ];

  const scooterProviders = [
    {
      type: 'scootersRyde',
      msgId: 'mobilityPlatform.menu.show.scootersRyde',
      checkedValue: mobilityMap.scootersRyde,
      onChangeValue: scootersRydeToggle,
    },
  ];

  const streetMaintenanceControlTypes = [
    {
      type: 'streetMaintenanceWorks',
      msgId: 'mobilityPlatform.menu.show.streetMaintenanceWorks',
      checkedValue: openStreetMaintenanceSelectionList,
      onChangeValue: streetMaintenanceListToggle,
    },
  ];

  /**
   * @param {Array} inputData
   * @return {JSX Element}
   */
  const renderBicycleRoutes = (inputData) => {
    const renderData = isDataValid(openBicycleRouteList, inputData);
    return renderData
      ? inputData.slice(0, bicycleRoutesToShow).map(item => (
        <RouteListItem
          key={item.id}
          item={item}
          routeAttr={bicycleRouteName}
          type="BicycleRoute"
          setRouteState={setBicycleRouteState}
        >
          {item.name_fi === bicycleRouteName ? (
            <RouteLength key={item.id} route={item} />
          ) : null}
        </RouteListItem>
      ))
      : null;
  };

  /**
   * @param {Array} inputData
   * @return {JSX Element}
   */
  const renderCultureRoutes = (inputData) => {
    const renderData = isDataValid(openCultureRouteList, inputData);
    return renderData
      ? inputData.slice(0, cultureRoutesToShow).map(item => (
        <RouteListItem
          key={item.id}
          item={item}
          routeAttr={cultureRouteId}
          type="CultureRoute"
          setRouteState={setCultureRouteState}
        >
          {item.id === cultureRouteId ? (
            <Description key={item.name} route={item} currentLocale={locale} />
          ) : null}
        </RouteListItem>
      )) : null;
  };

  const renderSelectTrailText = (visibilityValue, obj, routeList) => {
    const isObjValid = Object.keys(obj).length > 0;
    return (
      <div className={visibilityValue ? classes.border : null}>
        {visibilityValue && !isObjValid ? <EmptyRouteList route={routeList} /> : null}
      </div>
    );
  };

  /**
   * @param {boolean} settingVisibility
   * @param {Array} typeVal
   * @returns {JSX Element}
   */
  const renderSettings = (settingVisibility, typeVal) => {
    if (settingVisibility) {
      return typeVal.map(item => (
        <div key={item.type} className={classes.checkBoxContainer}>
          <FormLabel msgId={item.msgId} checkedValue={item.checkedValue} onChangeValue={item.onChangeValue} />
        </div>
      ));
    }
    return null;
  };

  // Create array of speed limit values from data and remove duplicates
  const speedLimitList = useMemo(
    () => [...new Set(speedLimitZones.map(item => item.extra.speed_limit))],
    [speedLimitZones],
  );

  // Sort in ascending order, because entries can be in random order
  // This list will be displayed for users
  const speedLimitListAsc = speedLimitList.sort((a, b) => a - b);

  const streetMaintenanceInfo = (colorClass, translationId) => (
    <div className={classes.flexBox}>
      <div className={`${classes.box} ${colorClass}`} />
      <div className={classes.marginSm}>
        <Typography variant="body2">{intl.formatMessage({ id: translationId })}</Typography>
      </div>
    </div>
  );

  const renderMaintenanceSelectionList = () => (openStreetMaintenanceSelectionList ? (
    <>
      <div className={`${classes.paragraph} ${classes.border}`}>
        <Typography
          variant="body2"
          aria-label={intl.formatMessage({ id: 'mobilityPlatform.menu.streetMaintenance.info' })}
        >
          {intl.formatMessage({ id: 'mobilityPlatform.menu.streetMaintenance.info' })}
        </Typography>
        <div className={classes.infoText}>
          {streetMaintenanceInfo(classes.blue, 'mobilityPlatform.menu.streetMaintenance.info.snowplow')}
          {streetMaintenanceInfo(classes.purple, 'mobilityPlatform.menu.streetMaintenance.info.deicing')}
          {streetMaintenanceInfo(classes.burgundy, 'mobilityPlatform.menu.streetMaintenance.info.sandRemoval')}
          {streetMaintenanceInfo(classes.green, 'mobilityPlatform.menu.streetMaintenance.info.sanitation')}
        </div>
        {!isActiveStreetMaintenance && streetMaintenancePeriod ? (
          <InfoTextBox infoText="mobilityPlatform.info.streetMaintenance.noActivity" reducePadding />
        ) : null}
      </div>
      {streetMaintenanceSelections
          && streetMaintenanceSelections.length > 0
          && streetMaintenanceSelections.map(item => (
            <div key={item.type} className={classes.checkBoxItem}>
              <FormControlLabel
                control={(
                  <Checkbox
                    checked={item.type === streetMaintenancePeriod}
                    aria-checked={item.type === streetMaintenancePeriod}
                    className={classes.margin}
                    onChange={() => item.onChangeValue(item.type)}
                  />
                )}
                label={(
                  <Typography variant="body2" aria-label={intl.formatMessage({ id: item.msgId })}>
                    {intl.formatMessage({ id: item.msgId })}
                  </Typography>
                )}
              />
            </div>
          ))}
    </>
  ) : null);

  const infoTextsWalking = [
    {
      visible: showEcoCounter,
      type: 'ecoCounterInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.ecoCounter" />,
    },
    {
      visible: openMarkedTrailsList,
      type: 'markedTrailsListInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.markedTrails" />,
    },
    {
      visible: openNatureTrailsList,
      type: 'natureTrailsList',
      component: <InfoTextBox infoText="mobilityPlatform.info.natureTrails" />,
    },
    {
      visible: showRestRooms,
      type: 'publicRestroomsInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.publicRestrooms" />,
    },
  ];

  const infoTextsCycling = [
    {
      visible: showBicycleStands,
      type: 'bicycleStandsInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.bicycleStands" />,
    },
    {
      visible: showCityBikes,
      type: 'cityBikesInfo',
      component: <CityBikeInfo bikeInfo={bikeInfo} />,
    },
    {
      visible: showBrushSaltedRoads || showBrushSandedRoads,
      type: 'brushedRoutes',
      component: <InfoTextBox infoText="mobilityPlatform.info.streetMaintenance.brushedRoads" />,
    },
  ];

  const infoTextsDriving = [
    {
      visible: mobilityMap.rentalCars,
      type: 'rentalCarsInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.rentalCars" />,
    },
    {
      visible: mobilityMap.chargingStations,
      type: 'chargingStationsInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.chargingStations" />,
    },
    {
      visible: mobilityMap.gasFillingStations,
      type: 'gasFillingStationsInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.gasFillingStations" />,
    },
    {
      visible: mobilityMap.parkingSpaces,
      type: 'parkingSpacesInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.parkingSpaces" />,
    },
    {
      visible: mobilityMap.disabledParking,
      type: 'disabledParking',
      component: <InfoTextBox infoText="mobilityPlatform.info.disabledParking" />,
    },
    {
      visible: openParkingChargeZoneList,
      type: 'parkingChargeZoneListInfo',
      component: <ExtendedInfo translations={chargeZoneTranslations} />,
    },
    {
      visible: mobilityMap.loadingPlaces,
      type: 'loadingPlacesInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.loadingPlaces" />,
    },
  ];

  const infoTextsScooter = [
    {
      visible: openScooterProviderList,
      type: 'scooterProviderListInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.scooters.general" />,
    },
    {
      visible: mobilityMap.scooterNoParking,
      type: 'scooterNoParkingInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.scooters.noParking" />,
    },
    {
      visible: mobilityMap.scooterParking,
      type: 'scooterParkingInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.scooters.parkingAreas" />,
    },
    {
      visible: mobilityMap.scooterSpeedLimit,
      type: 'scooterSpeedLimitInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.scooters.speedLimitAreas" />,
    },
  ];

  const infoTextsBoating = [
    {
      visible: mobilityMap.marinas,
      type: 'marinasInfo',
      component: (
        <InfoTextBox
          infoText="mobilityPlatform.info.marinas"
          linkUrl="https://opaskartta.turku.fi/ePermit/fi/Reservation/"
          linkText="mobilityPlatform.info.marinas.link"
        />
      ),
    },
    {
      visible: mobilityMap.boatParking,
      type: 'boatParkingInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.boatParking" />,
    },
    {
      visible: mobilityMap.guestHarbour,
      type: 'guestHarbourInfo',
      component: (
        <InfoTextBox
          infoText="mobilityPlatform.info.guestHarbour"
          linkUrl="https://www.turunvierasvenesatama.fi"
          linkText="mobilityPlatform.info.guestHarbour.link"
        />
      ),
    },
  ];

  const infoTextsSnowplow = [
    {
      visible: mobilityMap.streetMaintenance,
      type: 'snowplowsInfo',
      component: (
        <InfoTextBox
          infoText="mobilityPlatform.info.streetMaintenance.general"
          linkUrl="https://www.turku.fi/uutinen/2021-01-12_pelisaannot-selkeita-katujen-talvikunnossapidossa"
          linkText="mobilityPlatform.info.streetMaintenance.link"
        />
      ),
    },
  ];

  /** Render infotext(s) if visible value is true
   * @param {Array} textData
   * @return {Element}
   */
  const renderInfoTexts = textData => textData.reduce((acc, curr) => {
    if (curr.visible) {
      acc.push(<React.Fragment key={curr.type}>{curr.component}</React.Fragment>);
    }
    return acc;
  }, []);

  /** render section contents */
  const renderWalkSettings = () => (
    <React.Fragment>
      {renderSettings(openWalkSettings, walkingControlTypes)}
      <div className={openCultureRouteList ? classes.border : null}>
        {openCultureRouteList && !cultureRouteId ? <EmptyRouteList route={cultureRouteList} /> : null}
      </div>
      {openCultureRouteList && (locale === 'en' || locale === 'sv')
        ? renderCultureRoutes(localizedCultureRoutes)
        : null}
      {openCultureRouteList && locale === 'fi' ? renderCultureRoutes(cultureRouteList) : null}
      <SliceList
        openList={openCultureRouteList}
        itemsToShow={cultureRoutesToShow}
        routes={locale === 'fi' ? cultureRouteList : localizedCultureRoutes}
        setItemsToShow={setCultureRoutesToShow}
      />
      {renderSelectTrailText(openMarkedTrailsList, markedTrailsObj, markedTrailsList)}
      <TrailList
        openList={openMarkedTrailsList}
        inputData={markedTrailsSorted}
        itemsToShow={markedTrailsToShow}
        trailsObj={markedTrailsObj}
        setTrailState={setMarkedTrailState}
      />
      <SliceList
        openList={openMarkedTrailsList}
        itemsToShow={markedTrailsToShow}
        routes={markedTrailsSorted}
        setItemsToShow={setMarkedTrailsToShow}
      />
      {renderSelectTrailText(openNatureTrailsList, natureTrailsObj, natureTrailsTkuSorted)}
      <TrailList
        openList={openNatureTrailsList}
        inputData={natureTrailsTkuSorted}
        itemsToShow={natureTrailsToShow}
        trailsObj={natureTrailsObj}
        setTrailState={setNatureTrailState}
      />
      <SliceList
        openList={openNatureTrailsList}
        itemsToShow={natureTrailsToShow}
        routes={natureTrailsTkuSorted}
        setItemsToShow={setNatureTrailsToShow}
      />
      {renderSelectTrailText(openFitnessTrailsList, fitnessTrailsObj, fitnessTrailsTkuSorted)}
      <TrailList
        openList={openFitnessTrailsList}
        inputData={fitnessTrailsTkuSorted}
        itemsToShow={fitnessTrailsToShow}
        trailsObj={fitnessTrailsObj}
        setTrailState={setFitnessTrailState}
      />
      <SliceList
        openList={openFitnessTrailsList}
        itemsToShow={fitnessTrailsToShow}
        routes={fitnessTrailsTkuSorted}
        setItemsToShow={setFitnessTrailsToShow}
      />
      {renderInfoTexts(infoTextsWalking)}
    </React.Fragment>
  );

  const renderBicycleSettings = () => (
    <React.Fragment>
      {renderSettings(openBicycleSettings, bicycleControlTypes)}
      <div className={openBicycleRouteList ? classes.border : null}>
        {openBicycleRouteList && !bicycleRouteName ? <EmptyRouteList route={bicycleRouteList} /> : null}
      </div>
      {renderBicycleRoutes(bicycleRouteList)}
      <SliceList
        openList={openBicycleRouteList}
        itemsToShow={bicycleRoutesToShow}
        routes={bicycleRouteList}
        setItemsToShow={setBicycleRoutesToShow}
      />
      {renderInfoTexts(infoTextsCycling)}
    </React.Fragment>
  );

  const renderCarSettings = () => (
    <React.Fragment>
      {renderSettings(openCarSettings, carControlTypes)}
      <ParkingChargeZoneList
        openZoneList={openParkingChargeZoneList}
        parkingChargeZones={parkingChargeZones}
        zoneId={parkingChargeZoneId}
        selectZone={selectParkingChargeZone}
      />
      <SpeedLimitZonesList
        openSpeedLimitList={openSpeedLimitList}
        speedLimitListAsc={speedLimitListAsc}
        speedLimitSelections={speedLimitSelections}
        setState={setSpeedLimitState}
      />
      {renderInfoTexts(infoTextsDriving)}
    </React.Fragment>
  );

  const renderScooterSettings = () => (
    <React.Fragment>
      {renderSettings(openScooterSettings, scooterControlTypes)}
      <ScooterProviderList openList={openScooterProviderList} scooterProviders={scooterProviders} />
      {renderInfoTexts(infoTextsScooter)}
    </React.Fragment>
  );

  const renderBoatingSettings = () => (
    <React.Fragment>
      {renderSettings(openBoatingSettings, boatingControlTypes)}
      {renderInfoTexts(infoTextsBoating)}
    </React.Fragment>
  );

  const renderStreetMaintenanceSettings = () => (
    <React.Fragment>
      {renderSettings(openStreetMaintenanceSettings, streetMaintenanceControlTypes)}
      {renderMaintenanceSelectionList()}
      {renderInfoTexts(infoTextsSnowplow)}
    </React.Fragment>
  );

  const categories = [
    {
      component: renderWalkSettings(),
      title: intl.formatMessage({ id: 'mobilityPlatform.menu.title.walk' }),
      icon: <ReactSVG src={iconWalk} className={classes.icon} />,
      onClick: walkSettingsToggle,
      setState: openWalkSettings,
    },
    {
      component: renderBicycleSettings(),
      title: intl.formatMessage({ id: 'mobilityPlatform.menu.title.bicycle' }),
      icon: <ReactSVG src={iconBicycle} className={classes.icon} />,
      onClick: bicycleSettingsToggle,
      setState: openBicycleSettings,
    },
    {
      component: renderCarSettings(),
      title: intl.formatMessage({ id: 'mobilityPlatform.menu.title.car' }),
      icon: <ReactSVG src={iconCar} className={classes.icon} />,
      onClick: carSettingsToggle,
      setState: openCarSettings,
    },
    {
      component: renderScooterSettings(),
      title: intl.formatMessage({ id: 'mobilityPlatform.menu.title.scooter' }),
      icon: <ReactSVG src={iconScooter} className={classes.icon} />,
      onClick: scooterSettingsToggle,
      setState: openScooterSettings,
    },
    {
      component: renderBoatingSettings(),
      title: intl.formatMessage({ id: 'mobilityPlatform.menu.title.boating' }),
      icon: <ReactSVG src={iconBoat} className={classes.icon} />,
      onClick: boatingSettingsToggle,
      setState: openBoatingSettings,
    },
    {
      component: renderStreetMaintenanceSettings(),
      title: intl.formatMessage({ id: 'mobilityPlatform.menu.title.streetMaintenance' }),
      icon: <ReactSVG src={iconSnowplow} className={classes.icon} />,
      onClick: streetMaintenanceSettingsToggle,
      setState: openStreetMaintenanceSettings,
    },
  ];

  return (
    <div className={classes.content}>
      <TitleBar
        title={intl.formatMessage({ id: 'general.pageTitles.mobilityPlatform.title' })}
        titleComponent="h3"
        backButton
        backButtonOnClick={() => navigator.push('home')}
        className={classes.topBarColor}
      />
      <div className={classes.container}>
        <div className={classes.formControl}>
          <div className={classes.formGroup}>
            <List>
              {categories.map(category => (
                <ListItem key={category.title} divider disableGutters className={`${classes.listItem}`}>
                  <SMAccordion
                    adornment={category.icon}
                    defaultOpen={category.setState}
                    onOpen={() => category.onClick()}
                    isOpen={category.setState}
                    elevated={category.setState}
                    titleContent={(
                      <Typography component="p" variant="subtitle1">
                        {category.title}
                      </Typography>
                    )}
                    collapseContent={category.component}
                  />
                </ListItem>
              ))}
            </List>
          </div>
        </div>
      </div>
    </div>
  );
};

MobilitySettingsView.propTypes = {
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
};

MobilitySettingsView.defaultProps = {
  navigator: null,
};

export default MobilitySettingsView;
