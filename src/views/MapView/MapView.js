/* eslint-disable global-require */
import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { useTheme } from '@mui/styles';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { ButtonBase } from '@mui/material';
import { MyLocation, LocationDisabled } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useMapEvents } from 'react-leaflet';
import { selectDistrictUnitFetch } from '../../redux/selectors/district';
import { selectNavigator } from '../../redux/selectors/general';
import {
  selectCities,
  selectMapType,
  selectSelectedCities, selectSelectedOrganizationIds,
} from '../../redux/selectors/settings';
import { getLocale, getPage } from '../../redux/selectors/user';
import {
  filterByCitySettings, resolveCityAndOrganizationFilter,
  resolveCitySettings,
} from '../../utils/filters';
import { mapOptions } from './config/mapConfig';
import CreateMap from './utils/createMap';
import { focusToPosition, getBoundsFromBbox } from './utils/mapActions';
import Districts from './components/Districts';
import TransitStops from './components/TransitStops';
import AddressPopup from './components/AddressPopup';
import UserMarker from './components/UserMarker';
import fetchAddress from './utils/fetchAddress';
import { isEmbed } from '../../utils/path';
import AddressMarker from './components/AddressMarker';
import { parseSearchParams } from '../../utils';
import DistanceMeasure from './components/DistanceMeasure';
import MarkerCluster from './components/MarkerCluster';
import UnitGeometry from './components/UnitGeometry';
import MapUtility from './utils/mapUtility';
import Util from '../../utils/mapUtility';
import HideSidebarButton from './components/HideSidebarButton';
import CoordinateMarker from './components/CoordinateMarker';
import { useNavigationParams } from '../../utils/address';
import PanControl from './components/PanControl';
import adjustControlElements from './utils';
import EntranceMarker from './components/EntranceMarker';
import EventMarkers from './components/EventMarkers';
import CustomControls from './components/CustomControls';
import { getSelectedUnitEvents } from '../../redux/selectors/selectedUnit';
import useMapUnits from './utils/useMapUnits';
import { Loading } from '../../components';
import StatisticalDistricts from './components/StatisticalDistricts';
import { getStatisticalDistrictUnitsState } from '../../redux/selectors/statisticalDistrict';
import SimpleStatisticalComponent from './components/StatisticalDataMapInfo';

if (global.window) {
  require('leaflet');
  require('leaflet.markercluster');
  global.rL = require('react-leaflet');
}

const EmbeddedActions = () => {
  const embedded = isEmbed();
  const map = useMapEvents({
    moveend() {
      if (embedded) {
        const bounds = map.getBounds();
        window.parent.postMessage({ bbox: `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}` });
      }
    },
  });

  return null;
};

