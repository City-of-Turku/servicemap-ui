import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// import { useMap } from 'react-leaflet';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { isDataValid, whiteOptionsBase, blackOptionsBase } from '../utils/utils';

/* Show selected trail on the map */

const TrailsComponent = ({
  showTrail, selectedTrails, color, pattern,
}) => {
  const { Polyline } = global.rL;

  const useContrast = useSelector(useAccessibleMap);

  const pathOptions = { color };
  const blackOptions = blackOptionsBase({ dashArray: pattern });
  const whiteOptions = whiteOptionsBase({ dashArray: !useContrast ? '4, 16' : null });
  const finalPathOptions = {
    first: useContrast ? whiteOptions : pathOptions,
    second: useContrast ? blackOptions : whiteOptions,
  };

  const renderData = isDataValid(showTrail, selectedTrails);

  // TODO Update fit bounds
  // const map = useMap();

  /* useEffect(() => {
    if (renderData) {
      const bounds = [];
      bounds.push(trailsObj.geometry_coords);
      map.fitBounds([bounds]);
    }
  }, [showTrail, trailsObj]); */

  const renderTrails = trailsData => (
    trailsData.map(item => (
      <>
        <Polyline weight={8} pathOptions={finalPathOptions.first} positions={item.geometry_coords} />
        <Polyline weight={4} pathOptions={finalPathOptions.second} positions={item.geometry_coords} />
      </>
    ))
  );

  return renderData ? (
    renderTrails(selectedTrails)
  ) : null;
};

TrailsComponent.propTypes = {
  showTrail: PropTypes.bool,
  selectedTrails: PropTypes.arrayOf(PropTypes.any),
  color: PropTypes.string,
  pattern: PropTypes.string,
};

TrailsComponent.defaultProps = {
  showTrail: false,
  selectedTrails: [],
  color: '',
  pattern: '',
};

export default TrailsComponent;
