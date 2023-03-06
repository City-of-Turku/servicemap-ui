import { Typography } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import config from '../../config';
import { ErrorComponent } from '../components';
import AlertBox from '../components/AlertBox';
import DesktopComponent from '../components/DesktopComponent';
import ErrorBoundary from '../components/ErrorBoundary';
import FocusableSRLinks from '../components/FocusableSRLinks';
import Settings from '../components/Settings';
import TopBar from '../components/TopBar';
import { ErrorProvider } from '../context/ErrorContext';
import { MobilityPlatformProvider } from '../context/MobilityPlatformContext';
import { PrintProvider } from '../context/PrintContext';
import { viewTitleID } from '../utils/accessibility';
import useMobileStatus from '../utils/isMobile';
import MapView from '../views/MapView';
import PrintView from '../views/PrintView';
import ViewRouter from './components/ViewRouter';

const { smallScreenBreakpoint } = config;

const createContentStyles = (
  isMobile,
  isSmallScreen,
  landscape,
  fullMobileMap,
  settingsOpen,
  currentPage,
  sidebarHidden,
) => {
  let width = 450;
  if (isMobile) {
    width = '100%';
  } else if (isSmallScreen) {
    width = '50%';
  }
  const topBarHeight = isMobile ? `${config.topBarHeightMobile}px` : `${config.topBarHeight}px`;

  const styles = {
    activeRoot: {
      margin: 0,
      width: '100%',
      display: 'flex',
      flexWrap: 'nowrap',
      height: `calc(100vh - ${topBarHeight})`,
      flex: '1 1 auto',
    },
    map: {
      position: isMobile ? 'fixed' : null,
      bottom: 0,
      margin: 0,
      flex: !isMobile || fullMobileMap ? 1 : 0,
      display: 'flex',
      visibility: isMobile && (!fullMobileMap || settingsOpen) ? 'hidden' : '',
      height: isMobile ? `calc(100% - ${topBarHeight})` : '100%',
      width: '100%',
      zIndex: 900,
    },
    sidebar: {
      height: '100%',
      position: 'relative',
      top: 0,
      bottom: 0,
      width,
      margin: 0,
      // eslint-disable-next-line no-nested-ternary
      overflow: settingsOpen ? 'hidden' : isMobile ? 'visible' : 'auto',
      visibility: fullMobileMap && !settingsOpen ? 'hidden' : null,
      flex: '0 1 auto',
    },
    sidebarContent: {
      height: '100%',
    },
  };

  if (currentPage === 'home' && !isMobile) {
    styles.sidebar.borderRight = '8px solid transparent';
  }

  if (sidebarHidden && !isMobile) {
    styles.sidebar.display = 'none';
  }

  return styles;
};

const ecoCounterStationsInitial = {
  walking: false,
  cycling: false,
};

// Shitty hack to get alert showing when not using print view
// (showAlert did not use updated showPrintView value)
const valueStore = {};

