import React from 'react';
import PropTypes from 'prop-types';
import TrafficCounters from '../../components/EcoCounter/TrafficCounters';
import BicycleRoutes from '../../components/MobilityPlatform/BicycleRoutes';
import BicycleStands from '../../components/MobilityPlatform/BicycleStands';
import BikeServiceStations from '../../components/MobilityPlatform/BikeServiceStations';
import BoatParking from '../../components/MobilityPlatform/Boating/BoatParking';
import GuestHarbour from '../../components/MobilityPlatform/Boating/GuestHarbour';
import Marinas from '../../components/MobilityPlatform/Boating/Marinas';
import ChargerStationMarkers from '../../components/MobilityPlatform/ChargerStationMarkers';
import CityBikes from '../../components/MobilityPlatform/CityBikes';
import CultureRoutes from '../../components/MobilityPlatform/CultureRoutes';
import GasFillingStationMarkers from '../../components/MobilityPlatform/GasFillingStationMarkers';
import ParkingChargeZones from '../../components/MobilityPlatform/ParkingChargeZones';
import ParkingSpaces from '../../components/MobilityPlatform/ParkingSpaces';
import PublicToilets from '../../components/MobilityPlatform/PublicToilets';
import RentalCars from '../../components/MobilityPlatform/RentalCars';
import NoParking from '../../components/MobilityPlatform/Scooters/components/NoParking';
import ParkingAreas from '../../components/MobilityPlatform/Scooters/components/ParkingAreas';
import ScooterMarkers from '../../components/MobilityPlatform/Scooters/components/ScooterMarkers';
import SpeedLimitAreas from '../../components/MobilityPlatform/Scooters/components/SpeedLimitAreas';
import SnowPlows from '../../components/MobilityPlatform/SnowPlows';
import SpeedLimitZones from '../../components/MobilityPlatform/SpeedLimitZones';
import DisabledParking from '../../components/MobilityPlatform/Parking/DisabledParking';
import LoadingPlaces from '../../components/MobilityPlatform/LoadingPlaces';
import BrushedBicycleRoads from '../../components/MobilityPlatform/SnowPlows/components/BrushedBicycleRoads';
import MarkedTrails from '../../components/MobilityPlatform/MarkedTrails';
import NatureTrails from '../../components/MobilityPlatform/NatureTrails';
import FitnessTrails from '../../components/MobilityPlatform/FitnessTrails';
import ParkingMachines from '../../components/MobilityPlatform/ParkingMachines';
import PublicParking from '../../components/MobilityPlatform/Parking/PublicParking';
import OutdoorGymDevices from '../../components/MobilityPlatform/OutdoorGymDevices';
import CrossWalks from '../../components/MobilityPlatform/CrossWalks';
import Overpasses from '../../components/MobilityPlatform/Overpasses';
import RentalCarParking from '../../components/MobilityPlatform/Parking/RentalCarParking';
import PublicBenches from '../../components/MobilityPlatform/PublicBenches';
import Roadworks from '../../components/MobilityPlatform/Roadworks';
import RailwayStations from '../../components/MobilityPlatform/RailwayStations';
import AirMonitoring from '../../components/MobilityPlatform/EnvironmentObservations/AirMonitoring';
import ParkAndRideBikes from '../../components/MobilityPlatform/ParkAndRideStops/ParkAndRideBikes';
import AccessibilityAreas from '../../components/MobilityPlatform/AccessibilityAreas';

const MobilityPlatformMapView = ({ mapObject }) => (
  <>
    <TrafficCounters />
    <BicycleStands />
    <BicycleRoutes />
    <CultureRoutes />
    <RentalCars />
    <GasFillingStationMarkers />
    <ChargerStationMarkers />
    <ParkingSpaces />
    <ParkingChargeZones />
    <BikeServiceStations />
    <CityBikes />
    <Marinas />
    <BoatParking />
    <GuestHarbour />
    <SpeedLimitZones />
    <PublicToilets />
    <NoParking />
    <ParkingAreas />
    <SpeedLimitAreas />
    <ScooterMarkers mapObject={mapObject} />
    <DisabledParking />
    <LoadingPlaces />
    <SnowPlows />
    <BrushedBicycleRoads />
    <MarkedTrails />
    <NatureTrails />
    <FitnessTrails />
    <ParkingMachines />
    <PublicParking />
    <OutdoorGymDevices />
    <CrossWalks mapObject={mapObject} />
    <Overpasses />
    <RentalCarParking />
    <PublicBenches mapObject={mapObject} />
    <Roadworks />
    <RailwayStations />
    <AirMonitoring />
    <ParkAndRideBikes />
    <AccessibilityAreas />
  </>
);

MobilityPlatformMapView.propTypes = {
  mapObject: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default MobilityPlatformMapView;
