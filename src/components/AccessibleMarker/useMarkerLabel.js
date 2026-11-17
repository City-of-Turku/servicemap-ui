import { useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import useLocaleText from '../../utils/useLocaleText';

const applyLabel = (marker, label) => {
  const element = marker.getElement();
  if (!element) return;
  if (element.tagName === 'IMG') {
    element.setAttribute('alt', label);
    return;
  }
  // aria-label is ignored without a role, and Leaflet only adds role="button" to focusable markers
  if (!element.getAttribute('role')) element.setAttribute('role', 'img');
  element.setAttribute('aria-label', label);
};

// Leaflet uses options.alt only for IMG icons and recreates the element on every add,
// so the label is re-applied on each 'add' event.
const useMarkerLabel = (typeId, name, icon) => {
  const intl = useIntl();
  const getLocaleText = useLocaleText();
  const markerRef = useRef(null);
  // Callers create a new icon object on every render, so compare by image url instead.
  // setIcon replaces the element without an 'add' event when the icon type changes.
  const iconKey = icon?.options?.iconUrl ?? icon;
  const toText = (value) => {
    if (value == null) return '';
    return String(typeof value === 'object' ? getLocaleText(value) : value).trim();
  };
  const type = typeId ? intl.formatMessage({ id: typeId }) : '';
  const label = [type, toText(name)].filter(Boolean).join(', ');

  // Runs after Marker's own effects, so the label survives setIcon
  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return undefined;
    marker.options.alt = label;
    applyLabel(marker, label);
    const onAdd = () => applyLabel(marker, label);
    marker.on('add', onAdd);
    return () => marker.off('add', onAdd);
  }, [label, iconKey]);

  return { markerRef, label };
};

export default useMarkerLabel;
