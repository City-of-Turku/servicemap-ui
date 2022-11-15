import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMap } from 'react-leaflet';
import { isObjValid } from '../utils/utils';

/* Show selected trail on the map */

const TrailsComponent = ({ showTrail, trailsObj, color }) => {
  const { Polyline } = global.rL;

  const pathOptions = { color };
  const whiteOptions = { color: '#ffff', dashArray: '4, 16' };

  const renderData = isObjValid(showTrail, trailsObj);

  const map = useMap();

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      bounds.push(trailsObj.geometry_coords);
      map.fitBounds([bounds]);
    }
  }, [showTrail, trailsObj]);

  return (
    <>
      {renderData && (
        <>
          <Polyline weight={8} pathOptions={pathOptions} positions={trailsObj.geometry_coords} />
          <Polyline weight={4} pathOptions={whiteOptions} positions={trailsObj.geometry_coords} />
        </>
      )}
    </>
  );
};

TrailsComponent.propTypes = {
  showTrail: PropTypes.bool,
  trailsObj: PropTypes.objectOf(PropTypes.any),
  color: PropTypes.string,
};

TrailsComponent.defaultProps = {
  showTrail: false,
  trailsObj: {},
  color: '',
};

export default TrailsComponent;
