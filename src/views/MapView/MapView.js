/* eslint-disable global-require */
import { ButtonBase, Tooltip as MUITooltip } from '@material-ui/core';
import { LocationDisabled, MyLocation } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import config from '../../../config';
import Loading from '../../components/Loading';
import HomeLogo from '../../components/Logos/HomeLogo';
import { getSelectedUnitEvents } from '../../redux/selectors/selectedUnit';
import { parseSearchParams } from '../../utils';
import { useNavigationParams } from '../../utils/address';
import { isEmbed } from '../../utils/path';
import MobilityPlatformMapView from '../MobilityPlatformMapView';
import AddressMarker from './components/AddressMarker';
import AddressPopup from './components/AddressPopup';
import CoordinateMarker from './components/CoordinateMarker';
import CustomControls from './components/CustomControls';
import DistanceMeasure from './components/DistanceMeasure';
import Districts from './components/Districts';
import EntranceMarker from './components/EntranceMarker';
import EventMarkers from './components/EventMarkers';
import HideSidebarButton from './components/HideSidebarButton';
import MarkerCluster from './components/MarkerCluster';
import PanControl from './components/PanControl';
import TransitStops from './components/TransitStops';
import UnitGeometry from './components/UnitGeometry';
import UserMarker from './components/UserMarker';
import { mapOptions } from './config/mapConfig';
import adjustControlElements from './utils';
import CreateMap from './utils/createMap';
import fetchAddress from './utils/fetchAddress';
import { focusToPosition, getBoundsFromBbox } from './utils/mapActions';
import MapUtility from './utils/mapUtility';

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
    addressToRender,
    addressUnits,
    adminDistricts,
    classes,
    currentPage,
    intl,
    location,
    settings,
    unitList,
    unitsLoading,
    serviceUnits,
    districtUnits,
    districtViewFetching,
    hideUserMarker,
    highlightedUnit,
    highlightedDistrict,
    isMobile,
    setMapRef,
    navigator,
    findUserLocation,
    userLocation,
    locale,
    measuringMode,
    toggleSidebar,
    sidebarHidden,
    showMobilityPlatform,
  } = props;

  // State
  const [mapObject, setMapObject] = useState(null);
  const [mapElement, setMapElement] = useState(null);
  const [prevMap, setPrevMap] = useState(null);
  const [unitData, setUnitData] = useState(null);
  const [mapUtility, setMapUtility] = useState(null);
  const [measuringMarkers, setMeasuringMarkers] = useState([]);
  const [measuringLine, setMeasuringLine] = useState([]);

  const embedded = isEmbed({ url: location.pathname });
  const getAddressNavigatorParams = useNavigationParams();
  const districtUnitsFetch = useSelector(state => state.districts.unitFetch);

  // This unassigned selector is used to trigger re-render after events are fetched
  useSelector(state => getSelectedUnitEvents(state));

  // If external theme (by Turku) is true, then can be used to select which components to render
  const externalTheme = config.themePKG;
  const isExternalTheme = !externalTheme || externalTheme === 'undefined' ? null : externalTheme;

  const getMapUnits = () => {
    let mapUnits = [];

    if (embedded && parseSearchParams(location.search).units === 'none') {
      return [];
    }
    if (currentPage === 'home' && embedded) {
      mapUnits = unitList;
    }
    if (
      currentPage === 'search'
      || currentPage === 'division'
      || (currentPage === 'unit' && unitList.length)
    ) {
      mapUnits = unitList;
    } else if (currentPage === 'address') {
      switch (addressToRender) {
        case 'adminDistricts':
          mapUnits = adminDistricts
            ? adminDistricts
              .filter(d => d.unit)
              .reduce((unique, o) => {
                // Ignore districts without unit
                if (!o.unit) {
                  return unique;
                }
                // Add only unique units
                if (!unique.some(obj => obj.id === o.unit.id)) {
                  unique.push(o.unit);
                }
                return unique;
              }, [])
            : [];
          break;
        case 'units':
          mapUnits = addressUnits;
          break;
        default:
          mapUnits = [];
      }
    } else if (currentPage === 'service' && serviceUnits && !unitsLoading) {
      mapUnits = serviceUnits;
    } else if (currentPage === 'area' && districtUnits) {
      mapUnits = districtUnits;
    } else if (
      (currentPage === 'unit' || currentPage === 'fullList' || currentPage === 'event')
      && highlightedUnit
    ) {
      mapUnits = [highlightedUnit];
    }

    return mapUnits;
  };

  const initializeMap = () => {
    if (mapElement) {
      // If changing map type, save current map viewport values before changing map
      const map = mapElement;
      map.defaultZoom = mapObject.options.zoom;
      setPrevMap(map);
    }
    // Search param map value
    const spMap = parseSearchParams(location.search).map || false;
    const mapType = spMap || (embedded ? 'servicemap' : settings.mapType);

    const newMap = CreateMap(mapType, locale);
    setMapObject(newMap);
  };

  const focusOnUser = () => {
    if (userLocation) {
      focusToPosition(mapElement, [userLocation.longitude, userLocation.latitude]);
    } else if (!embedded) {
      findUserLocation();
    }
  };

  const navigateToAddress = (latLng) => {
    fetchAddress(latLng).then((data) => {
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

  useEffect(() => {
    // On map mount
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

  useEffect(() => {
    // On map type change
    // Init new map and set new ref to redux
    initializeMap();
  }, [settings.mapType]);

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

  // Attempt to render unit markers on page change or unitList change
  useEffect(() => {
    setUnitData(getMapUnits());
  }, [
    unitList,
    highlightedUnit,
    addressUnits,
    serviceUnits,
    districtUnits,
    highlightedDistrict,
    currentPage,
  ]);

  useEffect(() => {
    if (!measuringMode) {
      setMeasuringMarkers([]);
      setMeasuringLine([]);
    }
  }, [measuringMode]);

  // Render

  const renderEmbedOverlay = () => {
    if (!embedded) {
      return null;
    }
    const openApp = () => {
      const url = window.location.href;
      window.open(url.replace('/embed', ''));
    };
    return (
      <ButtonBase onClick={openApp}>
        <MUITooltip title={intl.formatMessage({ id: 'embed.click_prompt_move' })}>
          <HomeLogo aria-hidden className={classes.embedLogo} />
        </MUITooltip>
      </ButtonBase>
    );
  };

  const renderUnitGeometry = () => {
    if (highlightedDistrict) return null;
    if (currentPage !== 'unit') {
      return unitData.map(unit => (unit.geometry ? <UnitGeometry key={unit.id} data={unit} /> : null));
    }
    if (highlightedUnit) {
      return <UnitGeometry data={highlightedUnit} />;
    }
    return null;
  };

  const llMapHasMapPane = (leafLetMap) => {
    // `getCenter()` call requires existence of mapPane (what ever that means). So check for that before calling it. Just another null check.
    const panes = leafLetMap.getPanes();
    return !!panes && !!panes.mapPane;
  };

  if (global.rL && mapObject) {
    const { MapContainer, TileLayer, WMSTileLayer } = global.rL || {};
    let center = mapOptions.initialPosition;
    let zoom = isMobile ? mapObject.options.mobileZoom : mapObject.options.zoom;
    if (prevMap && llMapHasMapPane(prevMap)) {
      // If changing map type, use viewport values of previuous map
      center = prevMap.getCenter() || prevMap.options.center;
      /* Different map types have different zoom levels
      Use the zoom difference to calculate the new zoom level */
      const zoomDifference = mapObject.options.zoom - prevMap.defaultZoom;
      zoom = prevMap.getZoom()
        ? prevMap.getZoom() + zoomDifference
        : prevMap.options.zoom + zoomDifference;
    }

    const showLoadingScreen = districtViewFetching || (embedded && unitsLoading);
    const userLocationAriaLabel = intl.formatMessage({
      id: !userLocation ? 'location.notAllowed' : 'location.center',
    });
    const eventSearch = parseSearchParams(location.search).events;
    const defaultBounds = parseSearchParams(location.search).bbox;

    return (
      <>
        {renderEmbedOverlay()}
        <MapContainer
          tap={false} // This should fix leaflet safari double click bug
          preferCanvas
          className={`${classes.map} ${embedded ? classes.mapNoSidebar : ''} `}
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
          {eventSearch ? (
            <EventMarkers searchData={unitData} />
          ) : (
            <MarkerCluster
              data={currentPage === 'unit' && highlightedUnit ? [highlightedUnit] : unitData}
              measuringMode={measuringMode}
            />
          )}
          {renderUnitGeometry()}
          {mapObject.options.name === 'ortographic' && mapObject.options.wmsUrl !== 'undefined' ? (
            // Use WMS service for ortographic maps, because HSY's WMTS tiling does not work
            <WMSTileLayer
              url={mapObject.options.wmsUrl}
              layers={mapObject.options.wmsLayerName}
              attribution={intl.formatMessage({ id: mapObject.options.attribution })}
            />
          ) : (
            <TileLayer
              url={mapObject.options.url}
              attribution={intl.formatMessage({ id: mapObject.options.attribution })}
            />
          )}
          {showLoadingScreen ? (
            <div className={classes.loadingScreen}>
              <Loading reducer={districtUnitsFetch.isFetching ? districtUnitsFetch : null} />
            </div>
          ) : null}
          <Districts mapOptions={mapOptions} embedded={embedded} />
          {/* Turku does not yet have data to render this */}
          {!isExternalTheme ? <TransitStops mapObject={mapObject} /> : null}

          {!embedded && !measuringMode && (
            // Draw address popoup on mapclick to map
            <AddressPopup navigator={navigator} />
          )}

          {currentPage === 'address' && <AddressMarker embedded={embedded} />}

          {currentPage === 'unit' && highlightedUnit?.entrances?.length && <EntranceMarker />}

          {!hideUserMarker && userLocation && (
            <UserMarker
              position={[userLocation.latitude, userLocation.longitude]}
              classes={classes}
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
              <HideSidebarButton sidebarHidden={sidebarHidden} toggleSidebar={toggleSidebar} />
            ) : null}
          </CustomControls>
          <CustomControls position="bottomright">
            {!embedded ? (
              /* Custom user location map button */
              <div key="userLocation" className="UserLocation">
                <ButtonBase
                  aria-hidden
                  aria-label={userLocationAriaLabel}
                  disabled={!userLocation}
                  className={`${classes.showLocationButton} ${
                    !userLocation ? classes.locationDisabled : ''
                  }`}
                  onClick={() => focusOnUser()}
                  focusVisibleClassName={classes.locationButtonFocus}
                >
                  {userLocation ? (
                    <MyLocation className={classes.showLocationIcon} />
                  ) : (
                    <LocationDisabled className={classes.showLocationIcon} />
                  )}
                </ButtonBase>
              </div>
            ) : null}

            <PanControl key="panControl" />
          </CustomControls>
          <CoordinateMarker position={getCoordinatesFromUrl()} />
          <EmbeddedActions />
          {showMobilityPlatform ? <MobilityPlatformMapView /> : null}
        </MapContainer>
      </>
    );
  }
  return null;
};

export default withRouter(MapView);

// Typechecking
MapView.propTypes = {
  addressToRender: PropTypes.string,
  addressUnits: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  adminDistricts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      ocd_id: PropTypes.string,
    }),
  ),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  currentPage: PropTypes.string.isRequired,
  hideUserMarker: PropTypes.bool,
  highlightedDistrict: PropTypes.objectOf(PropTypes.any),
  highlightedUnit: PropTypes.objectOf(PropTypes.any),
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  isMobile: PropTypes.bool,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  serviceUnits: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  districtUnits: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  districtViewFetching: PropTypes.bool.isRequired,
  findUserLocation: PropTypes.func.isRequired,
  setMapRef: PropTypes.func.isRequired,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
  unitList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  unitsLoading: PropTypes.bool,
  userLocation: PropTypes.objectOf(PropTypes.any),
  locale: PropTypes.string.isRequired,
  measuringMode: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func,
  sidebarHidden: PropTypes.bool,
  showMobilityPlatform: PropTypes.bool,
};

MapView.defaultProps = {
  addressToRender: null,
  addressUnits: null,
  adminDistricts: null,
  hideUserMarker: false,
  highlightedDistrict: null,
  highlightedUnit: null,
  isMobile: false,
  navigator: null,
  serviceUnits: null,
  districtUnits: null,
  unitList: null,
  unitsLoading: false,
  toggleSidebar: null,
  sidebarHidden: false,
  userLocation: null,
  showMobilityPlatform: true,
};
