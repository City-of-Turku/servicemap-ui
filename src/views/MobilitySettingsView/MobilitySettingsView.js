import { Typography, List, ListItem } from '@mui/material';
import PropTypes from 'prop-types';
import React, {
  useEffect, useRef, useState,
} from 'react';
import { Helmet } from 'react-helmet';
import { ReactSVG } from 'react-svg';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Air, WarningAmber } from '@mui/icons-material';
import { useTheme } from '@mui/styles';
import { useIntl } from 'react-intl';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
import iconBicycle from 'servicemap-ui-turku/assets/icons/icons-icon_bicycle.svg';
import iconBoat from 'servicemap-ui-turku/assets/icons/icons-icon_boating.svg';
import iconCar from 'servicemap-ui-turku/assets/icons/icons-icon_car.svg';
import iconScooter from 'servicemap-ui-turku/assets/icons/icons-icon_scooter.svg';
import iconSnowplow from 'servicemap-ui-turku/assets/icons/icons-icon_street_maintenance.svg';
import iconWalk from 'servicemap-ui-turku/assets/icons/icons-icon_walk.svg';
import iconPublicTransport from 'servicemap-ui-turku/assets/icons/icons-icon_public_transport.svg';
import iconSkiing from 'servicemap-ui-turku/assets/icons/icons-icon_sports_maintenance.svg';
import InfoTextBox from '../../components/MobilityPlatform/InfoTextBox';
import useMobilityDataFetch from '../../components/MobilityPlatform/utils/useMobilityDataFetch';
import useLocaleText from '../../utils/useLocaleText';
import { useMobilityPlatformContext } from '../../context/MobilityPlatformContext';
import useCultureRouteFetch from './hooks/useCultureRouteFetch';
import useBicycleRouteFetch from './hooks/useBicycleRouteFetch';
import useSpeedLimitZoneFetch from './hooks/useSpeedLimitZoneFetch';
import useParkingChargeZoneFetch from './hooks/useParkingChargeZoneFetch';
import TitleBar from '../../components/TitleBar';
import CityBikeInfo from './components/CityBikeInfo';
import EmptyRouteList from './components/EmptyRouteList';
import ExtendedInfo from './components/ExtendedInfo';
import TrailList from './components/TrailList';
import ParkingChargeZoneList from './components/ParkingChargeZoneList';
import ScooterProviderList from './components/ScooterProviderList';
import SMAccordion from '../../components/SMAccordion';
import SpeedLimitZonesList from './components/SpeedLimitZonesList';
import RouteList from './components/RouteList';
import StreetMaintenanceList from './components/StreetMaintenanceList';
import MobilityToggleButton from './components/MobilityToggleButton';
import AirMonitoringInfo from './components/AirMonitoringInfo';
import SportsFacilitiesMaintenanceList from './components/SportsFacilitiesMaintenanceList';