const MapView = (props) => {
  const {
    location,
    unitsLoading,
    hideUserMarker,
    highlightedUnit,
    highlightedDistrict,
    isMobile,
    setMapRef,
    findUserLocation,
    userLocation,
    measuringMode,
    toggleSidebar,
    sidebarHidden,
    disableInteraction,
  } = props;

  // State
  const [mapObject, setMapObject] = useState(null);
  const [mapElement, setMapElement] = useState(null);
  const [prevMap, setPrevMap] = useState(null);
  const [mapUtility, setMapUtility] = useState(null);
  const [measuringMarkers, setMeasuringMarkers] = useState([]);
  const [measuringLine, setMeasuringLine] = useState([]);

  const theme = useTheme();
  const embedded = isEmbed({ url: location.pathname });
  const navigator = useSelector(selectNavigator);
  const mapType = useSelector(selectMapType);
  const locale = useSelector(getLocale);
  const currentPage = useSelector(getPage);
  const getAddressNavigatorParams = useNavigationParams();
  const districtUnitsFetch = useSelector(selectDistrictUnitFetch);
  const statisticalDistrictFetch = useSelector(getStatisticalDistrictUnitsState);
  const districtsFetching = useSelector(state => !!state.districts.districtsFetching?.length);
  const cities = useSelector(selectSelectedCities);
  const orgIds = useSelector(selectSelectedOrganizationIds);
  const districtViewFetching = districtUnitsFetch.isFetching || districtsFetching;
  const cityAndOrgFilter = resolveCityAndOrganizationFilter(cities, orgIds, location, embedded);
  const unitData = useMapUnits()
    .filter(cityAndOrgFilter);
  const intl = useIntl();

  // This unassigned selector is used to trigger re-render after events are fetched
  useSelector(state => getSelectedUnitEvents(state));

  const initializeMap = () => {
    if (mapElement) {
      // If changing map type, save current map viewport values before changing map
      const map = mapElement;
      map.defaultZoom = mapObject.options.zoom;
      setPrevMap(map);
    }
    // Search param map value
    const spMap = parseSearchParams(location.search).map || false;
    const mapType1 = spMap || (embedded ? 'servicemap' : mapType);

    const newMap = CreateMap(mapType1, locale);
    setMapObject(newMap);
  };

  const focusOnUser = () => {
    if (userLocation) {
      focusToPosition(
        mapElement,
        [userLocation.longitude, userLocation.latitude],
      );
    } else if (!embedded) {
      findUserLocation();
    }
  };

  const navigateToAddress = (latLng) => {
    fetchAddress(latLng)
      .then((data) => {
        navigator.push('address', getAddressNavigatorParams(data));
      });
  };

  const getCoordinatesFromUrl = () => {
    // Attempt to get coordinates from URL
    const usp = new URLSearchParams(location.search);
    const lat = usp.get('lat');
    const lng = usp.get('lon');
    if (!lat || !lng) {
      return null;
    }
    return [lat, lng];
  };

  useEffect(() => { // On map mount
    initializeMap();
    if (!embedded) {
      findUserLocation();
    }
    // Hide zoom control amd attribution from screen readers
    setTimeout(() => {
      adjustControlElements(embedded);
    }, 1);

    return () => {
      // Clear map reference on unmount
      setMapRef(null);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      adjustControlElements();
    }, 1);
  }, [mapObject]);

  useEffect(() => {
    if (currentPage !== 'unit' || !highlightedUnit || !mapUtility) {
      return;
    }
    mapUtility.centerMapToUnit(highlightedUnit);
  }, [highlightedUnit, mapUtility, currentPage]);

  useEffect(() => { // On map type change
    // Init new map and set new ref to redux
    initializeMap();
  }, [mapType]);

  useEffect(() => {
    if (mapElement) {
      setMapUtility(new MapUtility({ leaflet: mapElement }));

      const usp = new URLSearchParams(location.search);
      const lat = usp.get('lat');
      const lng = usp.get('lon');
      try {
        if (lat && lng) {
          const position = [usp.get('lon'), usp.get('lat')];
          focusToPosition(mapElement, position);
        }
      } catch (e) {
        console.warn('Error while attemptin to focus on coordinate:', e);
      }
    }
  }, [mapElement]);

  useEffect(() => {
    if (!measuringMode) {
      setMeasuringMarkers([]);
      setMeasuringLine([]);
    }
  }, [measuringMode]);

  const unitHasLocationAndGeometry = (un) => un?.location && un?.geometry;

  // Render

  const renderUnitGeometry = () => {
    if (highlightedDistrict) return null;
    if (currentPage !== 'unit') {
      return unitData.map(unit => (
        unit.geometry
          ? <UnitGeometry key={unit.id} data={unit} />
          : null
      ));
    }
    if (unitHasLocationAndGeometry(highlightedUnit)) {
      return <UnitGeometry data={highlightedUnit} />;
    }
    return null;
  };

  if (global.rL && mapObject) {
    const { MapContainer, TileLayer, WMSTileLayer } = global.rL || {};
    let center = mapOptions.initialPosition;
    let zoom = isMobile ? mapObject.options.mobileZoom : mapObject.options.zoom;
    // If changing map type, use viewport values of previous map
    if (prevMap && Util.mapHasMapPane(prevMap)) {
      center = prevMap.getCenter() || prevMap.options.center;
      /* Different map types have different zoom levels
      Use the zoom difference to calculate the new zoom level */
      const zoomDifference = mapObject.options.zoom - prevMap.defaultZoom;
      zoom = prevMap.getZoom()
        ? prevMap.getZoom() + zoomDifference
        : prevMap.options.zoom + zoomDifference;
    }

    const showLoadingScreen = statisticalDistrictFetch.isFetching
      || districtViewFetching
      || (embedded && unitsLoading);
    let showLoadingReducer = null;
    let hideLoadingNumbers = false;
    if (statisticalDistrictFetch.isFetching) {
      showLoadingReducer = statisticalDistrictFetch;
      hideLoadingNumbers = true;
    } else if (districtViewFetching) {
      showLoadingReducer = {
        ...districtUnitsFetch,
        isFetching: districtViewFetching,
      };
    }
    const userLocationAriaLabel = intl.formatMessage({ id: !userLocation ? 'location.notAllowed' : 'location.center' });
    const eventSearch = parseSearchParams(location.search).events;
    const defaultBounds = parseSearchParams(location.search).bbox;

    const mapClass = css({
      height: '100%',
      flex: '1 0 auto',
      '& .leaflet-bottom.leaflet-right .leaflet-control button,a': {
        '&:hover': {
          color: '#347865 !important',
        },
        '&:focused': {
          color: '#347865 !important',
        },
      },
      '&:focus': {
        margin: '4px 4px 4px 0px',
        height: 'calc(100% - 8px)',
        outline: '2px solid transparent',
        boxShadow: `0 0 0 4px ${theme.palette.focusBorder.main}`,
      },
      zIndex: theme.zIndex.forward,
    });
    const mapNoSidebarClass = css({
      '&:focus': {
        margin: 4,
      },
    });
    const locationButtonFocusClass = css({
      outline: '2px solid transparent',
      boxShadow: `0 0 0 3px ${theme.palette.primary.highContrast}, 0 0 0 4px ${theme.palette.focusBorder.main}`,
    });
    return (
      <>
        <MapContainer
          tap={false} // This should fix leaflet safari double click bug
          preferCanvas
          className={`${mapClass} ${embedded ? mapNoSidebarClass : ''} `}
          key={mapObject.options.name}
          zoomControl={false}
          bounds={getBoundsFromBbox(defaultBounds?.split(','))}
          doubleClickZoom={false}
          crs={mapObject.crs}
          center={!defaultBounds ? center : null}
          zoom={zoom}
          minZoom={mapObject.options.minZoom}
          maxZoom={mapObject.options.maxZoom}
          unitZoom={mapObject.options.unitZoom}
          detailZoom={mapObject.options.detailZoom}
          maxBounds={mapObject.options.mapBounds || mapOptions.defaultMaxBounds}
          maxBoundsViscosity={1.0}
          whenCreated={(map) => {
            setMapElement(map);
            setMapRef(map);
          }}
        >
          {eventSearch
            ? <EventMarkers searchData={unitData} />
            : (
              <MarkerCluster
                data={unitData}
                measuringMode={measuringMode}
                disableInteraction={disableInteraction}
              />
            )
          }
          {
            renderUnitGeometry()
          }
          {mapObject.options.name === 'ortographic' && mapObject.options.wmsUrl !== 'undefined'
            ? ( // Use WMS service for ortographic maps, because HSY's WMTS tiling does not work
              <WMSTileLayer
                url={mapObject.options.wmsUrl}
                layers={mapObject.options.wmsLayerName}
                attribution={intl.formatMessage({ id: mapObject.options.attribution })}
              />
            )
            : (
              <TileLayer
                url={mapObject.options.url}
                attribution={intl.formatMessage({ id: mapObject.options.attribution })}
              />
            )}
          {showLoadingScreen ? (
            <StyledLoadingScreenContainer>
              <Loading reducer={showLoadingReducer} hideNumbers={hideLoadingNumbers} />
            </StyledLoadingScreenContainer>
          ) : null}
          <StatisticalDistricts />
          <Districts mapOptions={mapOptions} embedded={embedded} />
          <TransitStops mapObject={mapObject} />

          {!embedded && !measuringMode && (
            // Draw address popoup on mapclick to map
            <AddressPopup navigator={navigator} />
          )}

          {currentPage === 'address' && (
            <AddressMarker embedded={embedded} />
          )}

          {currentPage === 'unit' && highlightedUnit?.entrances?.length && unitHasLocationAndGeometry(highlightedUnit) && (
            <EntranceMarker />
          )}

          {!hideUserMarker && userLocation && (
            <UserMarker
              position={[userLocation.latitude, userLocation.longitude]}
              onClick={() => {
                navigateToAddress({ lat: userLocation.latitude, lng: userLocation.longitude });
              }}
            />
          )}

          {measuringMode && (
            <DistanceMeasure
              markerArray={measuringMarkers}
              setMarkerArray={setMeasuringMarkers}
              lineArray={measuringLine}
              setLineArray={setMeasuringLine}
            />
          )}

          <CustomControls position="topleft">
            {!isMobile && !embedded && toggleSidebar ? (
              <HideSidebarButton
                sidebarHidden={sidebarHidden}
                toggleSidebar={toggleSidebar}
              />
            ) : null}
          </CustomControls>

          <CustomControls position="topright">
            <SimpleStatisticalComponent />
          </CustomControls>

          {!disableInteraction
            ? (
              <CustomControls position="bottomright">
                {!embedded ? (
                /* Custom user location map button */
                  <div key="userLocation" className="UserLocation">
                    <StyledShowLocationButton
                      aria-hidden
                      aria-label={userLocationAriaLabel}
                      disabled={!userLocation}
                      onClick={() => focusOnUser()}
                      focusVisibleClassName={locationButtonFocusClass}
                    >
                      {userLocation ? <StyledMyLocation /> : <StyledLocationDisabled />}
                    </StyledShowLocationButton>
                  </div>
                ) : null}

                <PanControl key="panControl" />
              </CustomControls>
            )
            : null}
          <CoordinateMarker position={getCoordinatesFromUrl()} />
          <EmbeddedActions />
        </MapContainer>
      </>
    );
  }
  return null;
};

