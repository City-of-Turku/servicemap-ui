import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useMobilityPlatformContext } from '../../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../../redux/selectors/settings';
import { drawMarkerIcon } from '../../../../../views/MapView/utils/drawIcon';
import createTransitIcon from '../../../../../views/MapView/components/TransitStops/createTransitIcon';
import AccessibleMarker from '../../../../AccessibleMarker';
import { StyledPopupWrapper, StyledPopupInner } from '../../../styled/styled';
import { getSiteMarkers } from '../../utils/siteLocations';
import AccessibilityZoneSiteContent from '../AccessibilityZoneSiteContent';

// Vehicle type of bus stops in Digitransit
const busVehicleType = 3;

const AccessibilityZoneSiteMarkers = ({ classes }) => {
  const { accessibilityZoneSelections } = useMobilityPlatformContext();
  const useContrast = useSelector(useAccessibleMap);
  const { Popup } = global.rL;

  const busStopIcon = useMemo(() => createTransitIcon(busVehicleType, classes), [classes]);
  const unitIcon = useMemo(() => drawMarkerIcon(useContrast, classes.unitMarker), [useContrast, classes]);

  const markers = useMemo(() => getSiteMarkers(accessibilityZoneSelections), [accessibilityZoneSelections]);

  return markers.map(marker => (
    <AccessibleMarker
      key={marker.key}
      typeId={marker.isBusStop ? 'map.marker.busStop' : 'unit'}
      name={marker.name}
      icon={marker.isBusStop ? busStopIcon : unitIcon}
      position={[marker.lat, marker.lon]}
    >
      <StyledPopupWrapper>
        <Popup>
          <StyledPopupInner>
            <AccessibilityZoneSiteContent marker={marker} />
          </StyledPopupInner>
        </Popup>
      </StyledPopupWrapper>
    </AccessibleMarker>
  ));
};

AccessibilityZoneSiteMarkers.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default AccessibilityZoneSiteMarkers;
