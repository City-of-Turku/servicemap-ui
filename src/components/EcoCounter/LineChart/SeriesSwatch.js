/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { SERIES_KEYS, seriesStyles } from './chartConfig';

const markers = {
  rect: (props) => <rect x="8" y="2" width="8" height="8" {...props} />,
  triangle: (props) => <polygon points="12,1.5 16.5,10 7.5,10" {...props} />,
  circle: (props) => <circle cx="12" cy="6" r="4" {...props} />,
};

const SeriesSwatch = ({ seriesKey }) => {
  const { color, pointStyle, borderDash } = seriesStyles[seriesKey];
  const Marker = markers[pointStyle] || markers.circle;
  return (
    <svg
      className="series-swatch"
      width="24"
      height="12"
      viewBox="0 0 24 12"
      aria-hidden="true"
      focusable="false"
    >
      <line
        x1="0"
        y1="6"
        x2="24"
        y2="6"
        stroke={color}
        strokeWidth="3"
        strokeDasharray={borderDash.join(' ') || undefined}
      />
      <Marker fill="#fff" stroke={color} strokeWidth={2} />
    </svg>
  );
};

SeriesSwatch.propTypes = {
  seriesKey: PropTypes.oneOf(Object.keys(SERIES_KEYS)).isRequired,
};

export default SeriesSwatch;
