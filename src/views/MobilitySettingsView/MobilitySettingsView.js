import {
  Checkbox, FormControl, FormControlLabel, FormGroup, Typography
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React, {
  useContext, useEffect, useMemo, useRef, useState
} from 'react';
import { useSelector } from 'react-redux';
import iconBicycle from 'servicemap-ui-turku/assets/icons/icons-icon_bicycle.svg';
import iconBoat from 'servicemap-ui-turku/assets/icons/icons-icon_boating.svg';
import iconCar from 'servicemap-ui-turku/assets/icons/icons-icon_car.svg';
import iconScooter from 'servicemap-ui-turku/assets/icons/icons-icon_scooter.svg';
import iconWalk from 'servicemap-ui-turku/assets/icons/icons-icon_walk.svg';
import InfoTextBox from '../../components/MobilityPlatform/InfoTextBox';
import {
  fetchBicycleRouteNames, fetchCultureRouteNames, fetchMobilityMapPolygonData
} from '../../components/MobilityPlatform/mobilityPlatformRequests/mobilityPlatformRequests';
import { selectRouteName } from '../../components/MobilityPlatform/utils/utils';
import TitleBar from '../../components/TitleBar';
import MobilityPlatformContext from '../../context/MobilityPlatformContext';
import ButtonMain from './components/ButtonMain';
import CityBikeInfo from './components/CityBikeInfo';
import Description from './components/Description';
import EmptyRouteList from './components/EmptyRouteList';
import ExtendedInfo from './components/ExtendedInfo';
import FormLabel from './components/FormLabel';
import RouteLength from './components/RouteLength';

const MobilitySettingsView = ({ classes, intl }) => {
  const [openWalkSettings, setOpenWalkSettings] = useState(false);
  const [openBicycleSettings, setOpenBicycleSettings] = useState(false);
  const [openCarSettings, setOpenCarSettings] = useState(false);
  const [openBoatingSettings, setOpenBoatingSettings] = useState(false);
  const [openScooterSettings, setOpenScooterSettings] = useState(false);
  const [openCultureRouteList, setOpenCultureRouteList] = useState(false);
  const [cultureRouteList, setCultureRouteList] = useState([]);
  const [localizedCultureRoutes, setLocalizedCultureRoutes] = useState([]);
  const [bicycleRouteList, setBicycleRouteList] = useState([]);
  const [openBicycleRouteList, setOpenBicycleRouteList] = useState(false);
  const [openSpeedLimitList, setOpenSpeedLimitList] = useState(false);
  const [openParkingChargeZoneList, setOpenParkingChargeZoneList] = useState(false);
  const [openScooterProviderList, setOpenScooterProviderList] = useState(false);
  const [openStreetMaintenanceSelectionList, setOpenStreetMaintenanceSelectionList] = useState(false);

  const {
    setOpenMobilityPlatform,
    showEcoCounter,
    setShowEcoCounter,
    showBicycleStands,
    setShowBicycleStands,
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
    showStreetMaintenance,
    setShowStreetMaintenance,
    streetMaintenancePeriod,
    setStreetMaintenancePeriod,
  } = useContext(MobilityPlatformContext);

  const locale = useSelector(state => state.user.locale);

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
    fetchMobilityMapPolygonData('SLZ', 1000, setSpeedLimitZones);
  }, [setSpeedLimitZones]);

  useEffect(() => {
    fetchMobilityMapPolygonData('PAZ', 10, setParkingChargeZones);
  }, [setParkingChargeZones]);

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
  }, [showPublicToilets]);

  useEffect(() => {
    checkVisibilityValues(showBicycleStands, setOpenBicycleSettings);
    checkVisibilityValues(showBikeServiceStations, setOpenBicycleSettings);
    checkVisibilityValues(showCityBikes, setOpenBicycleSettings);
  }, [showBicycleStands, showBikeServiceStations, showCityBikes]);

  useEffect(() => {
    checkVisibilityValues(showBicycleRoutes, setOpenBicycleSettings);
    checkVisibilityValues(showBicycleRoutes, setOpenBicycleRouteList);
  }, [showBicycleRoutes]);

  useEffect(() => {
    checkVisibilityValues(showCultureRoutes, setOpenWalkSettings);
    checkVisibilityValues(showCultureRoutes, setOpenCultureRouteList);
  }, [showCultureRoutes]);

  useEffect(() => {
    checkVisibilityValues(showSpeedLimitZones, setOpenSpeedLimitList);
  }, [showSpeedLimitZones]);

  useEffect(() => {
    if (showEcoCounter) {
      setOpenWalkSettings(true);
      setOpenBicycleSettings(true);
    }
  }, [showEcoCounter]);

  useEffect(() => {
    checkVisibilityValues(showRentalCars, setOpenCarSettings);
    checkVisibilityValues(showGasFillingStations, setOpenCarSettings);
    checkVisibilityValues(showParkingSpaces, setOpenCarSettings);
    checkVisibilityValues(showChargingStations, setOpenCarSettings);
    checkVisibilityValues(showSpeedLimitZones, setOpenCarSettings);
  }, [showRentalCars, showGasFillingStations, showParkingSpaces, showChargingStations, showSpeedLimitZones]);

  useEffect(() => {
    checkVisibilityValues(showParkingChargeZones, setOpenCarSettings);
    checkVisibilityValues(showParkingChargeZones, setOpenParkingChargeZoneList);
  }, [showParkingChargeZones]);

  useEffect(() => {
    checkVisibilityValues(showStreetMaintenance, setOpenCarSettings);
    checkVisibilityValues(showStreetMaintenance, setOpenStreetMaintenanceSelectionList);
  }, [showStreetMaintenance]);

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

  /**
   * Toggle functions for main user types
   * @var {Boolean}
   * @returns {Boolean}
   */
  const walkSettingsToggle = () => {
    setOpenWalkSettings(current => !current);
  };

  const bicycleSettingsToggle = () => {
    setOpenBicycleSettings(current => !current);
  };

  const carSettingsToggle = () => {
    setOpenCarSettings(current => !current);
  };

  const boatingSettingsToggle = () => {
    setOpenBoatingSettings(current => !current);
  };

  const scooterSettingsToggle = () => {
    setOpenScooterSettings(current => !current);
  };

  /**
   * Toggle functions for content types
   * @var {boolean}
   * @returns {boolean}
   */
  const ecoCounterStationsToggle = () => {
    setShowEcoCounter(current => !current);
  };

  const bicycleStandsToggle = () => {
    setShowBicycleStands(current => !current);
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
      setShowCultureRoutes(false);
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
      type: 'publicToilets',
      msgId: 'mobilityPlatform.menu.show.publicToilets',
      checkedValue: showPublicToilets,
      onChangeValue: publicToiletsToggle,
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
      type: 'ecoCounterStations',
      msgId: 'mobilityPlatform.menu.showEcoCounter',
      checkedValue: showEcoCounter,
      onChangeValue: ecoCounterStationsToggle,
    },
  ];

  const carControlTypes = [
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
      type: 'streetMaintenance',
      msgId: 'mobilityPlatform.menu.show.streetMaintenance',
      checkedValue: openStreetMaintenanceSelectionList,
      onChangeValue: streetMaintenanceListToggle,
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

  /**
     * @param {Array} inputData
     * @returns {JSX Element}
     */
  const renderBicycleRoutes = inputData => inputData
    && inputData.length > 0
    && inputData.map(item => (
      <div key={item.id} className={classes.checkBoxContainer}>
        <FormControlLabel
          control={(
            <Checkbox
              checked={item.name_fi === bicycleRouteName}
              aria-checked={item.name_fi === bicycleRouteName}
              className={classes.margin}
              onChange={() => setBicycleRouteState(item.name_fi)}
            />
        )}
          label={(
            <Typography variant="body2" aria-label={selectRouteName(locale, item.name_fi, item.name_en, item.name_sv)}>
              {selectRouteName(locale, item.name_fi, item.name_en, item.name_sv)}
            </Typography>
         )}
        />
        {item.name_fi === bicycleRouteName ? (<RouteLength key={item.id} route={item} />) : null}
      </div>
    ));

  /**
     * @param {Array} inputData
     * @returns {JSX Element}
     */
  const renderCultureRoutes = inputData => inputData
    && inputData.length > 0
    && inputData.map(item => (
      <div key={item.id} className={classes.checkBoxContainer}>
        <FormControlLabel
          control={(
            <Checkbox
              checked={item.id === cultureRouteId}
              aria-checked={item.id === cultureRouteId}
              className={classes.margin}
              onChange={() => setCultureRouteState(item.id)}
            />
      )}
          label={(
            <Typography variant="body2" aria-label={selectRouteName(locale, item.name, item.name_en, item.name_sv)}>
              {selectRouteName(locale, item.name, item.name_en, item.name_sv)}
            </Typography>
      )}
        />
        {item.id === cultureRouteId ? (
          <Description
            key={item.name}
            route={item}
            currentLocale={locale}
          />
        ) : null}
      </div>
    ));

  /**
     * @param {boolean} settingVisibility
     * @param {Array} typeVal
     * @returns {JSX Element}
     */
  const renderSettings = (settingVisibility, typeVal) => {
    if (settingVisibility) {
      return typeVal.map(item => (
        <FormLabel
          key={item.type}
          msgId={item.msgId}
          checkedValue={item.checkedValue}
          onChangeValue={item.onChangeValue}
        />
      ));
    }
    return null;
  };

  // Create array of speed limit values from data and remove duplicates
  const speedLimitList = useMemo(() => [...new Set(speedLimitZones.map(item => item.extra.speed_limit))],
    [speedLimitZones]);

  // Sort in ascending order, because entries can be in random order
  // This list will be displayed for users
  const speedLimitListAsc = speedLimitList.sort((a, b) => a - b);

  const renderSpeedLimits = () => (
    <>
      <div className={`${classes.paragraph} ${classes.border}`}>
        <Typography variant="subtitle2" aria-label={intl.formatMessage({ id: 'mobilityPlatform.menu.speedLimitZones.select' })}>
          {intl.formatMessage({ id: 'mobilityPlatform.menu.speedLimitZones.select' })}
        </Typography>
      </div>
      <div className={classes.buttonList}>
        {openSpeedLimitList && speedLimitListAsc.length > 0 && speedLimitListAsc.map(item => (
          <div key={item} className={classes.checkBoxContainer}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={speedLimitSelections.includes(item)}
                  aria-checked={speedLimitSelections.includes(item)}
                  className={classes.margin}
                  onChange={() => setSpeedLimitState(item)}
                />
            )}
              label={(
                <Typography
                  variant="body2"
                  aria-label={`${item} ${intl.formatMessage({
                    id: 'mobilityPlatform.content.speedLimitZones.suffix',
                  })}`}
                >
                  {item}
                  {' '}
                  {intl.formatMessage({
                    id: 'mobilityPlatform.content.speedLimitZones.suffix',
                  })}
                </Typography>
            )}
            />
          </div>
        ))}
      </div>
    </>
  );

  const renderParkingChargeZoneList = () => (
    <>
      {parkingChargeZones
        && parkingChargeZones.length > 0
        && parkingChargeZones.map(item => (
          <div key={item.id} className={classes.checkBoxContainer}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={item.id === parkingChargeZoneId}
                  aria-checked={item.id === parkingChargeZoneId}
                  className={classes.margin}
                  onChange={() => selectParkingChargeZone(item.id)}
                />
              )}
              label={(
                <Typography
                  variant="body2"
                  aria-label={`${intl.formatMessage({ id: 'mobilityPlatform.menu.parkingChargeZones.subtitle' })} ${
                    item.extra.maksuvyohyke
                  }`}
                >
                  {intl.formatMessage({ id: 'mobilityPlatform.menu.parkingChargeZones.subtitle' })}
                  {' '}
                  {item.extra.maksuvyohyke}
                </Typography>
              )}
            />
          </div>
        ))}
    </>
  );

  const renderScooterProviderList = () => (
    <>
      {scooterProviders
        && scooterProviders.length > 0
        && scooterProviders.map(item => (
          <div key={item.type} className={classes.checkBoxContainer}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={item.checkedValue}
                  aria-checked={item.checkedValue}
                  className={classes.margin}
                  onChange={() => item.onChangeValue()}
                />
              )}
              label={(
                <Typography
                  variant="body2"
                  aria-label={intl.formatMessage({ id: 'mobilityPlatform.menu.show.scootersRyde' })}
                >
                  {intl.formatMessage({ id: 'mobilityPlatform.menu.show.scootersRyde' })}
                </Typography>
              )}
            />
          </div>
        ))}
    </>
  );

  const streetMaintenanceInfo = (colorClass, translationId) => (
    <div className={classes.flexBox}>
      <div className={colorClass} />
      <div className={classes.marginSm}>
        <Typography variant="body2">{intl.formatMessage({ id: translationId })}</Typography>
      </div>
    </div>
  );

  const renderMaintenanceSelectionList = () => (
    <>
      <div className={`${classes.paragraph} ${classes.border}`}>
        <Typography variant="body2" aria-label={intl.formatMessage({ id: 'mobilityPlatform.menu.streetMaintenance.info' })}>
          {intl.formatMessage({ id: 'mobilityPlatform.menu.streetMaintenance.info' })}
        </Typography>
        <div className={classes.infoText}>
          {streetMaintenanceInfo(classes.blue, 'mobilityPlatform.menu.streetMaintenance.info.snowplow')}
          {streetMaintenanceInfo(classes.purple, 'mobilityPlatform.menu.streetMaintenance.info.deicing')}
          {streetMaintenanceInfo(classes.burgundy, 'mobilityPlatform.menu.streetMaintenance.info.sandRemoval')}
          {streetMaintenanceInfo(classes.green, 'mobilityPlatform.menu.streetMaintenance.info.sanitation')}
          {streetMaintenanceInfo(classes.black, 'mobilityPlatform.menu.streetMaintenance.info.other')}
        </div>
      </div>
      {streetMaintenanceSelections
        && streetMaintenanceSelections.length > 0
        && streetMaintenanceSelections.map(item => (
          <div key={item.type} className={classes.checkBoxContainer}>
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
                <Typography
                  variant="body2"
                  aria-label={intl.formatMessage({ id: item.msgId })}
                >
                  {intl.formatMessage({ id: item.msgId })}
                </Typography>
              )}
            />
          </div>
        ))}
    </>
  );

  return (
    <div className={classes.content}>
      <TitleBar
        title={intl.formatMessage({ id: 'general.pageTitles.mobilityPlatform.title' })}
        titleComponent="h3"
        backButton
        className={classes.topBarColor}
      />
      <div className={classes.container}>
        <FormControl variant="standard" className={classes.formControl}>
          <FormGroup className={classes.formGroup}>
            <>
              <div className={classes.buttonContainer}>
                <ButtonMain
                  onClickFunc={walkSettingsToggle}
                  settingState={openWalkSettings}
                  iconName={iconWalk}
                  translationId="mobilityPlatform.menu.title.walk"
                />
              </div>
              {renderSettings(openWalkSettings, walkingControlTypes)}
              <div className={openCultureRouteList ? classes.border : null}>
                {openCultureRouteList && !cultureRouteId ? <EmptyRouteList route={cultureRouteList} /> : null}
              </div>
              {openCultureRouteList && (locale === 'en' || locale === 'sv')
                ? renderCultureRoutes(localizedCultureRoutes)
                : null}
              {openCultureRouteList && locale === 'fi' ? renderCultureRoutes(cultureRouteList) : null}
              <div className={classes.buttonContainer}>
                <ButtonMain
                  onClickFunc={bicycleSettingsToggle}
                  settingState={openBicycleSettings}
                  iconName={iconBicycle}
                  translationId="mobilityPlatform.menu.title.bicycle"
                />
              </div>
              {renderSettings(openBicycleSettings, bicycleControlTypes)}
              <div className={openBicycleRouteList ? classes.border : null}>
                {openBicycleRouteList && !bicycleRouteName ? <EmptyRouteList route={bicycleRouteList} /> : null}
              </div>
              {openBicycleRouteList ? renderBicycleRoutes(bicycleRouteList) : null}
              <div className={classes.buttonContainer}>
                <ButtonMain
                  onClickFunc={carSettingsToggle}
                  settingState={openCarSettings}
                  iconName={iconCar}
                  translationId="mobilityPlatform.menu.title.car"
                />
              </div>
              {renderSettings(openCarSettings, carControlTypes)}
              {openParkingChargeZoneList ? renderParkingChargeZoneList() : null}
              {openSpeedLimitList ? renderSpeedLimits() : null}
              {openStreetMaintenanceSelectionList ? renderMaintenanceSelectionList() : null}
              <div className={classes.buttonContainer}>
                <ButtonMain
                  onClickFunc={scooterSettingsToggle}
                  settingState={openScooterSettings}
                  iconName={iconScooter}
                  translationId="mobilityPlatform.menu.title.scooter"
                />
              </div>
              {renderSettings(openScooterSettings, scooterControlTypes)}
              {openScooterProviderList ? renderScooterProviderList() : null}
              <div className={classes.buttonContainer}>
                <ButtonMain
                  onClickFunc={boatingSettingsToggle}
                  settingState={openBoatingSettings}
                  iconName={iconBoat}
                  translationId="mobilityPlatform.menu.title.boating"
                />
              </div>
              {renderSettings(openBoatingSettings, boatingControlTypes)}
            </>
          </FormGroup>
        </FormControl>
      </div>
      {showPublicToilets ? <InfoTextBox infoText="mobilityPlatform.info.publicToilets" /> : null}
      {showBicycleStands ? <InfoTextBox infoText="mobilityPlatform.info.bicycleStands" /> : null}
      {showEcoCounter ? <InfoTextBox infoText="mobilityPlatform.info.ecoCounter" /> : null}
      {showCityBikes ? <CityBikeInfo bikeInfo={bikeInfo} /> : null}
      {showRentalCars ? <InfoTextBox infoText="mobilityPlatform.info.rentalCars" /> : null}
      {showChargingStations ? <InfoTextBox infoText="mobilityPlatform.info.chargingStations" /> : null}
      {showGasFillingStations ? <InfoTextBox infoText="mobilityPlatform.info.gasFillingStations" /> : null}
      {showParkingSpaces ? <InfoTextBox infoText="mobilityPlatform.info.parkingSpaces" /> : null}
      {openParkingChargeZoneList ? <ExtendedInfo translations={chargeZoneTranslations} /> : null}
      {showMarinas ? (
        <InfoTextBox
          infoText="mobilityPlatform.info.marinas"
          linkUrl="https://opaskartta.turku.fi/ePermit/fi/Reservation/"
          linkText="mobilityPlatform.info.marinas.link"
        />
      ) : null}
      {showBoatParking ? <InfoTextBox infoText="mobilityPlatform.info.boatParking" /> : null}
      {showGuestHarbour ? (
        <InfoTextBox
          infoText="mobilityPlatform.info.guestHarbour"
          linkUrl="https://www.turunvierasvenesatama.fi"
          linkText="mobilityPlatform.info.guestHarbour.link"
        />
      ) : null}
      {openScooterProviderList ? <InfoTextBox infoText="mobilityPlatform.info.scooters.general" /> : null}
      {showScooterNoParking ? <InfoTextBox infoText="mobilityPlatform.info.scooters.noParking" /> : null}
      {showScooterParkingAreas ? <InfoTextBox infoText="mobilityPlatform.info.scooters.parkingAreas" /> : null}
      {showScooterSpeedLimitAreas ? <InfoTextBox infoText="mobilityPlatform.info.scooters.speedLimitAreas" /> : null}
    </div>
  );
};

MobilitySettingsView.propTypes = {
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default MobilitySettingsView;