const DefaultLayout = (props) => {
  const [showPrintView, togglePrintView] = useState(false);
  const [sidebarHidden, toggleSidebarHidden] = useState(false);
  const [error, setError] = useState(false);
  const [openMobilityPlatform, setOpenMobilityPlatform] = useState(false);
  const [showEcoCounter, setShowEcoCounter] = useState(ecoCounterStationsInitial);
  const [showBicycleStands, setShowBicycleStands] = useState(false);
  const [showHullLockableStands, setShowHullLockableStands] = useState(false);
  const [showCultureRoutes, setShowCultureRoutes] = useState(false);
  const [cultureRouteId, setCultureRouteId] = useState();
  const [showBicycleRoutes, setShowBicycleRoutes] = useState(false);
  const [bicycleRouteName, setBicycleRouteName] = useState(null);
  const [showRentalCars, setShowRentalCars] = useState(false);
  const [showGasFillingStations, setShowGasFillingStations] = useState(false);
  const [showChargingStations, setShowChargingStations] = useState(false);
  const [showParkingSpaces, setShowParkingSpaces] = useState(false);
  const [showParkingChargeZones, setShowParkingChargeZones] = useState(false);
  const [parkingChargeZones, setParkingChargeZones] = useState([]);
  const [parkingChargeZoneId, setParkingChargeZoneId] = useState(null);
  const [showBikeServiceStations, setShowBikeServiceStations] = useState(false);
  const [showCityBikes, setShowCityBikes] = useState(false);
  const [showMarinas, setShowMarinas] = useState(false);
  const [showBoatParking, setShowBoatParking] = useState(false);
  const [showGuestHarbour, setShowGuestHarbour] = useState(false);
  const [showSpeedLimitZones, setShowSpeedLimitZones] = useState(false);
  const [speedLimitSelections, setSpeedLimitSelections] = useState([]);
  const [speedLimitZones, setSpeedLimitZones] = useState([]);
  const [showPublicToilets, setShowPublicToilets] = useState(false);
  const [showScooterNoParking, setShowScooterNoParking] = useState(false);
  const [showScooterParkingAreas, setShowScooterParkingAreas] = useState(false);
  const [showScooterSpeedLimitAreas, setShowScooterSpeedLimitAreas] = useState(false);
  const [showScootersRyde, setShowScootersRyde] = useState(false);
  const [showDisabledParking, setShowDisabledParking] = useState(false);
  const [showLoadingPlaces, setShowLoadingPlaces] = useState(false);
  const [showStreetMaintenance, setShowStreetMaintenance] = useState(false);
  const [streetMaintenancePeriod, setStreetMaintenancePeriod] = useState(null);
  const [isActiveStreetMaintenance, setIsActiveStreetMaintenance] = useState(true);
  const [showBrushSandedRoute, setShowBrushSandedRoute] = useState(false);
  const [showBrushSaltedRoute, setShowBrushSaltedRoute] = useState(false);
  const [showMarkedTrails, setShowMarkedTrails] = useState(false);
  const [markedTrailsObj, setMarkedTrailsObj] = useState({});
  const [showNatureTrails, setShowNatureTrails] = useState(false);
  const [natureTrailsObj, setNatureTrailsObj] = useState({});
  const [showFitnessTrails, setShowFitnessTrails] = useState(false);
  const [fitnessTrailsObj, setFitnessTrailsObj] = useState({});
  const [showLamCounter, setShowLamCounter] = useState(false);
  const [showParkingMachines, setShowParkingMachines] = useState(false);
  const [showPublicParking, setShowPublicParking] = useState(false);
  const [showOutdoorGymDevices, setShowOutdoorGymDevices] = useState(false);
  const [showBusStops, setShowBusStops] = useState(false);

  const {
    currentPage, fetchErrors, fetchNews, intl, location, settingsToggled,
  } = props;
  const isMobile = useMobileStatus();
  const isSmallScreen = useMediaQuery(`(max-width:${smallScreenBreakpoint}px)`);
  const fullMobileMap = new URLSearchParams(location.search).get('showMap'); // If mobile map view
  const landscape = useMediaQuery('(min-device-aspect-ratio: 1/1)');
  const portrait = useMediaQuery('(max-device-aspect-ratio: 1/1)');

  useEffect(() => {
    fetchErrors();
    fetchNews();
  }, []);

  const styles = createContentStyles(
    isMobile,
    isSmallScreen,
    landscape,
    fullMobileMap,
    settingsToggled,
    currentPage,
    sidebarHidden,
  );
  const srLinks = [
    {
      href: `#${viewTitleID}`,
      text: <FormattedMessage id="general.skipToContent" />,
    },
  ];

  const toggleSidebar = () => {
    toggleSidebarHidden(!sidebarHidden);
  };
  const togglePrint = () => {
    valueStore.showPrintView = !showPrintView;
    togglePrintView(!showPrintView);
  };
  const showAlert = () => {
    if (valueStore.showPrintView) {
      return;
    }
    alert(intl.formatMessage({ id: 'print.alert' }));
  };

  useEffect(() => {
    window.onbeforeprint = showAlert;
  }, []);

  const printClass = `ǹo-print${showPrintView ? ' sr-only' : ''}`;

  return (
    <>
      <ErrorProvider value={{ error, setError }}>
        {error && <ErrorComponent error={error} />}
        {!error && (
          <ErrorBoundary>
            <div id="topArea" aria-hidden={!!settingsToggled} className={printClass}>
              <h1 id="app-title" tabIndex={-1} className="sr-only app-title" component="h1">
                <FormattedMessage id="app.title" />
              </h1>
              {/* Jump link to main content for screenreaders
              Must be first interactable element on page */}
              <FocusableSRLinks items={srLinks} />
              <PrintProvider value={togglePrint}>
                <TopBar
                  settingsOpen={settingsToggled}
                  smallScreen={isSmallScreen}
                />
              </PrintProvider>
            </div>
            {showPrintView && <PrintView togglePrintView={togglePrint} />}
            <div id="activeRoot" style={styles.activeRoot} className={printClass}>
              <main className="SidebarWrapper" style={styles.sidebar}>
                <AlertBox />
                {settingsToggled && <Settings key={settingsToggled} isMobile={!!isMobile} />}
                <div style={styles.sidebarContent} aria-hidden={!!settingsToggled}>
                  <MobilityPlatformProvider
                    value={{
                      openMobilityPlatform,
                      setOpenMobilityPlatform,
                      showEcoCounter,
                      setShowEcoCounter,
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
                      showParkingChargeZones,
                      setShowParkingChargeZones,
                      parkingChargeZones,
                      setParkingChargeZones,
                      parkingChargeZoneId,
                      setParkingChargeZoneId,
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
                      showBusStops,
                      setShowBusStops,
                    }}
                  >
                    <ViewRouter />
                  </MobilityPlatformProvider>
                </div>
              </main>
              <Typography variant="srOnly">
                {intl.formatMessage({ id: 'map.ariaLabel' })}
              </Typography>
              <div aria-hidden tabIndex={-1} style={styles.map}>
                <MobilityPlatformProvider
                  value={{
                    openMobilityPlatform,
                    showEcoCounter,
                    showBicycleStands,
                    showHullLockableStands,
                    showCultureRoutes,
                    cultureRouteId,
                    showBicycleRoutes,
                    bicycleRouteName,
                    showRentalCars,
                    showGasFillingStations,
                    showChargingStations,
                    showParkingSpaces,
                    showParkingChargeZones,
                    parkingChargeZones,
                    setParkingChargeZones,
                    parkingChargeZoneId,
                    showBikeServiceStations,
                    showCityBikes,
                    showMarinas,
                    showBoatParking,
                    showGuestHarbour,
                    showSpeedLimitZones,
                    speedLimitSelections,
                    speedLimitZones,
                    showPublicToilets,
                    showScooterNoParking,
                    showScooterParkingAreas,
                    showScooterSpeedLimitAreas,
                    showScootersRyde,
                    showDisabledParking,
                    showLoadingPlaces,
                    showStreetMaintenance,
                    streetMaintenancePeriod,
                    setIsActiveStreetMaintenance,
                    showBrushSandedRoute,
                    showBrushSaltedRoute,
                    showMarkedTrails,
                    markedTrailsObj,
                    showNatureTrails,
                    natureTrailsObj,
                    showFitnessTrails,
                    fitnessTrailsObj,
                    showLamCounter,
                    showParkingMachines,
                    showPublicParking,
                    showOutdoorGymDevices,
                    showBusStops,
                  }}
                >
                  <MapView
                    sidebarHidden={sidebarHidden}
                    toggleSidebar={toggleSidebar}
                    isMobile={!!isMobile}
                    showMobilityPlatform
                  />
                </MobilityPlatformProvider>
              </div>
            </div>

            <footer role="contentinfo" aria-hidden={!!settingsToggled} className="sr-only">
              <DesktopComponent>
                <a href="#app-title">
                  <FormattedMessage id="general.backToStart" />
                </a>
              </DesktopComponent>
            </footer>
          </ErrorBoundary>
        )}
      </ErrorProvider>
    </>
  );
};

// Typechecking
DefaultLayout.propTypes = {
  currentPage: PropTypes.string,
  fetchErrors: PropTypes.func.isRequired,
  fetchNews: PropTypes.func.isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  settingsToggled: PropTypes.string,
};

DefaultLayout.defaultProps = {
  currentPage: null,
  settingsToggled: null,
};

export default DefaultLayout;
