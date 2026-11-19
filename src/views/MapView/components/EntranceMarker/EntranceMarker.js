import { Typography } from '@mui/material';
import distance from '@turf/distance';
import flip from '@turf/flip';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { getSelectedUnit } from '../../../../redux/selectors/selectedUnit';
import useLocaleText from '../../../../utils/useLocaleText';
import { drawEntranceMarkreIcon } from '../../utils/drawIcon';
import AccessibleMarker from '../../../../components/AccessibleMarker';

const EntranceMarker = ({ classes }) => {
  const getLocaleText = useLocaleText();
  const unit = useSelector(state => getSelectedUnit(state));
  const theme = useSelector(state => state.user.theme);
  const map = useMap();

  const unitPoint = flip(unit.location);
  const zoomLimit = map.options.detailZoom;

  const shouldShowMarkers = () => map.getZoom() >= zoomLimit;
  const [showMarkers, setShowMarkers] = useState(shouldShowMarkers());

  const checkMarkerVisibility = () => {
    if (shouldShowMarkers()) {
      setShowMarkers(true);
    } else {
      setShowMarkers(false);
    }
  };

  useEffect(() => {
    // Add listener for zoom level to check if markers should be shown
    map.on('zoomend', checkMarkerVisibility);
    return () => {
      map.off('zoomend', checkMarkerVisibility);
    };
  }, []);


  if (unit?.entrances?.length && showMarkers) {
    const { Popup } = global.rL || {};
    return (
      unit.entrances.map((entrance) => {
        if (!entrance.location) return null;
        const position = flip(entrance.location);
        const distanceBetween = distance(position, unitPoint) * 1000;
        // Don't show entrances that are too close to the unit marker
        if (distanceBetween < 5) {
          return null;
        }
        const { coordinates } = position;

        return (
          <AccessibleMarker
            key={`${coordinates[0]},${coordinates[1]}`}
            typeId={entrance.is_main_entrance ? 'unit.entrances.main' : 'unit.entrances.secondary'}
            name={entrance.name || unit.name}
            icon={drawEntranceMarkreIcon(theme === 'dark')}
            position={coordinates}
          >
            <Popup>
              <div className={classes.unitTooltipWrapper}>
                <Typography component="h3" className={classes.unitTooltipTitle}>
                  {getLocaleText(unit.name)}
                </Typography>
                {entrance.name ? (
                  <Typography>
                    {getLocaleText(entrance.name)}
                  </Typography>
                ) : null}
                <Typography className={classes.entranceType}>
                  {entrance.is_main_entrance ? (
                    <FormattedMessage id="unit.entrances.main" />
                  ) : <FormattedMessage id="unit.entrances.secondary" />}
                </Typography>
              </div>
            </Popup>
          </AccessibleMarker>
        );
      })
    );
  }
  return null;
};

EntranceMarker.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default EntranceMarker;