export default withRouter(MapView);

const StyledLoadingScreenContainer = styled.div(({ theme }) => ({
  height: '100%',
  width: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: theme.zIndex.infront,
}));

const StyledShowLocationButton = styled(ButtonBase)(({ theme, disabled }) => {
  const styles = {
    marginRight: -3,
    backgroundColor: theme.palette.primary.main,
    width: 40,
    height: 40,
    borderRadius: '50%',
    '&:hover': {
      backgroundColor: theme.palette.primary.highContrast,
      '& svg': {
        color: theme.palette.primary.main,
      },
    },
  };
  if (disabled) {
    Object.assign(styles, {
      backgroundColor: theme.palette.disabled.strong,
    });
  }
  return styles;
});

const StyledMyLocation = styled(MyLocation)(() => ({
  color: '#fff',
}));

const StyledLocationDisabled = styled(LocationDisabled)(() => ({
  color: '#fff',
}));

// Typechecking
MapView.propTypes = {
  hideUserMarker: PropTypes.bool,
  highlightedDistrict: PropTypes.objectOf(PropTypes.any),
  highlightedUnit: PropTypes.objectOf(PropTypes.any),
  isMobile: PropTypes.bool,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  findUserLocation: PropTypes.func.isRequired,
  setMapRef: PropTypes.func.isRequired,
  unitsLoading: PropTypes.bool,
  userLocation: PropTypes.objectOf(PropTypes.any),
  measuringMode: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func,
  sidebarHidden: PropTypes.bool,
  disableInteraction: PropTypes.bool,
};

MapView.defaultProps = {
  hideUserMarker: false,
  highlightedDistrict: null,
  highlightedUnit: null,
  isMobile: false,
  unitsLoading: false,
  toggleSidebar: null,
  sidebarHidden: false,
  userLocation: null,
  disableInteraction: false,
};
