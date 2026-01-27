import React, { useEffect, useState, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import iceTracksIcon from 'servicemap-ui-turku/assets/icons/icons-icon_ice.svg';
// import iceTracksIconBw from 'servicemap-ui-turku/assets/icons/icons-icon_ice_bw.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { fetchUnitMaintenanceData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import {
  StyledContainer, StyledHeaderContainer, StyledPopupWrapper, StyledTextContainer,
} from '../styled/styled';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { createIcon } from '../utils/utils';

const SportsFacilitiesMaintenance = () => {
  const intl = useIntl();
  const {
    sportsMaintenancePeriod,
    showSkiTrails,
    showIceTracks,
    isActiveSportsMaintenance,
    setIsActiveSportsMaintenance,
  } = useMobilityPlatformContext();

  const [allSkiTrailsData, setAllSkiTrailsData] = useState([]);
  const [iceTracksData, setIceTracksData] = useState([]);

  const { Polyline, Marker, Popup } = global.rL;
  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);

  // TODO: fix this when servicemap-ui-turku includes bw
  // const customIcon = icon(createIcon(useContrast ? iceTracksIconBw : iceTracksIcon));
  const customIcon = icon(createIcon(iceTracksIcon));

  const currentDate = new Date();

  // Fetch maintenance data
  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    if (showSkiTrails) {
      fetchUnitMaintenanceData(
        {
          target: 'SKI_TRAIL',
          page_size: 1000,
        },
        setAllSkiTrailsData,
        signal,
      );
    } else {
      setAllSkiTrailsData([]);
    }

    if (showIceTracks) {
      fetchUnitMaintenanceData(
        {
          target: 'ICE_TRACK',
          page_size: 1000,
        },
        setIceTracksData,
        signal,
      );
    } else {
      setIceTracksData([]);
    }

    return () => {
      abortController.abort();
    };
  }, [showSkiTrails, showIceTracks]);

  // Shared utility: Extract geometries from maintenance data
  const extractGeometries = maintenanceData => {
    const geometryMap = new Map();

    maintenanceData.forEach(maintenance => {
      if (maintenance.geometries && Array.isArray(maintenance.geometries)) {
        maintenance.geometries.forEach(geom => {
          // Use geometry ID as key to avoid duplicates
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

    return Array.from(geometryMap.values());
  };

  // Memoized geometries
  const iceTracksGeometries = useMemo(
    () => extractGeometries(iceTracksData),
    [iceTracksData],
  );

  const allSkiTrailsGeometries = useMemo(
    () => extractGeometries(allSkiTrailsData),
    [allSkiTrailsData],
  );

  useEffect(() => {
    const hasValidData = (showSkiTrails && allSkiTrailsGeometries.length > 0)
      || (showIceTracks && iceTracksGeometries.length > 0);
    setIsActiveSportsMaintenance(hasValidData);
  }, [showSkiTrails, showIceTracks, allSkiTrailsGeometries, iceTracksGeometries, setIsActiveSportsMaintenance]);

  const colorValues = {
    blue: 'rgba(7, 44, 115, 255)',
    purple: 'rgba(202, 15, 212, 255)',
    burgundy: 'rgba(128, 0, 32, 255)',
    gray: 'rgba(128, 128, 128, 255)',
  };

  const getIceTrackColor = condition => {
    switch (condition) {
      case 'USABLE':
        return colorValues.blue;
      case 'UNUSABLE':
        return colorValues.burgundy;
      default:
        return colorValues.gray;
    }
  };

  // Filter ice tracks based on selected period
  const filteredIceTracksGeometries = useMemo(() => {
    if (!sportsMaintenancePeriod || sportsMaintenancePeriod === 'over3days') {
      return iceTracksGeometries;
    }

    return iceTracksGeometries.filter(geom => {
      const maintenance = geom.maintenance_data;
      if (!maintenance) return false;

      if (sportsMaintenancePeriod === '1day' || sportsMaintenancePeriod === '3days') {
        return maintenance.condition === 'USABLE';
      }

      return false;
    });
  }, [iceTracksGeometries, sportsMaintenancePeriod]);

  const getSkiTrailColor = lastMaintenance => {
    switch (lastMaintenance) {
      case '1day':
        return colorValues.blue;
      case '3days':
        return colorValues.purple;
      case 'over3days':
        return colorValues.burgundy;
      default:
        return colorValues.gray;
    }
  };

  // Determine maintenance period category for a ski trail
  const getSkiTrailPeriod = maintainedAt => {
    if (!maintainedAt) return 'over3days';
    const maintainedDate = new Date(maintainedAt);
    const daysDiff = (currentDate - maintainedDate) / (1000 * 60 * 60 * 24);
    if (daysDiff <= 1) return '1day';
    if (daysDiff <= 3) return '3days';
    return 'over3days';
  };

  // Filter ski trails based on selected period
  const filteredSkiTrailsGeometries = useMemo(() => {
    if (!sportsMaintenancePeriod || sportsMaintenancePeriod === 'over3days') {
      return allSkiTrailsGeometries;
    }

    // Period selected: filter based on inclusive logic
    return allSkiTrailsGeometries.filter(geom => {
      const maintenance = geom.maintenance_data;
      if (!maintenance) return false;
      const period = getSkiTrailPeriod(maintenance.maintained_at);

      if (sportsMaintenancePeriod === '1day') {
        return period === '1day';
      } if (sportsMaintenancePeriod === '3days') {
        return period === '1day' || period === '3days';
      }

      return false;
    });
  }, [allSkiTrailsGeometries, getSkiTrailPeriod, sportsMaintenancePeriod]);

  const renderIceTrackPopup = maintenance => (
    <StyledContainer>
      <StyledHeaderContainer>
        <Typography variant="subtitle1" component="h4">
          {maintenance.unit.name && maintenance.unit.name !== ''
            ? maintenance.unit.name
            : intl.formatMessage({ id: 'mobilityPlatform.popup.iceTrack.title' })}
        </Typography>
      </StyledHeaderContainer>
      <div>
        <StyledTextContainer>
          <Typography variant="body2" component="p">
            {maintenance.condition === 'USABLE'
              ? intl.formatMessage({ id: 'mobilityPlatform.popup.iceTrack.status.usable' })
              : maintenance.condition === 'UNUSABLE'
                ? intl.formatMessage({ id: 'mobilityPlatform.popup.iceTrack.status.unusable' })
                : intl.formatMessage({ id: 'mobilityPlatform.popup.iceTrack.status.undefined' })}
            {/* TODO based on preference, change this to show info about the point or parse HTML of description */}
            {/* {maintenance.unit && ( */}
            {/*  <> */}
            {/*    {maintenance.unit.description && ( */}
            {/*      <> */}
            {/*        {maintenance.unit.description} */}
            {/*      </> */}
            {/*    )} */}
            {/*  </> */}
            {/* )} */}
          </Typography>
        </StyledTextContainer>
      </div>
    </StyledContainer>
  );

  const renderSkiTrailPopup = maintenance => (
    <StyledContainer>
      <StyledHeaderContainer>
        <Typography variant="subtitle1" component="h4">
          {maintenance.unit.name && maintenance.unit.name !== ''
            ? maintenance.unit.name
            : intl.formatMessage({ id: 'mobilityPlatform.popup.skiTrail.title' })}
        </Typography>
      </StyledHeaderContainer>
      <div>
        <StyledTextContainer>
          <Typography variant="body2" component="p">
            {maintenance && maintenance.maintained_at ? (
              <>
                {`${intl.formatMessage({ id: 'mobilityPlatform.popup.skiTrail.maintainedAt' })}: `}
                {new Date(maintenance.maintained_at).toLocaleString(intl.locale)}
              </>
            ) : (
              intl.formatMessage({ id: 'mobilityPlatform.popup.skiTrail.maintainedAt.unknown' })
            )}
          </Typography>
        </StyledTextContainer>
      </div>
    </StyledContainer>
  );

  const renderGeometry = (geom, index, color, prefix, popupContent) => {
    if (!geom.geometry) {
      console.warn(`Geometry ${geom.id} has no geometry data`);
      return null;
    }

    const geomType = geom.geometry.type;

    if (geomType === 'LineString' && geom.geometry.coordinates) {
      // GeoJSON coordinates are [lon, lat], Leaflet needs [lat, lon]
      const coords = geom.geometry.coordinates.map(coord => [coord[1], coord[0]]);
      return (
        <Polyline
          key={`${prefix}-${geom.id}-${index}`}
          pathOptions={{
            color,
            weight: 4,
            opacity: 0.8,
          }}
          positions={coords}
        >
          <StyledPopupWrapper>
            <Popup className="popup-w350">
              {popupContent}
            </Popup>
          </StyledPopupWrapper>
        </Polyline>
      );
    }
    if (geomType === 'Point' && geom.geometry.coordinates) {
      const [lon, lat] = geom.geometry.coordinates;
      return (
        <Marker key={`${prefix}-marker-${geom.id}-${index}`} icon={customIcon} position={[lat, lon]}>
          <StyledPopupWrapper>
            <Popup className="popup-w350">
              {popupContent}
            </Popup>
          </StyledPopupWrapper>
        </Marker>
      );
    }

    return null;
  };

  const renderIceTracks = () => {
    if (!showIceTracks || filteredIceTracksGeometries.length === 0) {
      return null;
    }

    return filteredIceTracksGeometries.map((geom, index) => {
      const maintenance = geom.maintenance_data;
      if (!maintenance) return null;

      const color = getIceTrackColor(maintenance.condition);
      return renderGeometry(geom, index, color, 'ice-track', renderIceTrackPopup(maintenance));
    }).filter(Boolean);
  };

  const renderSkiTrails = () => {
    if (!showSkiTrails || filteredSkiTrailsGeometries.length === 0) {
      return null;
    }

    return filteredSkiTrailsGeometries.map((geom, index) => {
      const maintenance = geom.maintenance_data;
      if (!maintenance) return null;

      const period = getSkiTrailPeriod(maintenance.maintained_at);
      const color = getSkiTrailColor(period);

      return renderGeometry(geom, index, color, 'ski-trail', renderSkiTrailPopup(maintenance));
    }).filter(Boolean);
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
