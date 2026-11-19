import React, { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import useMarkerLabel from './useMarkerLabel';
import useMarkerPopupState from './useMarkerPopupState';
import bindMarkerKeyboardActivation from './markerKeyboardActivation';

/**
 * react-leaflet Marker with an accessible name built from the marker type and item name,
 * e.g. "Laskentapiste, Auransilta". Other props are passed to Marker as is.
 */
const AccessibleMarker = ({
  typeId, name, children, ...markerProps
}) => {
  const { Marker } = global.rL;
  const { markerRef, label } = useMarkerLabel(typeId, name, markerProps.icon);
  useMarkerPopupState(markerRef, markerProps.icon, React.Children.toArray(children).length > 0);
  useEffect(() => {
    if (!markerRef.current) {
      return undefined;
    }
    return bindMarkerKeyboardActivation(markerRef.current);
  }, [markerRef]);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Marker ref={markerRef} alt={label} {...markerProps}>
      {children}
    </Marker>
  );
};

AccessibleMarker.propTypes = {
  /** Translation id of the marker type, used in the accessible name */
  typeId: PropTypes.string.isRequired,
  /** Item name used in the accessible name, as a string or a { fi, sv, en } object */
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(PropTypes.string)]),
  children: PropTypes.node,
};

AccessibleMarker.defaultProps = {
  name: null,
  children: null,
};

export default AccessibleMarker;
