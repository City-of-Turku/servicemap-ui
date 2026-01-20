import React, { useEffect, useState } from 'react';
import { format, subDays } from 'date-fns';
import { useIntl } from 'react-intl';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { fetchUnitMaintenanceData } from '../mobilityPlatformRequests/mobilityPlatformRequests';

const SportsFacilitiesMaintenance = () => {
  const intl = useIntl();
  const {
    sportsMaintenancePeriod,
    showSkiTrails,
    showIceTracks,
    isActiveSportsMaintenance,
    setIsActiveSportsMaintenance,
  } = useMobilityPlatformContext();

  const [skiTrails1Day, setSkiTrails1Day] = useState([]);
  const [skiTrails3Days, setSkiTrails3Days] = useState([]);
  const [skiTrailsOver3Days, setSkiTrailsOver3Days] = useState([]);
  const [iceTracks, setIceTracks] = useState([]);
  const [iceTracksGeometries, setIceTracksGeometries] = useState([]);
  const [skiTrailsGeometries, setSkiTrailsGeometries] = useState([]);
  const [allSkiTrailsGeometries, setAllSkiTrailsGeometries] = useState([]);

  const { Polyline, Marker, Popup } = global.rL;

  const currentDate = new Date();

  // Fetch ski trails maintenance data
  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    if (showSkiTrails) {
      fetchUnitMaintenanceData(
        {
          target: 'SKI_TRAIL',
          page_size: 1000,
        },
        allData => {
          const now = new Date();
          const oneDay = [];
          const threeDays = [];
          const over3Days = [];

          allData.forEach(item => {
            if (!item.maintained_at) {
              over3Days.push(item);
            } else {
              const maintainedDate = new Date(item.maintained_at);
              const daysDiff = (now - maintainedDate) / (1000 * 60 * 60 * 24);
              if (daysDiff <= 1) {
                oneDay.push(item);
              } else if (daysDiff <= 3) {
                threeDays.push(item);
              } else {
                over3Days.push(item);
              }
            }
          });

          setSkiTrails1Day(oneDay);
          setSkiTrails3Days(threeDays);
          setSkiTrailsOver3Days(over3Days);
        },
        signal,
      );
    } else {
      setSkiTrails1Day([]);
      setSkiTrails3Days([]);
      setSkiTrailsOver3Days([]);
    }

    if (showIceTracks) {
      fetchUnitMaintenanceData(
        {
          target: 'ICE_TRACK',
          page_size: 1000,
        },
        setIceTracks,
        signal,
      );
    } else {
      setIceTracks([]);
    }

    return () => {
      abortController.abort();
    };
  }, [showSkiTrails, showIceTracks]);

  // Extract geometries from unit maintenance data (geometries are nested in the response)
  useEffect(() => {
    const iceGeometries = [];
    iceTracks.forEach(maintenance => {
      if (maintenance.geometries && Array.isArray(maintenance.geometries)) {
        maintenance.geometries.forEach(geom => {
          iceGeometries.push({
            ...geom,
            unit_maintenance: maintenance.id,
            maintenance_data: maintenance,
          });
        });
      }
    });
    setIceTracksGeometries(iceGeometries);

    // Extract ski trails geometries from ALL maintenance data
    // Combine all periods to get complete list
    const allSkiTrails = [...skiTrails1Day, ...skiTrails3Days, ...skiTrailsOver3Days];

    // Use a Map to deduplicate by geometry ID (in case same geometry appears in multiple periods)
    const geometryMap = new Map();

    allSkiTrails.forEach(maintenance => {
      if (maintenance.geometries && Array.isArray(maintenance.geometries)) {
        maintenance.geometries.forEach(geom => {
          // Store with geometry ID as key to avoid duplicates
          if (!geometryMap.has(geom.id)) {
            geometryMap.set(geom.id, {
              ...geom,
              unit_maintenance: maintenance.id,
              maintenance_data: maintenance,
            });
          }
        });
      }
    });

    const skiGeometries = Array.from(geometryMap.values());
    setSkiTrailsGeometries(skiGeometries);
    setAllSkiTrailsGeometries([]);
  }, [iceTracks, skiTrails1Day, skiTrails3Days, skiTrailsOver3Days]);

  const hasValidData = () => {
    if (showSkiTrails) {
      return skiTrailsGeometries.length > 0;
    }
    if (showIceTracks) {
      return iceTracks.length > 0 && iceTracksGeometries.length > 0;
    }
    return false;
  };

  useEffect(() => {
    setIsActiveSportsMaintenance(hasValidData());
  }, [showSkiTrails, showIceTracks, skiTrails1Day, skiTrails3Days, skiTrailsOver3Days, iceTracks, skiTrailsGeometries, iceTracksGeometries, setIsActiveSportsMaintenance]);

  const colorValues = {
    green: 'rgba(15, 115, 6, 255)',
    orange: 'rgba(227, 97, 32, 255)',
    red: 'rgba(240, 22, 22, 255)',
    gray: 'rgba(128, 128, 128, 255)',
  };

  const getIceTrackColor = condition => {
    switch (condition) {
      case 'USABLE':
        return colorValues.green;
      case 'UNUSABLE':
        return colorValues.orange;
      default:
        return colorValues.gray;
    }
  };

  const getSkiTrailColor = period => {
    switch (period) {
      case '1day':
        return colorValues.green;
      case '3days':
        return colorValues.orange;
      case 'over3days':
        return colorValues.red;
      default:
        return colorValues.gray;
    }
  };

  const getSkiTrailPeriod = maintainedAt => {
    if (!maintainedAt) return 'over3days';
    const maintainedDate = new Date(maintainedAt);
    const daysDiff = (currentDate - maintainedDate) / (1000 * 60 * 60 * 24);
    if (daysDiff <= 1) return '1day';
    if (daysDiff <= 3) return '3days';
    return 'over3days';
  };

  const renderIceTracks = () => {
    if (!showIceTracks || iceTracksGeometries.length === 0) {
      return null;
    }

    const elements = [];
    iceTracksGeometries.forEach((geom, index) => {
      const maintenance = geom.maintenance_data;
      if (!maintenance || !geom.geometry) return;

      const color = getIceTrackColor(maintenance.condition);
      const geomType = geom.geometry.type;

      if (geomType === 'LineString' && geom.geometry.coordinates) {
        // GeoJSON coordinates are [lon, lat], Leaflet needs [lat, lon]
        const coords = geom.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        elements.push(
          <Polyline
            key={`ice-track-${geom.unit_maintenance}-${index}`}
            pathOptions={{
              color: color,
              weight: 4,
              opacity: 0.8,
            }}
            positions={coords}
          >
            <Popup>
              <div>
                <strong>{intl.formatMessage({ id: 'mobilityPlatform.popup.iceTrack.title' })}</strong>
                <br />
                {maintenance.condition === 'USABLE' 
                  ? intl.formatMessage({ id: 'mobilityPlatform.popup.iceTrack.status.usable' })
                  : maintenance.condition === 'UNUSABLE'
                    ? intl.formatMessage({ id: 'mobilityPlatform.popup.iceTrack.status.unusable' })
                    : intl.formatMessage({ id: 'mobilityPlatform.popup.iceTrack.status.undefined' })}
                {maintenance.unit && (
                  <>
                    <br />
                    {intl.formatMessage({ id: 'mobilityPlatform.popup.unitId' })}
                    {maintenance.unit}
                  </>
                )}
              </div>
            </Popup>
          </Polyline>,
        );
      } else if (geomType === 'Point' && geom.geometry.coordinates) {
        const [lon, lat] = geom.geometry.coordinates;
        elements.push(
          <Marker
            key={`ice-track-marker-${geom.unit_maintenance}-${index}`}
            position={[lat, lon]}
          >
            <Popup>
              <div>
                <strong>{intl.formatMessage({ id: 'mobilityPlatform.popup.iceTrack.title' })}</strong>
                <br />
                {maintenance.condition === 'USABLE' 
                  ? intl.formatMessage({ id: 'mobilityPlatform.popup.iceTrack.status.usable' })
                  : maintenance.condition === 'UNUSABLE'
                    ? intl.formatMessage({ id: 'mobilityPlatform.popup.iceTrack.status.unusable' })
                    : intl.formatMessage({ id: 'mobilityPlatform.popup.iceTrack.status.undefined' })}
                {maintenance.unit && (
                  <>
                    <br />
                    {intl.formatMessage({ id: 'mobilityPlatform.popup.unitId' })}
                    {maintenance.unit}
                  </>
                )}
              </div>
            </Popup>
          </Marker>,
        );
      }
    });

    return elements;
  };

  const renderSkiTrails = () => {
    if (!showSkiTrails) {
      return null;
    }

    // Create a map of geometry IDs to maintenance data for quick lookup
    const allMaintenance = [...skiTrails1Day, ...skiTrails3Days, ...skiTrailsOver3Days];
    const maintenanceMap = new Map();
    allMaintenance.forEach(maint => {
      if (maint.geometries && Array.isArray(maint.geometries)) {
        maint.geometries.forEach(geom => {
          maintenanceMap.set(geom.id, maint);
        });
      }
    });

    // Determine which geometry IDs should be highlighted based on selected period
    const highlightedGeometryIds = new Set();
    if (sportsMaintenancePeriod) {
      if (sportsMaintenancePeriod === '1day') {
        skiTrails1Day.forEach(item => {
          if (item.geometries && Array.isArray(item.geometries)) {
            item.geometries.forEach(geom => highlightedGeometryIds.add(geom.id));
          }
        });
      } else if (sportsMaintenancePeriod === '3days') {
        skiTrails3Days.forEach(item => {
          if (item.geometries && Array.isArray(item.geometries)) {
            item.geometries.forEach(geom => highlightedGeometryIds.add(geom.id));
          }
        });
      } else if (sportsMaintenancePeriod === 'over3days') {
        skiTrailsOver3Days.forEach(item => {
          if (item.geometries && Array.isArray(item.geometries)) {
            item.geometries.forEach(geom => highlightedGeometryIds.add(geom.id));
          }
        });
      }
    }

    if (skiTrailsGeometries.length === 0) {
      return null;
    }

    const elements = [];

    skiTrailsGeometries.forEach((geom, index) => {
      if (!geom.geometry) {
        console.warn(`Geometry ${geom.id} has no geometry data`);
        return;
      }

      const maintenance = geom.maintenance_data;
      const isHighlighted = highlightedGeometryIds.has(geom.id);

      let color = colorValues.gray;
      if (maintenance) {
        if (sportsMaintenancePeriod && isHighlighted) {
          // Period selected and this geometry matches - show maintenance color
          const period = getSkiTrailPeriod(maintenance.maintained_at);
          color = getSkiTrailColor(period);
        } else if (!sportsMaintenancePeriod) {
          // No period selected - show all with their maintenance colors
          const period = getSkiTrailPeriod(maintenance.maintained_at);
          color = getSkiTrailColor(period);
        }
      }

      const geomType = geom.geometry.type;

      if (geomType === 'LineString' && geom.geometry.coordinates) {
        // GeoJSON coordinates are [lon, lat], Leaflet needs [lat, lon]
        const coords = geom.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        elements.push(
          <Polyline
            key={`ski-trail-${geom.id}-${index}`}
            pathOptions={{
              color,
              weight: 4,
              opacity: 0.8,
            }}
            positions={coords}
          >
            <Popup>
              <div>
                <strong>{intl.formatMessage({ id: 'mobilityPlatform.popup.skiTrail.title' })}</strong>
                <br />
                {maintenance && maintenance.maintained_at ? (
                  <>
                    {intl.formatMessage({ id: 'mobilityPlatform.popup.skiTrail.maintainedAt' })}
                    {new Date(maintenance.maintained_at).toLocaleString(intl.locale)}
                  </>
                ) : (
                  intl.formatMessage({ id: 'mobilityPlatform.popup.skiTrail.maintainedAt.unknown' })
                )}
                {maintenance && maintenance.unit && (
                  <>
                    <br />
                    {intl.formatMessage({ id: 'mobilityPlatform.popup.unitId' })}
                    {maintenance.unit}
                  </>
                )}
              </div>
            </Popup>
          </Polyline>,
        );
      } else if (geomType === 'Point' && geom.geometry.coordinates) {
        const [lon, lat] = geom.geometry.coordinates;
        elements.push(
          <Marker
            key={`ski-trail-marker-${geom.id}-${index}`}
            position={[lat, lon]}
          >
            <Popup>
              <div>
                <strong>{intl.formatMessage({ id: 'mobilityPlatform.popup.skiTrail.title' })}</strong>
                <br />
                {maintenance && maintenance.maintained_at ? (
                  <>
                    {intl.formatMessage({ id: 'mobilityPlatform.popup.skiTrail.maintainedAt' })}
                    {new Date(maintenance.maintained_at).toLocaleString(intl.locale)}
                  </>
                ) : (
                  intl.formatMessage({ id: 'mobilityPlatform.popup.skiTrail.maintainedAt.unknown' })
                )}
                {maintenance && maintenance.unit && (
                  <>
                    <br />
                    {intl.formatMessage({ id: 'mobilityPlatform.popup.unitId' })}
                    {maintenance.unit}
                  </>
                )}
              </div>
            </Popup>
          </Marker>,
        );
      }
    });

    return elements;
  };

  if (!showSkiTrails && !showIceTracks) {
    return null;
  }

  return (
    <>
      {renderIceTracks()}
      {renderSkiTrails()}
    </>
  );
};

export default SportsFacilitiesMaintenance;
