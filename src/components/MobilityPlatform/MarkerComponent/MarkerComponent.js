import React from 'react';
import { PropTypes } from 'prop-types';

const MarkerComponent = ({
  classes, item, icon, children,
}) => {
  const { Marker, Popup } = global.rL;

  return (
    <Marker icon={icon} position={[item.geometry_coords.lat, item.geometry_coords.lon]}>
      <div className={classes.popupWrapper}>
        <Popup className="popup-w350">
          <div className={classes.popupInner}>{children}</div>
        </Popup>
      </div>
    </Marker>
  );
};

MarkerComponent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  item: PropTypes.objectOf(PropTypes.any),
  icon: PropTypes.objectOf(PropTypes.any).isRequired,
  children: PropTypes.node,
};

MarkerComponent.defaultProps = {
  item: {},
  children: null,
};

export default MarkerComponent;
