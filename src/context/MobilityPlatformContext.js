import React, { createContext, useContext, useState } from 'react';
import { PropTypes } from 'prop-types';

const MobilityPlatformContext = createContext();

/** context consumer hook */
const useMobilityPlatformContext = () => {
  // get the context
  const context = useContext(MobilityPlatformContext);

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error('useMobilityPlatformContext was used outside of its Provider');
  }

  return context;
};

const ecoCounterStationsInitial = {
  walking: false,
  cycling: false,
};

const MobilityPlatformContextProvider = ({ children }) => {
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

  const contextValues = {
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
    setIsActiveStreetMaintenance,
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
  };

  return (
    <MobilityPlatformContext.Provider value={contextValues}>
      {children}
    </MobilityPlatformContext.Provider>
  );
};

MobilityPlatformContextProvider.propTypes = {
  children: PropTypes.node,
};

MobilityPlatformContextProvider.defaultProps = {
  children: null,
};

export { MobilityPlatformContext, MobilityPlatformContextProvider, useMobilityPlatformContext };
