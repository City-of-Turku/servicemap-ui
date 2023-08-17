import {
  Checkbox, FormControlLabel, Typography, List, ListItem,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { Helmet } from 'react-helmet';
import { ReactSVG } from 'react-svg';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import iconBicycle from 'servicemap-ui-turku/assets/icons/icons-icon_bicycle.svg';
import iconBoat from 'servicemap-ui-turku/assets/icons/icons-icon_boating.svg';
import iconCar from 'servicemap-ui-turku/assets/icons/icons-icon_car.svg';
import iconScooter from 'servicemap-ui-turku/assets/icons/icons-icon_scooter.svg';
import iconSnowplow from 'servicemap-ui-turku/assets/icons/icons-icon_street_maintenance.svg';
import iconWalk from 'servicemap-ui-turku/assets/icons/icons-icon_walk.svg';
import iconPublicTransport from 'servicemap-ui-turku/assets/icons/icons-icon_public_transport.svg';
import InfoTextBox from '../../components/MobilityPlatform/InfoTextBox';
import {
  fetchBicycleRouteNames,
  fetchCultureRouteNames,
  fetchMobilityMapData,
} from '../../components/MobilityPlatform/mobilityPlatformRequests/mobilityPlatformRequests';
import useLocaleText from '../../utils/useLocaleText';
import TitleBar from '../../components/TitleBar';
import { useMobilityPlatformContext } from '../../context/MobilityPlatformContext';
import CityBikeInfo from './components/CityBikeInfo';
import EmptyRouteList from './components/EmptyRouteList';
import ExtendedInfo from './components/ExtendedInfo';
import FormLabel from './components/FormLabel';
import TrailList from './components/TrailList';
import ParkingChargeZoneList from './components/ParkingChargeZoneList';
import ScooterProviderList from './components/ScooterProviderList';
import SMAccordion from '../../components/SMAccordion';
import SpeedLimitZonesList from './components/SpeedLimitZonesList';
import RouteList from './components/RouteList';

const MobilitySettingsView = ({ classes, intl, navigator }) => {
  const [pageTitle, setPageTitle] = useState(null);
  const [openWalkSettings, setOpenWalkSettings] = useState(false);
  const [openBicycleSettings, setOpenBicycleSettings] = useState(false);
  const [openCarSettings, setOpenCarSettings] = useState(false);
  const [openBoatingSettings, setOpenBoatingSettings] = useState(false);
  const [openScooterSettings, setOpenScooterSettings] = useState(false);
  const [openStreetMaintenanceSettings, setOpenStreetMaintenanceSettings] = useState(false);
  const [openPublicTransportSettings, setOpenPublicTransportSettings] = useState(false);
  const [openCultureRouteList, setOpenCultureRouteList] = useState(false);
  const [cultureRouteList, setCultureRouteList] = useState([]);
  const [localizedCultureRoutes, setLocalizedCultureRoutes] = useState([]);
  const [bicycleRouteList, setBicycleRouteList] = useState([]);
  const [openBicycleRouteList, setOpenBicycleRouteList] = useState(false);
  const [openSpeedLimitList, setOpenSpeedLimitList] = useState(false);
  const [openParkingChargeZoneList, setOpenParkingChargeZoneList] = useState(false);
  const [openScooterProviderList, setOpenScooterProviderList] = useState(false);
  const [openStreetMaintenanceSelectionList, setOpenStreetMaintenanceSelectionList] = useState(false);
  const [openMarkedTrailsList, setOpenMarkedTrailsList] = useState(false);
  const [markedTrailsList, setMarkedTrailsList] = useState([]);
  const [openNatureTrailsList, setOpenNatureTrailsList] = useState(false);
  const [natureTrailsList, setNatureTrailsList] = useState([]);
  const [openFitnessTrailsList, setOpenFitnessTrailsList] = useState(false);
  const [fitnessTrailsList, setFitnessTrailsList] = useState([]);

  const {
    setOpenMobilityPlatform,
    showTrafficCounter,
    setShowTrafficCounter,
    showBicycleStands,
    setShowBicycleStands,
    showHullLockableStands,
    setShowHullLockableStands,
    showCultureRoutes,
    setShowCultureRoutes,
    cultureRouteId,
    setCultureRouteId,
    showBicycleRoutes,
    setShowBicycleRoutes,
    bicycleRouteName,
    setBicycleRouteName,
    showRentalCars,
    setShowRentalCars,
    showGasFillingStations,
    setShowGasFillingStations,
    showChargingStations,
    setShowChargingStations,
    showParkingSpaces,
    setShowParkingSpaces,
    parkingChargeZones,
    setParkingChargeZones,
    parkingChargeZoneId,
    setParkingChargeZoneId,
    showParkingChargeZones,
    setShowParkingChargeZones,
    showBikeServiceStations,
    setShowBikeServiceStations,
    showCityBikes,
    setShowCityBikes,
    showMarinas,
    setShowMarinas,
    showBoatParking,
    setShowBoatParking,
    showGuestHarbour,
    setShowGuestHarbour,
    showSpeedLimitZones,
    setShowSpeedLimitZones,
    speedLimitSelections,
    setSpeedLimitSelections,
    speedLimitZones,
    setSpeedLimitZones,
    showPublicToilets,
    setShowPublicToilets,
    showScooterNoParking,
    setShowScooterNoParking,
    showScooterParkingAreas,
    setShowScooterParkingAreas,
    showScooterSpeedLimitAreas,
    setShowScooterSpeedLimitAreas,
    showScootersRyde,
    setShowScootersRyde,
    showDisabledParking,
    setShowDisabledParking,
    showLoadingPlaces,
    setShowLoadingPlaces,
    showStreetMaintenance,
    setShowStreetMaintenance,
    streetMaintenancePeriod,
    setStreetMaintenancePeriod,
    isActiveStreetMaintenance,
    showBrushSandedRoute,
    setShowBrushSandedRoute,
    showBrushSaltedRoute,
    setShowBrushSaltedRoute,
    showMarkedTrails,
    setShowMarkedTrails,
    markedTrailsObj,
    setMarkedTrailsObj,
    showNatureTrails,
    setShowNatureTrails,
    natureTrailsObj,
    setNatureTrailsObj,
    showFitnessTrails,
    setShowFitnessTrails,
    fitnessTrailsObj,
    setFitnessTrailsObj,
    showLamCounter,
    setShowLamCounter,
    showParkingMachines,
    setShowParkingMachines,
    showPublicParking,
    setShowPublicParking,
    showOutdoorGymDevices,
    setShowOutdoorGymDevices,
    showCrossWalks,
    setShowCrossWalks,
    showBusStops,
    setShowBusStops,
    showUnderpasses,
    setShowUnderpasses,
    showOverpasses,
    setShowOverpasses,
    showRentalCarParking,
    setShowRentalCarParking,
  } = useMobilityPlatformContext();

  const locale = useSelector(state => state.user.locale);
  const location = useLocation();
  const getLocaleText = useLocaleText();

  const bikeInfo = {
    paragraph1: 'mobilityPlatform.info.cityBikes.paragraph.1',
    paragraph2: 'mobilityPlatform.info.cityBikes.paragraph.2',
    subtitle: 'mobilityPlatform.info.cityBikes.subtitle',
    link: 'mobilityPlatform.info.cityBikes.link',
    apiInfo: 'mobilityPlatform.info.cityBikes.apiInfo',
    url: {
      fi: 'https://www.foli.fi/fi/aikataulut-ja-reitit/f%C3%B6lifillarit',
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

  const boatingReservationLinks = {
    fi: 'https://opaskartta.turku.fi/ePermit/fi/Reservation/',
    en: 'https://opaskartta.turku.fi/ePermit/fi/Reservation/',
    sv: 'https://opaskartta.turku.fi/ePermit/sv/Reservation',
  };

  const guestHarbourLinks = {
    fi: 'https://www.turunvierasvenesatama.fi',
    en: 'https://www.turunvierasvenesatama.fi/en',
    sv: 'https://www.turunvierasvenesatama.fi/sv',
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
    if (openWalkSettings) {
      fetchCultureRouteNames(setCultureRouteList);
    }
  }, [openWalkSettings]);

  useEffect(() => {
    if (openBicycleSettings) {
      fetchBicycleRouteNames(setBicycleRouteList);
    }
  }, [openBicycleSettings]);

  useEffect(() => {
    const options = {
      type_name: 'SpeedLimitZone',
      page_size: 1000,
      latlon: true,
    };
    if (openCarSettings) {
      fetchMobilityMapData(options, setSpeedLimitZones);
    }
  }, [openCarSettings, setSpeedLimitZones]);

  useEffect(() => {
    const options = {
      type_name: 'PaymentZone',
      page_size: 10,
      latlon: true,
    };
    if (openCarSettings) {
      fetchMobilityMapData(options, setParkingChargeZones);
    }
  }, [openCarSettings, setParkingChargeZones]);

  useEffect(() => {
    const options = {
      type_name: 'PaavonPolku',
      latlon: true,
    };
    if (openWalkSettings) {
      fetchMobilityMapData(options, setMarkedTrailsList);
    }
  }, [openWalkSettings]);

  useEffect(() => {
    const options = {
      type_name: 'NatureTrail',
      page_size: 200,
      latlon: true,
    };
    if (openWalkSettings) {
      fetchMobilityMapData(options, setNatureTrailsList);
    }
  }, [openWalkSettings]);

  useEffect(() => {
    const options = {
      type_name: 'FitnessTrail',
      page_size: 200,
      latlon: true,
    };
    if (openWalkSettings) {
      fetchMobilityMapData(options, setFitnessTrailsList);
    }
  }, [openWalkSettings]);

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

  /**
   * Check is visibility boolean values are true
   * This would be so if user has not hid them, but left mobility map before returning
   * @param {boolean} visibility
   * @param {('react').SetStateAction}
   */
  const checkVisibilityValues = (visibility, setSettings) => {
    if (visibility) {
      setSettings(true);
    }
  };

  useEffect(() => {
    checkVisibilityValues(showPublicToilets, setOpenWalkSettings);
    checkVisibilityValues(showOutdoorGymDevices, setOpenWalkSettings);
    checkVisibilityValues(showCrossWalks, setOpenWalkSettings);
    checkVisibilityValues(showUnderpasses, setOpenWalkSettings);
    checkVisibilityValues(showOverpasses, setOpenWalkSettings);
  }, [showPublicToilets, showOutdoorGymDevices, showCrossWalks, showUnderpasses, showOverpasses]);

  useEffect(() => {
    checkVisibilityValues(showTrafficCounter.walking, setOpenWalkSettings);
  }, [showTrafficCounter]);

  useEffect(() => {
    checkVisibilityValues(showTrafficCounter.cycling, setOpenBicycleSettings);
  }, [showTrafficCounter]);

  useEffect(() => {
    checkVisibilityValues(showBicycleStands, setOpenBicycleSettings);
    checkVisibilityValues(showHullLockableStands, setOpenBicycleSettings);
    checkVisibilityValues(showBikeServiceStations, setOpenBicycleSettings);
    checkVisibilityValues(showCityBikes, setOpenBicycleSettings);
  }, [showBicycleStands, showHullLockableStands, showBikeServiceStations, showCityBikes]);

  useEffect(() => {
    checkVisibilityValues(showBicycleRoutes, setOpenBicycleSettings);
    checkVisibilityValues(showBicycleRoutes, setOpenBicycleRouteList);
  }, [showBicycleRoutes]);

  useEffect(() => {
    checkVisibilityValues(showCultureRoutes, setOpenWalkSettings);
    checkVisibilityValues(showCultureRoutes, setOpenCultureRouteList);
  }, [showCultureRoutes]);

  useEffect(() => {
    checkVisibilityValues(showMarkedTrails, setOpenWalkSettings);
    checkVisibilityValues(showMarkedTrails, setOpenMarkedTrailsList);
  }, [showMarkedTrails]);

  useEffect(() => {
    checkVisibilityValues(showNatureTrails, setOpenWalkSettings);
    checkVisibilityValues(showNatureTrails, setOpenNatureTrailsList);
  }, [showNatureTrails]);

  useEffect(() => {
    checkVisibilityValues(showFitnessTrails, setOpenWalkSettings);
    checkVisibilityValues(showFitnessTrails, setOpenFitnessTrailsList);
  }, [showFitnessTrails]);

  useEffect(() => {
    checkVisibilityValues(showBrushSaltedRoute, setOpenBicycleSettings);
    checkVisibilityValues(showBrushSandedRoute, setOpenBicycleSettings);
  }, [showBrushSaltedRoute, showBrushSandedRoute]);

  useEffect(() => {
    checkVisibilityValues(showSpeedLimitZones, setOpenSpeedLimitList);
  }, [showSpeedLimitZones]);

  useEffect(() => {
    checkVisibilityValues(showRentalCars, setOpenCarSettings);
    checkVisibilityValues(showGasFillingStations, setOpenCarSettings);
    checkVisibilityValues(showParkingSpaces, setOpenCarSettings);
    checkVisibilityValues(showChargingStations, setOpenCarSettings);
    checkVisibilityValues(showSpeedLimitZones, setOpenCarSettings);
    checkVisibilityValues(showDisabledParking, setOpenCarSettings);
    checkVisibilityValues(showLoadingPlaces, setOpenCarSettings);
    checkVisibilityValues(showLamCounter, setOpenCarSettings);
    checkVisibilityValues(showParkingMachines, setOpenCarSettings);
    checkVisibilityValues(showPublicParking, setOpenCarSettings);
    checkVisibilityValues(showRentalCarParking, setOpenCarSettings);
  }, [
    showRentalCars,
    showGasFillingStations,
    showParkingSpaces,
    showChargingStations,
    showSpeedLimitZones,
    showDisabledParking,
    showLoadingPlaces,
    showLamCounter,
    showParkingMachines,
    showPublicParking,
    showRentalCarParking,
  ]);

  useEffect(() => {
    checkVisibilityValues(showParkingChargeZones, setOpenCarSettings);
    checkVisibilityValues(showParkingChargeZones, setOpenParkingChargeZoneList);
  }, [showParkingChargeZones]);

  useEffect(() => {
    checkVisibilityValues(showMarinas, setOpenBoatingSettings);
    checkVisibilityValues(showBoatParking, setOpenBoatingSettings);
    checkVisibilityValues(showGuestHarbour, setOpenBoatingSettings);
  }, [showMarinas, showBoatParking, showGuestHarbour]);

  useEffect(() => {
    checkVisibilityValues(showScooterNoParking, setOpenScooterSettings);
    checkVisibilityValues(showScooterParkingAreas, setOpenScooterSettings);
    checkVisibilityValues(showScooterSpeedLimitAreas, setOpenScooterSettings);
  }, [showScooterNoParking, showScooterParkingAreas, showScooterSpeedLimitAreas]);

  useEffect(() => {
    checkVisibilityValues(showScootersRyde, setOpenScooterSettings);
    checkVisibilityValues(showScootersRyde, setOpenScooterProviderList);
  }, [showScootersRyde]);

  useEffect(() => {
    checkVisibilityValues(showStreetMaintenance, setOpenStreetMaintenanceSettings);
    checkVisibilityValues(showStreetMaintenance, setOpenStreetMaintenanceSelectionList);
  }, [showStreetMaintenance]);

  useEffect(() => {
    checkVisibilityValues(showBusStops, setOpenPublicTransportSettings);
  }, [showBusStops]);

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
      setPageTitle(intl.formatMessage({ id: 'mobilityPlatform.menu.title.walk' }));
    }
  };

  const bicycleSettingsToggle = () => {
    setOpenBicycleSettings(current => !current);
    if (!openBicycleSettings) {
      navigator.push('mobilityPlatform', 'cycling');
      setPageTitle(intl.formatMessage({ id: 'mobilityPlatform.menu.title.bicycle' }));
    }
  };

  const carSettingsToggle = () => {
    setOpenCarSettings(current => !current);
    if (!openCarSettings) {
      navigator.push('mobilityPlatform', 'driving');
      setPageTitle(intl.formatMessage({ id: 'mobilityPlatform.menu.title.car' }));
    }
  };

  const publicTransportSettingsToggle = () => {
    setOpenPublicTransportSettings(current => !current);
    if (!openPublicTransportSettings) {
      navigator.push('mobilityPlatform', 'transport');
      setPageTitle(intl.formatMessage({ id: 'mobilityPlatform.menu.title.public.transport' }));
    }
  };

  const boatingSettingsToggle = () => {
    setOpenBoatingSettings(current => !current);
    if (!openBoatingSettings) {
      navigator.push('mobilityPlatform', 'boating');
      setPageTitle(intl.formatMessage({ id: 'mobilityPlatform.menu.title.boating' }));
    }
  };

  const scooterSettingsToggle = () => {
    setOpenScooterSettings(current => !current);
    if (!openScooterSettings) {
      navigator.push('mobilityPlatform', 'scooters');
      setPageTitle(intl.formatMessage({ id: 'mobilityPlatform.menu.title.scooter' }));
    }
  };

  const streetMaintenanceSettingsToggle = () => {
    setOpenStreetMaintenanceSettings(current => !current);
    if (!openStreetMaintenanceSettings) {
      navigator.push('mobilityPlatform', 'snowplows');
      setPageTitle(intl.formatMessage({ id: 'mobilityPlatform.menu.title.streetMaintenance' }));
    }
  };

  /** Reset page title if opened sections have been closed and page title is not initial value */
  useEffect(() => {
    if (
      !openWalkSettings
      && !openBicycleSettings
      && !openCarSettings
      && !openBoatingSettings
      && !openScooterSettings
      && !openStreetMaintenanceSettings
      && !openPublicTransportSettings
      && pageTitle
    ) {
      setPageTitle(null);
    }
  }, [
    openWalkSettings,
    openBicycleSettings,
    openCarSettings,
    openBoatingSettings,
    openScooterSettings,
    openStreetMaintenanceSettings,
    openPublicTransportSettings,
    pageTitle,
  ]);

  /**
   * Toggle function for traffic counter stations that contain data about pedestrians
   * @var {Object} showTrafficCounter
   * @returns {Object} showTrafficCounter
   */
  const trafficCounterStationsToggle = () => {
    if (!showTrafficCounter.walking) {
      setShowTrafficCounter(showTrafficCounter => ({ ...showTrafficCounter, walking: true }));
    } else setShowTrafficCounter(showTrafficCounter => ({ ...showTrafficCounter, walking: false }));
  };

  /**
   * Toggle function for traffic counter stations that contain data about cyclists
   * @var {Object} showTrafficCounter
   * @returns {Object} showTrafficCounter
   */
  const trafficCounterStationsToggleCycling = () => {
    if (!showTrafficCounter.cycling) {
      setShowTrafficCounter(showTrafficCounter => ({ ...showTrafficCounter, cycling: true }));
    } else setShowTrafficCounter(showTrafficCounter => ({ ...showTrafficCounter, cycling: false }));
  };

  /**
   * Toggle functions for content types
   * @var {boolean}
   * @returns {boolean}
   */
  const bicycleStandsToggle = () => {
    setShowBicycleStands(current => !current);
  };

  const hullLockableStandsToggle = () => {
    setShowHullLockableStands(current => !current);
  };

  const lamCounterStationsToggle = () => {
    setShowLamCounter(current => !current);
  };

  const parkingSpacesToggle = () => {
    setShowParkingSpaces(current => !current);
  };

  const rentalCarsToggle = () => {
    setShowRentalCars(current => !current);
  };

  const gasFillingStationsToggle = () => {
    setShowGasFillingStations(current => !current);
  };

  const chargingStationsToggle = () => {
    setShowChargingStations(current => !current);
  };

  const bikeServiceStationsToggle = () => {
    setShowBikeServiceStations(current => !current);
  };

  const cityBikesToggle = () => {
    setShowCityBikes(current => !current);
  };

  const marinasToggle = () => {
    setShowMarinas(current => !current);
  };

  const boatParkingToggle = () => {
    setShowBoatParking(current => !current);
  };

  const guestHarbourToggle = () => {
    setShowGuestHarbour(current => !current);
  };

  const publicToiletsToggle = () => {
    setShowPublicToilets(current => !current);
  };

  const noParkingToggle = () => {
    setShowScooterNoParking(current => !current);
  };

  const parkingAreasToggle = () => {
    setShowScooterParkingAreas(current => !current);
  };

  const parkingMachinesToggle = () => {
    setShowParkingMachines(current => !current);
  };

  const loadingPlacesToggle = () => {
    setShowLoadingPlaces(current => !current);
  };

  const outdoorGymDevicesToggle = () => {
    setShowOutdoorGymDevices(current => !current);
  };

  const crossWalksToggle = () => {
    setShowCrossWalks(current => !current);
  };

  const overPassesToggle = () => {
    setShowOverpasses(current => !current);
  };

  const underPassesToggle = () => {
    setShowUnderpasses(current => !current);
  };

  const scooterSpeedLimitAreasToggle = () => {
    setShowScooterSpeedLimitAreas(current => !current);
  };

  const scooterListToggle = () => {
    setOpenScooterProviderList(current => !current);
    if (showScootersRyde) {
      setShowScootersRyde(false);
    }
  };

  const scootersRydeToggle = () => {
    setShowScootersRyde(current => !current);
  };

  const disabledParkingToggle = () => {
    setShowDisabledParking(current => !current);
  };

  const publicParkingToggle = () => {
    setShowPublicParking(current => !current);
  };

  const rentalCarParkingToggle = () => {
    setShowRentalCarParking(current => !current);
  };

  const busStopsToggle = () => {
    setShowBusStops(current => !current);
  };

  const cultureRouteListToggle = () => {
    setOpenCultureRouteList(current => !current);
    if (cultureRouteId) {
      setCultureRouteId(null);
    }
    if (showCultureRoutes) {
      setShowCultureRoutes(false);
    }
  };

  const bicycleRouteListToggle = () => {
    setOpenBicycleRouteList(current => !current);
    if (bicycleRouteName) {
      setBicycleRouteName(null);
    }
    if (showBicycleRoutes) {
      setShowBicycleRoutes(false);
    }
  };

  const markedTrailListToggle = () => {
    setOpenMarkedTrailsList(current => !current);
    if (markedTrailsObj) {
      setMarkedTrailsObj({});
    }
    if (showMarkedTrails) {
      setShowMarkedTrails(false);
    }
  };

  const natureTrailListToggle = () => {
    setOpenNatureTrailsList(current => !current);
    if (natureTrailsObj) {
      setNatureTrailsObj({});
    }
    if (showNatureTrails) {
      setShowNatureTrails(false);
    }
  };

  const fitnessTrailListToggle = () => {
    setOpenFitnessTrailsList(current => !current);
    if (fitnessTrailsObj) {
      setFitnessTrailsObj({});
    }
    if (showFitnessTrails) {
      setShowFitnessTrails(false);
    }
  };

  const streetMaintenanceListToggle = () => {
    setOpenStreetMaintenanceSelectionList(current => !current);
    if (streetMaintenancePeriod) {
      setStreetMaintenancePeriod(null);
    }
    if (showStreetMaintenance) {
      setShowStreetMaintenance(false);
    }
  };

  const brushSandedRouteToggle = () => {
    setShowBrushSandedRoute(current => !current);
  };

  const brushSaltedRouteToggle = () => {
    setShowBrushSaltedRoute(current => !current);
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
    setShowCultureRoutes(true);
    if (itemId === prevCultureRouteIdRef.current) {
      setCultureRouteId(null);
      setShowCultureRoutes(false);
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
    setShowBicycleRoutes(true);
    if (routeName === prevBicycleRouteNameRef.current) {
      setBicycleRouteName(null);
      setShowBicycleRoutes(false);
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
    setShowMarkedTrails(true);
    if (obj === prevMarkedTrailObjRef.current) {
      setMarkedTrailsObj({});
      setShowMarkedTrails(false);
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
    setShowNatureTrails(true);
    if (obj === prevNatureTrailObjRef.current) {
      setNatureTrailsObj({});
      setShowNatureTrails(false);
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
    setShowFitnessTrails(true);
    if (obj === prevFitnessTrailObjRef.current) {
      setFitnessTrailsObj({});
      setShowFitnessTrails(false);
    }
  };

  const speedLimitZonesToggle = () => {
    setOpenSpeedLimitList(current => !current);
    setShowSpeedLimitZones(current => !current);
    if (speedLimitSelections && speedLimitSelections.length > 0) {
      setSpeedLimitSelections([]);
    }
  };

  const setSpeedLimitState = (limitItem) => {
    if (!speedLimitSelections.includes(limitItem)) {
      setSpeedLimitSelections(speedLimitSelections => [...speedLimitSelections, limitItem]);
      setShowSpeedLimitZones(true);
    } else setSpeedLimitSelections(speedLimitSelections.filter(item => item !== limitItem));
  };

  const parkingChargeZonesListToggle = () => {
    setOpenParkingChargeZoneList(current => !current);
    if (showParkingChargeZones) {
      setShowParkingChargeZones(false);
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
    setShowParkingChargeZones(true);
    if (id === prevParkingChargeZoneIdRef.current) {
      setParkingChargeZoneId(null);
      setShowParkingChargeZones(false);
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
    setShowStreetMaintenance(true);
    if (periodType === prevStreetMaintenancePeriodRef.current) {
      setStreetMaintenancePeriod(null);
      setShowStreetMaintenance(false);
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
      checkedValue: showTrafficCounter.walking,
      onChangeValue: trafficCounterStationsToggle,
    },
    {
      type: 'outdoorGymDevices',
      msgId: 'mobilityPlatform.menu.show.outdoorGymDevices',
      checkedValue: showOutdoorGymDevices,
      onChangeValue: outdoorGymDevicesToggle,
    },
    {
      type: 'crossWalks',
      msgId: 'mobilityPlatform.menu.show.crossWalks',
      checkedValue: showCrossWalks,
      onChangeValue: crossWalksToggle,
    },
    {
      type: 'underPasses',
      msgId: 'mobilityPlatform.menu.show.underPasses',
      checkedValue: showUnderpasses,
      onChangeValue: underPassesToggle,
    },
    {
      type: 'overPasses',
      msgId: 'mobilityPlatform.menu.show.overPasses',
      checkedValue: showOverpasses,
      onChangeValue: overPassesToggle,
    },
    {
      type: 'publicToilets',
      msgId: 'mobilityPlatform.menu.show.publicToilets',
      checkedValue: showPublicToilets,
      onChangeValue: publicToiletsToggle,
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
  ];

  const bicycleControlTypes = [
    {
      type: 'ecoCounterStations',
      msgId: 'mobilityPlatform.menu.showEcoCounter',
      checkedValue: showTrafficCounter.cycling,
      onChangeValue: trafficCounterStationsToggleCycling,
    },
    {
      type: 'bicycleStands',
      msgId: 'mobilityPlatform.menu.showBicycleStands',
      checkedValue: showBicycleStands,
      onChangeValue: bicycleStandsToggle,
    },
    {
      type: 'hullLockableStands',
      msgId: 'mobilityPlatform.menu.show.hullLockableStands',
      checkedValue: showHullLockableStands,
      onChangeValue: hullLockableStandsToggle,
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
      checkedValue: showBrushSandedRoute,
      onChangeValue: brushSandedRouteToggle,
    },
    {
      type: 'brushSaltedRoute',
      msgId: 'mobilityPlatform.menu.show.brushSaltedRoute',
      checkedValue: showBrushSaltedRoute,
      onChangeValue: brushSaltedRouteToggle,
    },
    {
      type: 'bicycleRoutes',
      msgId: 'mobilityPlatform.menu.showBicycleRoutes',
      checkedValue: openBicycleRouteList,
      onChangeValue: bicycleRouteListToggle,
    },
  ];

  const carControlTypes = [
    {
      type: 'lamCounters',
      msgId: 'mobilityPlatform.menu.showEcoCounter',
      checkedValue: showLamCounter,
      onChangeValue: lamCounterStationsToggle,
    },
    {
      type: 'rentalCars',
      msgId: 'mobilityPlatform.menu.showRentalCars',
      checkedValue: showRentalCars,
      onChangeValue: rentalCarsToggle,
    },
    {
      type: 'chargingStations',
      msgId: 'mobilityPlatform.menu.showChargingStations',
      checkedValue: showChargingStations,
      onChangeValue: chargingStationsToggle,
    },
    {
      type: 'gasFillingStations',
      msgId: 'mobilityPlatform.menu.showGasFillingStations',
      checkedValue: showGasFillingStations,
      onChangeValue: gasFillingStationsToggle,
    },
    {
      type: 'parkingSpaces',
      msgId: 'mobilityPlatform.menu.showParkingSpaces',
      checkedValue: showParkingSpaces,
      onChangeValue: parkingSpacesToggle,
    },
    {
      type: 'publicParking',
      msgId: 'mobilityPlatform.menu.show.publicParking',
      checkedValue: showPublicParking,
      onChangeValue: publicParkingToggle,
    },
    {
      type: 'disabledParking',
      msgId: 'mobilityPlatform.menu.show.disabledParking',
      checkedValue: showDisabledParking,
      onChangeValue: disabledParkingToggle,
    },
    {
      type: 'rentalCarParking',
      msgId: 'mobilityPlatform.menu.show.rentalCarParking',
      checkedValue: showRentalCarParking,
      onChangeValue: rentalCarParkingToggle,
    },
    {
      type: 'parkingMachines',
      msgId: 'mobilityPlatform.menu.show.parkingMachines',
      checkedValue: showParkingMachines,
      onChangeValue: parkingMachinesToggle,
    },
    {
      type: 'loadingPlaces',
      msgId: 'mobilityPlatform.menu.loadingPlaces.show',
      checkedValue: showLoadingPlaces,
      onChangeValue: loadingPlacesToggle,
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
  ];

  const publicTransportControlTypes = [
    {
      type: 'busStops',
      msgId: 'mobilityPlatform.menu.show.busStops',
      checkedValue: showBusStops,
      onChangeValue: busStopsToggle,
    },
  ];

  const boatingControlTypes = [
    {
      type: 'marinas',
      msgId: 'mobilityPlatform.menu.show.marinas',
      checkedValue: showMarinas,
      onChangeValue: marinasToggle,
    },
    {
      type: 'boatParking',
      msgId: 'mobilityPlatform.menu.show.boatParking',
      checkedValue: showBoatParking,
      onChangeValue: boatParkingToggle,
    },
    {
      type: 'guestHarbour',
      msgId: 'mobilityPlatform.menu.show.guestHarbour',
      checkedValue: showGuestHarbour,
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
      checkedValue: showScooterNoParking,
      onChangeValue: noParkingToggle,
    },
    {
      type: 'parkingAreas',
      msgId: 'mobilityPlatform.menu.show.scooterParkingAreas',
      checkedValue: showScooterParkingAreas,
      onChangeValue: parkingAreasToggle,
    },
    {
      type: 'speedLimitAreas',
      msgId: 'mobilityPlatform.menu.show.scooterSpeedLimitAreas',
      checkedValue: showScooterSpeedLimitAreas,
      onChangeValue: scooterSpeedLimitAreasToggle,
    },
  ];

  const scooterProviders = [
    {
      type: 'scootersRyde',
      msgId: 'mobilityPlatform.menu.show.scootersRyde',
      checkedValue: showScootersRyde,
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
  const renderBicycleRoutes = inputData => (
    <RouteList
      openList={openBicycleRouteList}
      items={inputData}
      itemsPerPage={5}
      routeAttr={bicycleRouteName}
      type="BicycleRoute"
      setRouteState={setBicycleRouteState}
      locale={locale}
    />
  );

  /**
   * @param {Array} inputData
   * @return {JSX Element}
   */
  const renderCultureRoutes = inputData => (
    <RouteList
      openList={openCultureRouteList}
      items={inputData}
      itemsPerPage={5}
      routeAttr={cultureRouteId}
      type="CultureRoute"
      setRouteState={setCultureRouteState}
      locale={locale}
    />
  );

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
      visible: showTrafficCounter.walking,
      type: 'ecoCounterInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.ecoCounter" />,
    },
    {
      visible: showOutdoorGymDevices,
      type: 'outdoorGymsInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.outdoorGymDevices" />,
    },
    {
      visible: showCrossWalks,
      type: 'crosswalksInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.crosswalks" />,
    },
    {
      visible: showUnderpasses || showOverpasses,
      type: 'underAndOverpassInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.underAndOverpasses" />,
    },
    {
      visible: showPublicToilets,
      type: 'publicRestroomsInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.publicToilets" />,
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
      visible: openFitnessTrailsList,
      type: 'fitnessTrailsList',
      component: <InfoTextBox infoText="mobilityPlatform.info.fitnessTrails" />,
    },
  ];

  const infoTextsCycling = [
    {
      visible: showTrafficCounter.cycling,
      type: 'ecoCounterInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.ecoCounter" />,
    },
    {
      visible: showBicycleStands || showHullLockableStands,
      type: 'bicycleStandsInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.bicycleStands" />,
    },
    {
      visible: showCityBikes,
      type: 'cityBikesInfo',
      component: <CityBikeInfo bikeInfo={bikeInfo} />,
    },
    {
      visible: showBrushSaltedRoute || showBrushSandedRoute,
      type: 'brushedRoutes',
      component: <InfoTextBox infoText="mobilityPlatform.info.streetMaintenance.brushedRoads" />,
    },
  ];

  const infoTextsDriving = [
    {
      visible: showLamCounter,
      type: 'lamCountersInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.lamCounters" />,
    },
    {
      visible: showRentalCars,
      type: 'rentalCarsInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.rentalCars" />,
    },
    {
      visible: showChargingStations,
      type: 'chargingStationsInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.chargingStations" />,
    },
    {
      visible: showGasFillingStations,
      type: 'gasFillingStationsInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.gasFillingStations" />,
    },
    {
      visible: showParkingSpaces,
      type: 'parkingSpacesInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.parkingSpaces" />,
    },
    {
      visible: showPublicParking,
      type: 'publicParkingSpacesInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.publicParkingSpaces" />,
    },
    {
      visible: showDisabledParking,
      type: 'disabledParking',
      component: <InfoTextBox infoText="mobilityPlatform.info.disabledParking" />,
    },
    {
      visible: showRentalCarParking,
      type: 'rentalCarParkingInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.rentalCarParking" />,
    },
    {
      visible: showParkingMachines,
      type: 'parkingMachinesInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.parkingMachines" />,
    },
    {
      visible: showLoadingPlaces,
      type: 'loadingPlacesInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.loadingPlaces" />,
    },
    {
      visible: openParkingChargeZoneList,
      type: 'parkingChargeZoneListInfo',
      component: <ExtendedInfo translations={chargeZoneTranslations} />,
    },
  ];

  const infoTextsScooter = [
    {
      visible: openScooterProviderList,
      type: 'scooterProviderListInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.scooters.general" />,
    },
    {
      visible: showScooterNoParking,
      type: 'scooterNoParkingInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.scooters.noParking" />,
    },
    {
      visible: showScooterParkingAreas,
      type: 'scooterParkingInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.scooters.parkingAreas" />,
    },
    {
      visible: showScooterSpeedLimitAreas,
      type: 'scooterSpeedLimitInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.scooters.speedLimitAreas" />,
    },
  ];

  const infoTextsBoating = [
    {
      visible: showMarinas,
      type: 'marinasInfo',
      component: (
        <InfoTextBox
          infoText="mobilityPlatform.info.marinas"
          linkUrl={getLocaleText(boatingReservationLinks)}
          linkText="mobilityPlatform.info.marinas.link"
        />
      ),
    },
    {
      visible: showBoatParking,
      type: 'boatParkingInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.boatParking" />,
    },
    {
      visible: showGuestHarbour,
      type: 'guestHarbourInfo',
      component: (
        <InfoTextBox
          infoText="mobilityPlatform.info.guestHarbour"
          linkUrl={getLocaleText(guestHarbourLinks)}
          linkText="mobilityPlatform.info.guestHarbour.link"
        />
      ),
    },
  ];

  const infoTextsSnowplow = [
    {
      visible: showStreetMaintenance,
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

  const infoTextsPublicTransport = [
    {
      visible: showBusStops,
      type: 'busStopsInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.busStops" />,
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

  /** Render header */
  const renderHead = () => {
    const title = intl.formatMessage({ id: 'general.pageTitles.mobilityPlatform' });
    const appTitle = intl.formatMessage({ id: 'app.title' });
    return (
      <Helmet>
        <title>{pageTitle ? `${title} - ${pageTitle} | ${appTitle}` : `${title} | ${appTitle}`}</title>
      </Helmet>
    );
  };

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
      {renderSelectTrailText(openMarkedTrailsList, markedTrailsObj, markedTrailsList)}
      <TrailList
        openList={openMarkedTrailsList}
        items={markedTrailsSorted}
        itemsPerPage={5}
        trailsObj={markedTrailsObj}
        setTrailState={setMarkedTrailState}
      />
      {renderSelectTrailText(openNatureTrailsList, natureTrailsObj, natureTrailsTkuSorted)}
      <TrailList
        openList={openNatureTrailsList}
        items={natureTrailsTkuSorted}
        itemsPerPage={5}
        trailsObj={natureTrailsObj}
        setTrailState={setNatureTrailState}
      />
      {renderSelectTrailText(openFitnessTrailsList, fitnessTrailsObj, fitnessTrailsTkuSorted)}
      <TrailList
        openList={openFitnessTrailsList}
        items={fitnessTrailsTkuSorted}
        itemsPerPage={5}
        trailsObj={fitnessTrailsObj}
        setTrailState={setFitnessTrailState}
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

  const renderPublicTransportSettings = () => (
    <React.Fragment>
      {renderSettings(openPublicTransportSettings, publicTransportControlTypes)}
      {renderInfoTexts(infoTextsPublicTransport)}
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
      component: renderPublicTransportSettings(),
      title: intl.formatMessage({ id: 'mobilityPlatform.menu.title.public.transport' }),
      icon: <ReactSVG src={iconPublicTransport} className={classes.icon} />,
      onClick: publicTransportSettingsToggle,
      setState: openPublicTransportSettings,
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
      {renderHead()}
      <TitleBar
        title={intl.formatMessage({ id: 'general.pageTitles.mobilityPlatform' })}
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
