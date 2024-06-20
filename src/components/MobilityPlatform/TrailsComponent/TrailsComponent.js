import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { selectMapRef } from '../../../redux/selectors/general';
import { isObjValid, whiteOptionsBase, blackOptionsBase } from '../utils/utils';

/* Show selected trail on the map */

const TrailsComponent = ({
  showTrail, trailsObj, color, pattern,
}) => {
  const { Polyline } = global.rL;

  const useContrast = useSelector(useAccessibleMap);
  const map = useSelector(selectMapRef);

  const pathOptions = { color };
  const blackOptions = blackOptionsBase({ dashArray: pattern });
  const whiteOptions = whiteOptionsBase({ dashArray: !useContrast ? '4, 16' : null });
  const finalPathOptions = {
    first: useContrast ? whiteOptions : pathOptions,
    second: useContrast ? blackOptions : whiteOptions,
  };

  const renderData = isObjValid(showTrail, trailsObj);

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      bounds.push(trailsObj.geometry_coords);
      map?.fitBounds([bounds]);
    }
  }, [renderData, trailsObj, map]);

  return renderData ? (
    <>
      <Polyline weight={8} pathOptions={finalPathOptions.first} positions={trailsObj.geometry_coords} />
      <Polyline weight={4} pathOptions={finalPathOptions.second} positions={trailsObj.geometry_coords} />
    </>
  ) : null;
};

TrailsComponent.propTypes = {
  showTrail: PropTypes.bool,
  trailsObj: PropTypes.shape({
    geometry_coords: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(
      PropTypes.number,
    ))),
  }),
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
