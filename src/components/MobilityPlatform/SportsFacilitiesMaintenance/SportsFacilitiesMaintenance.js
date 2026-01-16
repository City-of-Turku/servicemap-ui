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

  const { Polyline, Marker, Popup } = global.rL;

  const currentDate = new Date();
  const oneDayAgo = format(subDays(currentDate, 1), "yyyy-MM-dd HH:mm:ss");
  const threeDaysAgo = format(subDays(currentDate, 3), "yyyy-MM-dd HH:mm:ss");

  // Fetch ski trails maintenance data
  useEffect(() => {
    if (showSkiTrails || showIceTracks) {
      const abortController = new AbortController();
      const signal = abortController.signal;

      // Fetch ski trails - 1 day
      fetchUnitMaintenanceData(
        {
          target: 'SKI_TRAIL',
          maintained_at__gte: oneDayAgo,
          page_size: 1000,
        },
        setSkiTrails1Day,
        signal,
      );

      // Fetch ski trails - 3 days
      fetchUnitMaintenanceData(
        {
          target: 'SKI_TRAIL',
          maintained_at__gte: threeDaysAgo,
          maintained_at__lte: oneDayAgo,
          page_size: 1000,
        },
        setSkiTrails3Days,
        signal,
      );

      // Fetch ski trails - over 3 days (maintained more than 3 days ago or null)
      fetchUnitMaintenanceData(
        {
          target: 'SKI_TRAIL',
          maintained_at__lte: threeDaysAgo,
          page_size: 1000,
        },
        setSkiTrailsOver3Days,
        signal,
      );

      // Fetch ice tracks (all)
      fetchUnitMaintenanceData(
        {
          target: 'ICE_TRACK',
          page_size: 1000,
        },
        setIceTracks,
        signal,
      );

      return () => {
        abortController.abort();
      };
    }
  }, [showSkiTrails, showIceTracks, oneDayAgo, threeDaysAgo]);

  // Extract geometries from unit maintenance data (geometries are nested in the response)
  useEffect(() => {
    // Extract ice tracks geometries
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

    // Extract ski trails geometries
    const allSkiTrails = [...skiTrails1Day, ...skiTrails3Days, ...skiTrailsOver3Days];
    const skiGeometries = [];
    allSkiTrails.forEach(maintenance => {
      if (maintenance.geometries && Array.isArray(maintenance.geometries)) {
        maintenance.geometries.forEach(geom => {
          skiGeometries.push({
            ...geom,
            unit_maintenance: maintenance.id,
            maintenance_data: maintenance,
          });
        });
      }
    });
    setSkiTrailsGeometries(skiGeometries);
  }, [iceTracks, skiTrails1Day, skiTrails3Days, skiTrailsOver3Days]);

  // Determine if data is valid
  const hasValidData = () => {
    if (showSkiTrails) {
      const hasSkiTrails = skiTrails1Day.length > 0 || skiTrails3Days.length > 0 || skiTrailsOver3Days.length > 0;
      return hasSkiTrails && skiTrailsGeometries.length > 0;
    }
    if (showIceTracks) {
      return iceTracks.length > 0 && iceTracksGeometries.length > 0;
    }
    return false;
  };

  useEffect(() => {
    setIsActiveSportsMaintenance(hasValidData());
  }, [showSkiTrails, showIceTracks, skiTrails1Day, skiTrails3Days, skiTrailsOver3Days, iceTracks, skiTrailsGeometries, iceTracksGeometries, setIsActiveSportsMaintenance]);

  // Color values matching SportsFacilitiesMaintenanceList.js
  const colorValues = {
    green: 'rgba(15, 115, 6, 255)',
    orange: 'rgba(227, 97, 32, 255)',
    red: 'rgba(240, 22, 22, 255)',
  };

  // Get color for ice track based on condition
  const getIceTrackColor = (condition) => {
    switch (condition) {
      case 'USABLE':
        return colorValues.green;
      case 'UNUSABLE':
        return colorValues.orange;
      default:
        return 'rgba(128, 128, 128, 255)'; // gray for undefined
    }
  };

  // Get color for ski trail based on maintenance period
  const getSkiTrailColor = (period) => {
    switch (period) {
      case '1day':
        return colorValues.green; // green - maintained within 1 day
      case '3days':
        return colorValues.orange; // orange - maintained 1-3 days ago
      case 'over3days':
        return colorValues.red; // red - maintained over 3 days ago
      default:
        return 'rgba(128, 128, 128, 255)'; // gray
    }
  };

  // Get ski trail period based on maintained_at date
  const getSkiTrailPeriod = (maintainedAt) => {
    if (!maintainedAt) return 'over3days';
    const maintainedDate = new Date(maintainedAt);
    const daysDiff = (currentDate - maintainedDate) / (1000 * 60 * 60 * 24);
    if (daysDiff <= 1) return '1day';
    if (daysDiff <= 3) return '3days';
    return 'over3days';
  };

  // Render ice tracks
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
                    {intl.formatMessage({ id: 'mobilityPlatform.popup.unitId' })}: {maintenance.unit}
                  </>
                )}
              </div>
            </Popup>
          </Polyline>
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
                    {intl.formatMessage({ id: 'mobilityPlatform.popup.unitId' })}: {maintenance.unit}
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        );
      }
    });

    return elements;
  };

  // Render ski trails
  const renderSkiTrails = () => {
    if (!showSkiTrails || skiTrailsGeometries.length === 0) {
      return null;
    }

    // Filter geometries based on selected period
    let filteredGeometries = skiTrailsGeometries;
    if (sportsMaintenancePeriod) {
      const maintenanceIds = new Set();
      if (sportsMaintenancePeriod === '1day') {
        skiTrails1Day.forEach(item => maintenanceIds.add(item.id));
      } else if (sportsMaintenancePeriod === '3days') {
        skiTrails3Days.forEach(item => maintenanceIds.add(item.id));
      } else if (sportsMaintenancePeriod === 'over3days') {
        skiTrailsOver3Days.forEach(item => maintenanceIds.add(item.id));
      }
      filteredGeometries = skiTrailsGeometries.filter(geom => maintenanceIds.has(geom.unit_maintenance));
    }

    if (filteredGeometries.length === 0) {
      return null;
    }

    const elements = [];
    filteredGeometries.forEach((geom, index) => {
      const maintenance = geom.maintenance_data;
      if (!maintenance || !geom.geometry) return;

      const period = getSkiTrailPeriod(maintenance.maintained_at);
      const color = getSkiTrailColor(period);
      const geomType = geom.geometry.type;

      if (geomType === 'LineString' && geom.geometry.coordinates) {
        // GeoJSON coordinates are [lon, lat], Leaflet needs [lat, lon]
        const coords = geom.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        elements.push(
          <Polyline
            key={`ski-trail-${geom.unit_maintenance}-${index}`}
            pathOptions={{
              color: color,
              weight: 4,
              opacity: 0.8,
            }}
            positions={coords}
          >
            <Popup>
              <div>
                <strong>{intl.formatMessage({ id: 'mobilityPlatform.popup.skiTrail.title' })}</strong>
                <br />
                {intl.formatMessage({ id: 'mobilityPlatform.popup.skiTrail.maintainedAt' })}: {maintenance.maintained_at
                  ? new Date(maintenance.maintained_at).toLocaleString(intl.locale)
                  : intl.formatMessage({ id: 'mobilityPlatform.popup.skiTrail.maintainedAt.unknown' })}
                {maintenance.unit && (
                  <>
                    <br />
                    {intl.formatMessage({ id: 'mobilityPlatform.popup.unitId' })}: {maintenance.unit}
                  </>
                )}
              </div>
            </Popup>
          </Polyline>
        );
      } else if (geomType === 'Point' && geom.geometry.coordinates) {
        const [lon, lat] = geom.geometry.coordinates;
        elements.push(
          <Marker
            key={`ski-trail-marker-${geom.unit_maintenance}-${index}`}
            position={[lat, lon]}
          >
            <Popup>
              <div>
                <strong>{intl.formatMessage({ id: 'mobilityPlatform.popup.skiTrail.title' })}</strong>
                <br />
                {intl.formatMessage({ id: 'mobilityPlatform.popup.skiTrail.maintainedAt' })}: {maintenance.maintained_at
                  ? new Date(maintenance.maintained_at).toLocaleString(intl.locale)
                  : intl.formatMessage({ id: 'mobilityPlatform.popup.skiTrail.maintainedAt.unknown' })}
                {maintenance.unit && (
                  <>
                    <br />
                    {intl.formatMessage({ id: 'mobilityPlatform.popup.unitId' })}: {maintenance.unit}
                  </>
                )}
              </div>
            </Popup>
          </Marker>
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
