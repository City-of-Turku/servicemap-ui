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

const trafficCountersInitial = {
  walking: false,
  cycling: false,
  driving: false,
};

const MobilityPlatformContextProvider = ({ children }) => {
  // Check if mobility platform is open or not
  const [openMobilityPlatform, setOpenMobilityPlatform] = useState(false);

  // measurement points
  const [showTrafficCounter, setShowTrafficCounter] = useState(trafficCountersInitial);

  // cycling
  const [showBicycleStands, setShowBicycleStands] = useState(false);
  const [showHullLockableStands, setShowHullLockableStands] = useState(false);
  const [showBicycleRoutes, setShowBicycleRoutes] = useState(false);
  const [bicycleRouteName, setBicycleRouteName] = useState(null);
  const [showBikeServiceStations, setShowBikeServiceStations] = useState(false);
  const [showCityBikes, setShowCityBikes] = useState(false);
  const [showCargoBikes, setShowCargoBikes] = useState(false);

  // culture routes
  const [showCultureRoutes, setShowCultureRoutes] = useState(false);
  const [cultureRouteId, setCultureRouteId] = useState();

  // cars and parking
  const [showRentalCars, setShowRentalCars] = useState(false);
  const [showGasFillingStations, setShowGasFillingStations] = useState(false);
  const [showChargingStations, setShowChargingStations] = useState(false);
  const [showParkingSpaces, setShowParkingSpaces] = useState(false);
  const [showParkingChargeZones, setShowParkingChargeZones] = useState(false);
  const [parkingChargeZones, setParkingChargeZones] = useState([]);
  const [parkingChargeZoneId, setParkingChargeZoneId] = useState(null);
  const [showDisabledParking, setShowDisabledParking] = useState(false);
  const [showParkingMachines, setShowParkingMachines] = useState(false);
  const [showPublicParking, setShowPublicParking] = useState(false);
  const [showRentalCarParking, setShowRentalCarParking] = useState(false);

  // boating
  const [showMarinas, setShowMarinas] = useState(false);
  const [showBoatParking, setShowBoatParking] = useState(false);
  const [showGuestHarbour, setShowGuestHarbour] = useState(false);

  // speed limit zones
  const [showSpeedLimitZones, setShowSpeedLimitZones] = useState(false);
  const [speedLimitSelections, setSpeedLimitSelections] = useState([]);
  const [speedLimitZones, setSpeedLimitZones] = useState([]);

  // scooters
  const [showScooterNoParking, setShowScooterNoParking] = useState(false);
  const [showScooterParkingAreas, setShowScooterParkingAreas] = useState(false);
  const [showScooterSpeedLimitAreas, setShowScooterSpeedLimitAreas] = useState(false);
  const [showScootersRyde, setShowScootersRyde] = useState(false);

  // street maintenance
  const [showStreetMaintenance, setShowStreetMaintenance] = useState(false);
  const [streetMaintenancePeriod, setStreetMaintenancePeriod] = useState(null);
  const [isActiveStreetMaintenance, setIsActiveStreetMaintenance] = useState(true);
  const [showBrushSandedRoute, setShowBrushSandedRoute] = useState(false);
  const [showBrushSaltedRoute, setShowBrushSaltedRoute] = useState(false);

  // trails (nature & fitness)
  const [showMarkedTrails, setShowMarkedTrails] = useState(false);
  const [markedTrailsObj, setMarkedTrailsObj] = useState({});
  const [showNatureTrails, setShowNatureTrails] = useState(false);
  const [natureTrailsObj, setNatureTrailsObj] = useState({});
  const [showFitnessTrails, setShowFitnessTrails] = useState(false);
  const [fitnessTrailsObj, setFitnessTrailsObj] = useState({});

  // other
  const [showOutdoorGymDevices, setShowOutdoorGymDevices] = useState(false);
  const [showLoadingPlaces, setShowLoadingPlaces] = useState(false);
  const [showPublicToilets, setShowPublicToilets] = useState(false);
  const [showCrossWalks, setShowCrossWalks] = useState(false);
  const [showBusStops, setShowBusStops] = useState(false);
  const [showOverpasses, setShowOverpasses] = useState(false);
  const [showUnderpasses, setShowUnderpasses] = useState(false);

  const getters = {
    openMobilityPlatform,
    // measurement points
    showTrafficCounter,
    // cycling
    showBicycleRoutes,
    bicycleRouteName,
    showBicycleStands,
    showHullLockableStands,
    showBikeServiceStations,
    showCityBikes,
    showCargoBikes,
    // culture routes
    showCultureRoutes,
    cultureRouteId,
    // cars and parking
    showRentalCars,
    showGasFillingStations,
    showChargingStations,
    showParkingSpaces,
    showParkingChargeZones,
    showParkingMachines,
    showPublicParking,
    parkingChargeZones,
    parkingChargeZoneId,
    showDisabledParking,
    showRentalCarParking,
    // boating
    showMarinas,
    showBoatParking,
    showGuestHarbour,
    // speed limit zones
    showSpeedLimitZones,
    speedLimitSelections,
    speedLimitZones,
    // scooters
    showScooterNoParking,
    showScooterParkingAreas,
    showScooterSpeedLimitAreas,
    showScootersRyde,
    // street maintenance
    showStreetMaintenance,
    streetMaintenancePeriod,
    isActiveStreetMaintenance,
    showBrushSandedRoute,
    showBrushSaltedRoute,
    // trails (nature, fitness)
    showMarkedTrails,
    markedTrailsObj,
    showNatureTrails,
    natureTrailsObj,
    showFitnessTrails,
    fitnessTrailsObj,
    // other
    showOutdoorGymDevices,
    showPublicToilets,
    showLoadingPlaces,
    showCrossWalks,
    showBusStops,
    showOverpasses,
    showUnderpasses,
  };

  const setters = {
    setOpenMobilityPlatform,
    // measurement points
    setShowTrafficCounter,
    // cycling
    setShowBicycleRoutes,
    setBicycleRouteName,
    setShowBicycleStands,
    setShowHullLockableStands,
    setShowBikeServiceStations,
    setShowCityBikes,
    setShowCargoBikes,
    // culture routes
    setShowCultureRoutes,
    setCultureRouteId,
    // cars and parking
    setShowRentalCars,
    setShowGasFillingStations,
    setShowChargingStations,
    setShowParkingSpaces,
    setShowParkingChargeZones,
    setShowParkingMachines,
    setShowPublicParking,
    setParkingChargeZones,
    setParkingChargeZoneId,
    setShowDisabledParking,
    setShowRentalCarParking,
    // boating
    setShowMarinas,
    setShowBoatParking,
    setShowGuestHarbour,
    // speed limits
    setShowSpeedLimitZones,
    setSpeedLimitSelections,
    setSpeedLimitZones,
    // scooters
    setShowScooterNoParking,
    setShowScooterParkingAreas,
    setShowScooterSpeedLimitAreas,
    setShowScootersRyde,
    // street maintenance
    setShowStreetMaintenance,
    setStreetMaintenancePeriod,
    setIsActiveStreetMaintenance,
    setShowBrushSandedRoute,
    setShowBrushSaltedRoute,
    // trails (nature, fitness)
    setShowMarkedTrails,
    setMarkedTrailsObj,
    setShowNatureTrails,
    setNatureTrailsObj,
    setShowFitnessTrails,
    setFitnessTrailsObj,
    // other
    setShowOutdoorGymDevices,
    setShowPublicToilets,
    setShowLoadingPlaces,
    setShowCrossWalks,
    setShowBusStops,
    setShowUnderpasses,
    setShowOverpasses,
  };

  const contextValues = { ...getters, ...setters };

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
