import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { isObjValid } from '../utils/utils';

/* Show selected trail on the map */

const TrailsComponent = ({
  showTrail, trailsObj, color, pattern,
}) => {
  const { Polyline } = global.rL;

  const useContrast = useSelector(useAccessibleMap);

  const pathOptions = { color };
  const blackOptions = { color: 'rgba(0, 0, 0, 255)', dashArray: pattern };
  const whiteOptions = { color: 'rgba(255, 255, 255, 255)', dashArray: !useContrast ? '4, 16' : null };

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
      {renderData ? (
        <>
          <Polyline weight={8} pathOptions={useContrast ? whiteOptions : pathOptions} positions={trailsObj.geometry_coords} />
          <Polyline weight={4} pathOptions={useContrast ? blackOptions : whiteOptions} positions={trailsObj.geometry_coords} />
        </>
      ) : null}
    </>
  );
};

TrailsComponent.propTypes = {
  showTrail: PropTypes.bool,
  trailsObj: PropTypes.objectOf(PropTypes.any),
  color: PropTypes.string,
  pattern: PropTypes.string,
};

TrailsComponent.defaultProps = {
  showTrail: false,
  trailsObj: {},
  color: '',
  pattern: '',
};

export default TrailsComponent;