const MobilitySettingsView = ({ navigator }) => {
  const [pageTitle, setPageTitle] = useState(null);
  const [openWalkSettings, setOpenWalkSettings] = useState(false);
  const [openBicycleSettings, setOpenBicycleSettings] = useState(false);
  const [openCarSettings, setOpenCarSettings] = useState(false);
  const [openBoatingSettings, setOpenBoatingSettings] = useState(false);
  const [openScooterSettings, setOpenScooterSettings] = useState(false);
  const [openStreetMaintenanceSettings, setOpenStreetMaintenanceSettings] = useState(false);
  const [openPublicTransportSettings, setOpenPublicTransportSettings] = useState(false);
  const [openAirMonitoringSettings, setOpenAirMonitoringSettings] = useState(false);
  const [openRoadworkSettings, setOpenRoadworkSettings] = useState(false);
  const [openCultureRouteList, setOpenCultureRouteList] = useState(false);
  const [openBicycleRouteList, setOpenBicycleRouteList] = useState(false);
  const [openSpeedLimitList, setOpenSpeedLimitList] = useState(false);
  const [openParkingChargeZoneList, setOpenParkingChargeZoneList] = useState(false);
  const [openScooterProviderList, setOpenScooterProviderList] = useState(false);
  const [openStreetMaintenanceSelectionList, setOpenStreetMaintenanceSelectionList] = useState(false);
  const [openMarkedTrailsList, setOpenMarkedTrailsList] = useState(false);
  const [openNatureTrailsList, setOpenNatureTrailsList] = useState(false);
  const [openFitnessTrailsList, setOpenFitnessTrailsList] = useState(false);
  const [openSportFacilitiesMaintenanceSettings, setOpenSportFacilitiesMaintenanceSettings] = useState(false);
  const [openSportFacilitiesMaintenanceSelectionList, setOpenSportFacilitiesMaintenanceSelectionList] = useState(false);

  const intl = useIntl();
  const theme = useTheme();

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
    parkingChargeZoneId,
    setParkingChargeZoneId,
    showParkingChargeZones,
    setShowParkingChargeZones,
    showBikeServiceStations,
    setShowBikeServiceStations,
    showCityBikes,
    setShowCityBikes,
    showCargoBikes,
    setShowCargoBikes,
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
    selectedMarkedTrails,
    setSelectedMarkedTrails,
    selectedNatureTrails,
    setSelectedNatureTrails,
    selectedFitnessTrails,
    setSelectedFitnessTrails,
    showParkingMachines,
    setShowParkingMachines,
    showPublicParking,
    setShowPublicParking,
    showOutdoorGymDevices,
    setShowOutdoorGymDevices,
    showCrossWalks,
    setShowCrossWalks,
    showAudibleCrossWalks,
    setShowAudibleCrossWalks,
    showBusStops,
    setShowBusStops,
    showUnderpasses,
    setShowUnderpasses,
    showOverpasses,
    setShowOverpasses,
    showRentalCarParking,
    setShowRentalCarParking,
    showPublicBenches,
    setShowPublicBenches,
    showRoadworks,
    setShowRoadworks,
    showRailwayStations,
    setShowRailwayStations,
    showTaxiStands,
    setshowTaxiStands,
    showAirMonitoringStations,
    setShowAirMonitoringStations,
    showParkAndRideBikes,
    setShowParkAndRideBikes,
    showBarbecuePlaces,
    setShowBarbecuePlaces,
    showAirports,
    setShowAirports,
    showParkingGarages,
    setShowParkingGarages,
    showPortInfo,
    setShowPortInfo,
    showParkAndRideAreas,
    setShowParkAndRideAreas,
    sportsMaintenancePeriod,
    setSportsMaintenancePeriod,
    showSkiTrails,
    setShowSkiTrails,
    showIceTracks,
    setShowIceTracks,
    isActiveSportsMaintenance,
  } = useMobilityPlatformContext();

  const locale = useSelector(state => state.user.locale);
  const location = useLocation();
  const getLocaleText = useLocaleText();

  const showMarkedTrails = selectedMarkedTrails.length > 0;
  const showNatureTrails = selectedNatureTrails.length > 0;
  const showFitnessTrails = selectedFitnessTrails.length > 0;

  const iconClass = css({
    fill: 'rgba(0, 0, 0, 255)',
    width: '40px',
    height: '40px',
    marginRight: theme.spacing(1),
  });

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

  const cargoBikeInfo = {
    paragraph1: 'mobilityPlatform.info.cargoBikes.paragraph.1',
    paragraph2: 'mobilityPlatform.info.cargoBikes.paragraph.2',
    subtitle: 'mobilityPlatform.info.cargoBikes.subtitle',
    link: 'mobilityPlatform.info.cargoBikes.link',
    apiInfo: 'mobilityPlatform.info.cityBikes.apiInfo',
    url: {
      fi: 'https://www.turku.fi/tavarapyorat',
      en: 'https://www.turku.fi/en/cargobikes',
      sv: 'https://www.turku.fi/sv/lastcyklar',
    },
  };

  const airMonitoringTexts = {
    paragraph1: 'mobilityPlatform.info.airMonitoring.paragraph.1',
    paragraph2: 'mobilityPlatform.info.airMonitoring.paragraph.2',
    paragraph3: 'mobilityPlatform.info.airMonitoring.paragraph.3',
    link: 'mobilityPlatform.info.airMonitoring.link',
    url: {
      fi: 'https://www.ilmatieteenlaitos.fi/ilmanlaatu',
      en: 'https://en.ilmatieteenlaitos.fi/air-quality',
      sv: 'https://sv.ilmatieteenlaitos.fi/luftkvalitet',
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

  const { sortedCultureRoutes, sortedLocalizedCultureRoutes } = useCultureRouteFetch(openWalkSettings, locale);
  const { sortedBicycleRoutes } = useBicycleRouteFetch(openBicycleSettings, locale);
  const { speedLimitListAsc } = useSpeedLimitZoneFetch(openCarSettings);
  const { parkingChargeZonesSorted } = useParkingChargeZoneFetch(openCarSettings);

  const optionsPaavoTrails = {
    type_name: 'PaavonPolku',
    latlon: true,
  };

  const optionsNaturetTrails = {
    type_name: 'NatureTrail',
    page_size: 200,
    latlon: true,
  };

  const optionsFitnessTrails = {
    type_name: 'FitnessTrail',
    page_size: 200,
    latlon: true,
  };

  const { data: markedTrailsList } = useMobilityDataFetch(optionsPaavoTrails, openWalkSettings);
  const { data: natureTrailsList } = useMobilityDataFetch(optionsNaturetTrails, openWalkSettings);
  const { data: fitnessTrailsList } = useMobilityDataFetch(optionsFitnessTrails, openWalkSettings);

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
    } else if (location.pathname.includes('weather')) {
      setOpenAirMonitoringSettings(true);
    } else if (location.pathname.includes('roadworks')) {
      setOpenRoadworkSettings(true);
    } else if (location.pathname.includes('sports-facilities')) {
      setOpenSportFacilitiesMaintenanceSettings(true);
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
    checkVisibilityValues(showAudibleCrossWalks, setOpenWalkSettings);
    checkVisibilityValues(showUnderpasses, setOpenWalkSettings);
    checkVisibilityValues(showOverpasses, setOpenWalkSettings);
    checkVisibilityValues(showPublicBenches, setOpenWalkSettings);
    checkVisibilityValues(showBarbecuePlaces, setOpenWalkSettings);
  }, [
    showPublicToilets,
    showOutdoorGymDevices,
    showCrossWalks,
    showAudibleCrossWalks,
    showUnderpasses,
    showOverpasses,
    showPublicBenches,
    showBarbecuePlaces,
  ]);

  useEffect(() => {
    checkVisibilityValues(showTrafficCounter.walking, setOpenWalkSettings);
  }, [showTrafficCounter.walking]);

  useEffect(() => {
    checkVisibilityValues(showTrafficCounter.cycling, setOpenBicycleSettings);
  }, [showTrafficCounter.cycling]);

  useEffect(() => {
    checkVisibilityValues(showTrafficCounter.driving, setOpenCarSettings);
  }, [showTrafficCounter.driving]);

  useEffect(() => {
    checkVisibilityValues(showBicycleStands, setOpenBicycleSettings);
    checkVisibilityValues(showHullLockableStands, setOpenBicycleSettings);
    checkVisibilityValues(showBikeServiceStations, setOpenBicycleSettings);
    checkVisibilityValues(showCityBikes, setOpenBicycleSettings);
    checkVisibilityValues(showCargoBikes, setOpenBicycleSettings);
    checkVisibilityValues(showParkAndRideBikes, setOpenBicycleSettings);
  }, [
    showBicycleStands,
    showHullLockableStands,
    showBikeServiceStations,
    showCityBikes,
    showCargoBikes,
    showParkAndRideBikes,
  ]);

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
    checkVisibilityValues(showParkingMachines, setOpenCarSettings);
    checkVisibilityValues(showPublicParking, setOpenCarSettings);
    checkVisibilityValues(showRentalCarParking, setOpenCarSettings);
    checkVisibilityValues(showParkingGarages, setOpenCarSettings);
    checkVisibilityValues(showParkAndRideAreas, setOpenCarSettings);
  }, [
    showRentalCars,
    showGasFillingStations,
    showParkingSpaces,
    showChargingStations,
    showSpeedLimitZones,
    showDisabledParking,
    showLoadingPlaces,
    showParkingMachines,
    showPublicParking,
    showRentalCarParking,
    showParkingGarages,
    showParkAndRideAreas,
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
    checkVisibilityValues(showRailwayStations, setOpenPublicTransportSettings);
    checkVisibilityValues(showAirports, setOpenPublicTransportSettings);
    checkVisibilityValues(showPortInfo, setOpenPublicTransportSettings);
    checkVisibilityValues(showTaxiStands, setOpenPublicTransportSettings);
  }, [showBusStops, showRailwayStations, showAirports, showPortInfo, showTaxiStands]);

  useEffect(() => {
    checkVisibilityValues(showAirMonitoringStations, setOpenAirMonitoringSettings);
  }, [showAirMonitoringStations]);

  useEffect(() => {
    checkVisibilityValues(showRoadworks, setOpenRoadworkSettings);
  }, [showRoadworks]);

  useEffect(() => {
    checkVisibilityValues(showSkiTrails, setOpenSportFacilitiesMaintenanceSettings);
    checkVisibilityValues(showIceTracks, setOpenSportFacilitiesMaintenanceSettings);
  }, [showSkiTrails, showIceTracks]);

  const nameKeys = {
    fi: 'name',
    en: 'name_en',
    sv: 'name_sv',
  };

  const sortMarkedTrails = data => {
    if (data && data.length > 0) {
      return data.sort((a, b) => a[nameKeys[locale]].split(': ').slice(-1)[0].localeCompare(b[nameKeys[locale]].split(': ').slice(-1)[0]));
    }
    return [];
  };

  const markedTrailsSorted = sortMarkedTrails(markedTrailsList);

  const sortTrails = data => {
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

  const airMonitoringSettingsToggle = () => {
    setOpenAirMonitoringSettings(current => !current);
    if (!openAirMonitoringSettings) {
      navigator.push('mobilityPlatform', 'weather');
      setPageTitle(intl.formatMessage({ id: 'mobilityPlatform.menu.title.airMonitoring' }));
    }
  };

  const roadworkSettingsToggle = () => {
    setOpenRoadworkSettings(current => !current);
    if (!openRoadworkSettings) {
      navigator.push('mobilityPlatform', 'roadworks');
      setPageTitle(intl.formatMessage({ id: 'mobilityPlatform.menu.title.roadworksMain' }));
    }
  };

  const sportFacilitiesMaintenanceSettingsToggle = () => {
    setOpenSportFacilitiesMaintenanceSettings(current => !current);
    if (!openSportFacilitiesMaintenanceSettings) {
      navigator.push('mobilityPlatform', 'sports-facilities');
      setPageTitle(intl.formatMessage({ id: 'mobilityPlatform.menu.title.sportFacilitiesMain' }));
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
      && !openAirMonitoringSettings
      && !openRoadworkSettings
      && !openSportFacilitiesMaintenanceSettings
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
    openAirMonitoringSettings,
    openRoadworkSettings,
    openSportFacilitiesMaintenanceSettings,
    pageTitle,
  ]);

  /**
   * General function to update object values into state
   * @param {*string} key
   * @param {*Object} state
   * @param {*function} setState
   */
  const toggleObjectValue = (key, state, setState) => {
    setState(prevState => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  /**
   * Toggle function for traffic counter stations that contain data about pedestrians
   * @var {Object} showTrafficCounter
   * @returns {Object} showTrafficCounter
   */
  const trafficCounterStationsToggle = () => {
    toggleObjectValue('walking', showTrafficCounter, setShowTrafficCounter);
  };

  /**
   * Toggle function for traffic counter stations that contain data about cyclists
   * @var {Object} showTrafficCounter
   * @returns {Object} showTrafficCounter
   */
  const trafficCounterStationsToggleCycling = () => {
    toggleObjectValue('cycling', showTrafficCounter, setShowTrafficCounter);
  };

  /**
   * Toggle function for traffic counter stations that contain data about cars
   * @var {Object} showTrafficCounter
   * @returns {Object} showTrafficCounter
   */
  const trafficCounterStationsToggleDriving = () => {
    toggleObjectValue('driving', showTrafficCounter, setShowTrafficCounter);
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

  const cargoBikesToggle = () => {
    setShowCargoBikes(current => !current);
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

  const publicBenchesToggle = () => {
    setShowPublicBenches(current => !current);
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

  const audibleCrossWalksToggle = () => {
    setShowAudibleCrossWalks(current => !current);
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

  const parkAndRideAreasToggle = () => {
    setShowParkAndRideAreas(current => !current);
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

  const airMonitoringStationsToggle = () => {
    setShowAirMonitoringStations(current => !current);
  };

  const busStopsToggle = () => {
    setShowBusStops(current => !current);
  };

  const railwayStationsToggle = () => {
    setShowRailwayStations(current => !current);
  };

  const airPortsToggle = () => {
    setShowAirports(current => !current);
  };

  const portInfoToggle = () => {
    setShowPortInfo(current => !current);
  };

  const taxiStationsToggle = () => {
    setshowTaxiStands(current => !current);
  };

  const roadWorksToggle = () => {
    setShowRoadworks(current => !current);
  };

  const parkAndRideBikesToggle = () => {
    setShowParkAndRideBikes(current => !current);
  };

  const barbecuePlacesToggle = () => {
    setShowBarbecuePlaces(current => !current);
  };

  const parkingGaragesToggle = () => {
    setShowParkingGarages(current => !current);
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
    if (selectedMarkedTrails.length) {
      setSelectedMarkedTrails([]);
    }
  };

  const natureTrailListToggle = () => {
    setOpenNatureTrailsList(current => !current);
    if (selectedNatureTrails.length) {
      setSelectedNatureTrails([]);
    }
  };

  const fitnessTrailListToggle = () => {
    setOpenFitnessTrailsList(current => !current);
    if (selectedFitnessTrails.length) {
      setSelectedFitnessTrails([]);
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

  const sportFacilitiesMaintenanceListToggle = () => {
    if (openSportFacilitiesMaintenanceSettings) {
      setOpenSportFacilitiesMaintenanceSelectionList(true);
    }
    if (sportsMaintenancePeriod) {
      setSportsMaintenancePeriod(null);
    }
  };

  const skiTrailsToggle = () => {
    setShowSkiTrails(current => !current);
    sportFacilitiesMaintenanceListToggle();
  };

  const iceTracksToggle = () => {
    setShowIceTracks(current => !current);
    sportFacilitiesMaintenanceListToggle();
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
  const setCultureRouteState = itemId => {
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
  const setBicycleRouteState = routeName => {
    setBicycleRouteName(routeName);
    setShowBicycleRoutes(true);
    if (routeName === prevBicycleRouteNameRef.current) {
      setBicycleRouteName(null);
      setShowBicycleRoutes(false);
    }
  };

  const hasTrailBeenSelected = (trailsData, id) => trailsData.some(item => item.id === id);

  /**
   * Update an array of objects containing selected marked trails.
   * @param {obj}
   */
  const setMarkedTrailState = obj => {
    const hasTrail = hasTrailBeenSelected(selectedMarkedTrails, obj.id);
    if (hasTrail) {
      setSelectedMarkedTrails(prevState => prevState.filter(trail => trail.id !== obj.id));
    } else {
      setSelectedMarkedTrails(prevState => [...prevState, obj]);
    }
  };

  /**
   * Update an array of objects containing selected nature trails.
   * @param {obj}
   */
  const setNatureTrailState = obj => {
    const hasTrail = hasTrailBeenSelected(selectedNatureTrails, obj.id);
    if (hasTrail) {
      setSelectedNatureTrails(prevState => prevState.filter(trail => trail.id !== obj.id));
    } else {
      setSelectedNatureTrails(prevState => [...prevState, obj]);
    }
  };

  /**
   * Update an array of objects containing selected fitness trails.
   * @param {obj}
   */
  const setFitnessTrailState = obj => {
    const hasTrail = hasTrailBeenSelected(selectedFitnessTrails, obj.id);
    if (hasTrail) {
      setSelectedFitnessTrails(prevState => prevState.filter(trail => trail.id !== obj.id));
    } else {
      setSelectedFitnessTrails(prevState => [...prevState, obj]);
    }
  };

  const speedLimitZonesToggle = () => {
    setOpenSpeedLimitList(current => !current);
    setShowSpeedLimitZones(current => !current);
    if (speedLimitSelections && speedLimitSelections.length > 0) {
      setSpeedLimitSelections([]);
    }
  };

  const setSpeedLimitState = limitItem => {
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
  const selectParkingChargeZone = id => {
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

  const setStreetMaintenancePeriodSelection = periodType => {
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
      msgId: 'mobilityPlatform.menu.maintenance.1hour',
      onChangeValue: setStreetMaintenancePeriodSelection,
    },
    {
      type: '3hours',
      msgId: 'mobilityPlatform.menu.maintenance.3hours',
      onChangeValue: setStreetMaintenancePeriodSelection,
    },
    {
      type: '6hours',
      msgId: 'mobilityPlatform.menu.maintenance.6hours',
      onChangeValue: setStreetMaintenancePeriodSelection,
    },
    {
      type: '12hours',
      msgId: 'mobilityPlatform.menu.maintenance.12hours',
      onChangeValue: setStreetMaintenancePeriodSelection,
    },
    {
      type: '1day',
      msgId: 'mobilityPlatform.menu.maintenance.1day',
      onChangeValue: setStreetMaintenancePeriodSelection,
    },
    {
      type: '3days',
      msgId: 'mobilityPlatform.menu.maintenance.3days',
      onChangeValue: setStreetMaintenancePeriodSelection,
    },
  ];

  /**
   * Stores previous value
   */
  const prevSportsMaintenancePeriodRef = useRef();

  useEffect(() => {
    prevSportsMaintenancePeriodRef.current = sportsMaintenancePeriod;
  }, [sportsMaintenancePeriod]);

  const setSportsMaintenancePeriodSelection = periodType => {
    setSportsMaintenancePeriod(periodType);
    setOpenSportFacilitiesMaintenanceSettings(true);
    if (periodType === prevSportsMaintenancePeriodRef.current) {
      setSportsMaintenancePeriod(null);
      setOpenSportFacilitiesMaintenanceSettings(false);
    }
  };

  /**
   * For ice tracks: only show 1day and over3days
   * For ski trails: show all three options (1day, 3days, over3days)
   * When both are selected: show all three options
   */
  const sportsFacilitiesMaintenanceSelections = [
    {
      type: '1day',
      msgId: 'mobilityPlatform.menu.maintenance.1day',
      onChangeValue: setSportsMaintenancePeriodSelection,
    },
    ...(showSkiTrails ? [{
      type: '3days',
      msgId: 'mobilityPlatform.menu.maintenance.3days',
      onChangeValue: setSportsMaintenancePeriodSelection,
    }] : []),
    {
      type: 'over3days',
      msgId: 'mobilityPlatform.menu.maintenance.over3days',
      onChangeValue: setSportsMaintenancePeriodSelection,
    },
  ];

  /**
   * Control types for different user types
   */
  const walkingControlTypes = [
    {
      type: 'counterStationsPedestrian',
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
      type: 'audibleCrossWalks',
      msgId: 'mobilityPlatform.menu.show.audibleCrossWalks',
      checkedValue: showAudibleCrossWalks,
      onChangeValue: audibleCrossWalksToggle,
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
      type: 'publicBenches',
      msgId: 'mobilityPlatform.menu.show.publicBenches',
      checkedValue: showPublicBenches,
      onChangeValue: publicBenchesToggle,
    },
    {
      type: 'barbecuePlaces',
      msgId: 'mobilityPlatform.menu.show.barbecuePlaces',
      checkedValue: showBarbecuePlaces,
      onChangeValue: barbecuePlacesToggle,
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
      type: 'counterStationsCyclist',
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
      type: 'cargoBikes',
      msgId: 'mobilityPlatform.menu.show.cargoBikes',
      checkedValue: showCargoBikes,
      onChangeValue: cargoBikesToggle,
    },
    {
      type: 'bikeServiceStations',
      msgId: 'mobilityPlatform.menu.showBikeServiceStations',
      checkedValue: showBikeServiceStations,
      onChangeValue: bikeServiceStationsToggle,
    },
    {
      type: 'parkAndRideBikeStops',
      msgId: 'mobilityPlatform.menu.show.parkAndRideBikes',
      checkedValue: showParkAndRideBikes,
      onChangeValue: parkAndRideBikesToggle,
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
      type: 'counterStationsDrivers',
      msgId: 'mobilityPlatform.menu.showEcoCounter',
      checkedValue: showTrafficCounter.driving,
      onChangeValue: trafficCounterStationsToggleDriving,
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
      type: 'parkAndRideAreas',
      msgId: 'mobilityPlatform.menu.showparkAndRideAreas',
      checkedValue: showParkAndRideAreas,
      onChangeValue: parkAndRideAreasToggle,
    },
    {
      type: 'parkingGarages',
      msgId: 'mobilityPlatform.menu.show.parkingGarages',
      checkedValue: showParkingGarages,
      onChangeValue: parkingGaragesToggle,
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
    {
      type: 'railwayStations',
      msgId: 'mobilityPlatform.menu.show.railwayStations',
      checkedValue: showRailwayStations,
      onChangeValue: railwayStationsToggle,
    },
    {
      type: 'airPorts',
      msgId: 'mobilityPlatform.menu.show.airPorts',
      checkedValue: showAirports,
      onChangeValue: airPortsToggle,
    },
    {
      type: 'portInfo',
      msgId: 'mobilityPlatform.menu.show.portInfo',
      checkedValue: showPortInfo,
      onChangeValue: portInfoToggle,
    },
    {
      type: 'taxiStands',
      msgId: 'mobilityPlatform.menu.show.taxiStands',
      checkedValue: showTaxiStands,
      onChangeValue: taxiStationsToggle,
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

  const airMonitoringControlTypes = [
    {
      type: 'airMonitoringStations',
      msgId: 'mobilityPlatform.menu.show.airMonitoring',
      checkedValue: showAirMonitoringStations,
      onChangeValue: airMonitoringStationsToggle,
    },
  ];

  const roadworksControlTypes = [
    {
      type: 'roadworks',
      msgId: 'mobilityPlatform.menu.show.roadworks',
      checkedValue: showRoadworks,
      onChangeValue: roadWorksToggle,
    },
  ];

  const sportFacilitiesMaintenanceControlTypes = [
    {
      type: 'skiTrails',
      msgId: 'mobilityPlatform.menu.show.skiTrails',
      checkedValue: showSkiTrails,
      onChangeValue: skiTrailsToggle,
    },
    {
      type: 'iceSkating',
      msgId: 'mobilityPlatform.menu.show.iceSkating',
      checkedValue: showIceTracks,
      onChangeValue: iceTracksToggle,
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
    />
  );

  const renderSelectTrailText = (visibilityValue, obj, routeList) => {
    const isObjValid = Object.keys(obj).length > 0;
    return (
      <StyledBorderBottom isVisible={visibilityValue}>
        {visibilityValue && !isObjValid ? <EmptyRouteList route={routeList} /> : null}
      </StyledBorderBottom>
    );
  };

  /**
   * @param {boolean} settingVisibility
   * @param {Array} typeVal
   * @returns {JSX Element}
   */
  const renderSettings = (settingVisibility, settingsData) => {
    if (settingVisibility) {
      return settingsData.map(item => (
        <StyledCheckBoxContainer key={item.type}>
          <MobilityToggleButton
            msgId={item.msgId}
            checkedValue={item.checkedValue}
            onChangeValue={item.onChangeValue}
            selectionSize={settingsData.length}
          />
        </StyledCheckBoxContainer>
      ));
    }
    return null;
  };

  const renderMaintenanceSelectionList = () => (
    <StreetMaintenanceList
      openStreetMaintenanceList={openStreetMaintenanceSelectionList}
      isActive={isActiveStreetMaintenance}
      streetMaintenancePeriod={streetMaintenancePeriod}
      streetMaintenanceSelections={streetMaintenanceSelections}
    />
  );

  const renderSportsFacilityMaintenanceSelectionList = () => (
    <SportsFacilitiesMaintenanceList
      openSportsFacilitiesMaintenanceList={openSportFacilitiesMaintenanceSelectionList}
      isActive={isActiveSportsMaintenance}
      maintenancePeriod={sportsMaintenancePeriod}
      maintenanceSelections={sportsFacilitiesMaintenanceSelections}
    />
  );

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
      visible: showAudibleCrossWalks,
      type: 'audibleCrosswalksInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.audibleCrosswalks" />,
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
      visible: showPublicBenches,
      type: 'publicBenchesInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.publicBenches" />,
    },
    {
      visible: showBarbecuePlaces,
      type: 'barbecuePlacesInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.barbecuePlaces" />,
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
      visible: showCargoBikes,
      type: 'cargoBikesInfo',
      component: <CityBikeInfo bikeInfo={cargoBikeInfo} />,
    },
    {
      visible: showParkAndRideBikes,
      type: 'parkAndRideBicyclesInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.parkAndRideBicycles" />,
    },
    {
      visible: showBrushSaltedRoute || showBrushSandedRoute,
      type: 'brushedRoutes',
      component: <InfoTextBox infoText="mobilityPlatform.info.streetMaintenance.brushedRoads" />,
    },
  ];

  const infoTextsDriving = [
    {
      visible: showTrafficCounter.driving,
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
      visible: showParkAndRideAreas,
      type: 'parkAndRideAreasInfo',
      component: (
        <InfoTextBox
          infoText="mobilityPlatform.info.parkAndRide"
          linkUrl="https://www.turku.fi/liityntapysakointi"
          linkText="mobilityPlatform.info.parkAndRide.link"
        />
      ),
    },
    {
      visible: showParkingGarages,
      type: 'parkingGaragesInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.parkingGarages" />,
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
    {
      visible: showRailwayStations,
      type: 'railwayStationsInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.railwayStations" />,
    },
    {
      visible: showAirports,
      type: 'airportInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.airport" />,
    },
    {
      visible: showPortInfo,
      type: 'portInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.portInfo" />,
    },
    {
      visible: showTaxiStands,
      type: 'taxiStationsInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.taxiStands" />,
    },
  ];

  const infoTextsRoadworks = [
    {
      visible: showRoadworks,
      type: 'roadworksInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.roadworks" />,
    },
  ];

  const infoTextsSportFacilities = [
    {
      visible: showSkiTrails,
      type: 'skiTrailsInfo',
      component: <InfoTextBox infoText="mobilityPlatform.info.skiTrails" />,
    },
  ];

  const infoTextsWeatherObservations = [
    {
      visible: showAirMonitoringStations,
      type: 'airMonitoringInfo',
      component: <AirMonitoringInfo infoTexts={airMonitoringTexts} />,
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
    <>
      {renderSettings(openWalkSettings, walkingControlTypes)}
      <StyledBorderBottom isVisible={openCultureRouteList}>
        {openCultureRouteList && !cultureRouteId ? <EmptyRouteList route={sortedCultureRoutes} /> : null}
      </StyledBorderBottom>
      {openCultureRouteList && (locale === 'en' || locale === 'sv')
        ? renderCultureRoutes(sortedLocalizedCultureRoutes)
        : null}
      {openCultureRouteList && locale === 'fi' ? renderCultureRoutes(sortedCultureRoutes) : null}
      {renderSelectTrailText(openMarkedTrailsList, selectedMarkedTrails, markedTrailsList)}
      <TrailList
        openList={openMarkedTrailsList}
        items={markedTrailsSorted}
        itemsPerPage={5}
        selectedTrails={selectedMarkedTrails}
        setTrailState={setMarkedTrailState}
      />
      {renderSelectTrailText(openNatureTrailsList, selectedNatureTrails, natureTrailsTkuSorted)}
      <TrailList
        openList={openNatureTrailsList}
        items={natureTrailsTkuSorted}
        itemsPerPage={5}
        selectedTrails={selectedNatureTrails}
        setTrailState={setNatureTrailState}
      />
      {renderSelectTrailText(openFitnessTrailsList, selectedFitnessTrails, fitnessTrailsTkuSorted)}
      <TrailList
        openList={openFitnessTrailsList}
        items={fitnessTrailsTkuSorted}
        itemsPerPage={5}
        selectedTrails={selectedFitnessTrails}
        setTrailState={setFitnessTrailState}
      />
      {renderInfoTexts(infoTextsWalking)}
    </>
  );

  const renderBicycleSettings = () => (
    <>
      {renderSettings(openBicycleSettings, bicycleControlTypes)}
      <StyledBorderBottom isVisible={openBicycleRouteList}>
        {openBicycleRouteList && !bicycleRouteName ? <EmptyRouteList route={sortedBicycleRoutes} /> : null}
      </StyledBorderBottom>
      {renderBicycleRoutes(sortedBicycleRoutes)}
      {renderInfoTexts(infoTextsCycling)}
    </>
  );

  const renderCarSettings = () => (
    <>
      {renderSettings(openCarSettings, carControlTypes)}
      <ParkingChargeZoneList
        openZoneList={openParkingChargeZoneList}
        parkingChargeZones={parkingChargeZonesSorted}
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
    </>
  );

  const renderScooterSettings = () => (
    <>
      {renderSettings(openScooterSettings, scooterControlTypes)}
      <ScooterProviderList openList={openScooterProviderList} scooterProviders={scooterProviders} />
      {renderInfoTexts(infoTextsScooter)}
    </>
  );

  const renderBoatingSettings = () => (
    <>
      {renderSettings(openBoatingSettings, boatingControlTypes)}
      {renderInfoTexts(infoTextsBoating)}
    </>
  );

  const renderStreetMaintenanceSettings = () => (
    <>
      {renderSettings(openStreetMaintenanceSettings, streetMaintenanceControlTypes)}
      {renderMaintenanceSelectionList()}
      {renderInfoTexts(infoTextsSnowplow)}
    </>
  );

  const renderPublicTransportSettings = () => (
    <>
      {renderSettings(openPublicTransportSettings, publicTransportControlTypes)}
      {renderInfoTexts(infoTextsPublicTransport)}
    </>
  );

  const renderAirMonitoringSettings = () => (
    <>
      {renderSettings(openAirMonitoringSettings, airMonitoringControlTypes)}
      {renderInfoTexts(infoTextsWeatherObservations)}
    </>
  );

  /**
   * Render MUI icons inside a container
   * @param {*} icon
   * @returns JSX Element
   */
  const renderIcon = icon => <StyledIconContainer>{icon}</StyledIconContainer>;

  const renderRoadworkSettings = () => (
    <>
      {renderSettings(openRoadworkSettings, roadworksControlTypes)}
      {renderInfoTexts(infoTextsRoadworks)}
    </>
  );

  const renderSportFacilitiesMaintenanceSettings = () => (
    <>
      {renderSettings(openSportFacilitiesMaintenanceSettings, sportFacilitiesMaintenanceControlTypes)}
      {renderInfoTexts(infoTextsSportFacilities)}
      {renderSportsFacilityMaintenanceSelectionList()}
    </>
  );

  const categories = [
    {
      component: renderWalkSettings(),
      title: intl.formatMessage({ id: 'mobilityPlatform.menu.title.walk' }),
      icon: <ReactSVG src={iconWalk} className={iconClass} />,
      onClick: walkSettingsToggle,
      setState: openWalkSettings,
    },
    {
      component: renderBicycleSettings(),
      title: intl.formatMessage({ id: 'mobilityPlatform.menu.title.bicycle' }),
      icon: <ReactSVG src={iconBicycle} className={iconClass} />,
      onClick: bicycleSettingsToggle,
      setState: openBicycleSettings,
    },
    {
      component: renderCarSettings(),
      title: intl.formatMessage({ id: 'mobilityPlatform.menu.title.car' }),
      icon: <ReactSVG src={iconCar} className={iconClass} />,
      onClick: carSettingsToggle,
      setState: openCarSettings,
    },
    {
      component: renderPublicTransportSettings(),
      title: intl.formatMessage({ id: 'mobilityPlatform.menu.title.public.transport' }),
      icon: <ReactSVG src={iconPublicTransport} className={iconClass} />,
      onClick: publicTransportSettingsToggle,
      setState: openPublicTransportSettings,
    },
    {
      component: renderScooterSettings(),
      title: intl.formatMessage({ id: 'mobilityPlatform.menu.title.scooter' }),
      icon: <ReactSVG src={iconScooter} className={iconClass} />,
      onClick: scooterSettingsToggle,
      setState: openScooterSettings,
    },
    {
      component: renderBoatingSettings(),
      title: intl.formatMessage({ id: 'mobilityPlatform.menu.title.boating' }),
      icon: <ReactSVG src={iconBoat} className={iconClass} />,
      onClick: boatingSettingsToggle,
      setState: openBoatingSettings,
    },
    {
      component: renderStreetMaintenanceSettings(),
      title: intl.formatMessage({ id: 'mobilityPlatform.menu.title.streetMaintenance' }),
      icon: <ReactSVG src={iconSnowplow} className={iconClass} />,
      onClick: streetMaintenanceSettingsToggle,
      setState: openStreetMaintenanceSettings,
    },
    {
      component: renderAirMonitoringSettings(),
      title: intl.formatMessage({ id: 'mobilityPlatform.menu.title.airMonitoring' }),
      icon: renderIcon(<Air fontSize="large" />),
      onClick: airMonitoringSettingsToggle,
      setState: openAirMonitoringSettings,
    },
    {
      component: renderRoadworkSettings(),
      title: intl.formatMessage({ id: 'mobilityPlatform.menu.title.roadworksMain' }),
      icon: renderIcon(<WarningAmber fontSize="large" />),
      onClick: roadworkSettingsToggle,
      setState: openRoadworkSettings,
    },
    {
      component: renderSportFacilitiesMaintenanceSettings(),
      title: intl.formatMessage({ id: 'mobilityPlatform.menu.title.sportFacilitiesMain' }),
      icon: <ReactSVG src={iconSkiing} className={iconClass} />,
      onClick: sportFacilitiesMaintenanceSettingsToggle,
      setState: openSportFacilitiesMaintenanceSettings,
    },
  ];

  return (
    <div>
      {renderHead()}
      <TitleBar
        title={intl.formatMessage({ id: 'general.pageTitles.mobilityPlatform' })}
        titleComponent="h3"
        backButton
        backButtonOnClick={() => navigator.push('home')}
      />
      <StyledTextContainer>
        <Typography variant="body2">
          {intl.formatMessage({ id: 'home.buttons.mobilityPlatformSettings' })}
        </Typography>
      </StyledTextContainer>
      <div>
        <StyledListContainer>
          <StyledListMargin>
            <List>
              {categories.map(category => (
                <ListItem key={category.title} divider disableGutters style={{ padding: '0px' }}>
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
          </StyledListMargin>
        </StyledListContainer>
      </div>
    </div>
  );
};

const StyledCheckBoxContainer = styled.div(({ theme }) => ({
  width: '100%',
  backgroundColor: 'rgb(250, 250, 250)',
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
}));

const StyledIconContainer = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '40px',
  height: '40px',
  marginRight: theme.spacing(1),
}));

const StyledListContainer = styled.div(() => ({
  width: '100%',
}));

const StyledListMargin = styled.div(() => ({
  marginTop: '0',
}));

const StyledTextContainer = styled.div(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
  paddingTop: theme.spacing(1),
  color: '#fff',
  textAlign: 'left',
}));

const StyledBorderBottom = styled.div(({ isVisible }) => ({
  borderBottom: isVisible ? '1px solid rgba(193, 193, 193, 255)' : 'none',
}));

MobilitySettingsView.propTypes = {
  navigator: PropTypes.objectOf(PropTypes.any),
};

MobilitySettingsView.defaultProps = {
  navigator: null,
};

export default MobilitySettingsView;
