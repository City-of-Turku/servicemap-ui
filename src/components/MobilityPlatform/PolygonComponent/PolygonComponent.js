import React from 'react';
import { PropTypes } from 'prop-types';

const PolygonComponent = ({
  classes, item, useContrast, pathOptions, children,
}) => {
  const { Polygon, Popup } = global.rL;

  return (
    <Polygon
      key={item.id}
      pathOptions={pathOptions}
      positions={item.geometry_coords}
      eventHandlers={{
        mouseover: (e) => {
          e.target.setStyle({ fillOpacity: useContrast ? '0.6' : '0.2' });
        },
        mouseout: (e) => {
          e.target.setStyle({ fillOpacity: useContrast ? '0.3' : '0.2' });
        },
      }}
    >
      <div className={classes.popupWrapper}>
        <Popup>
          <div className={classes.popupInner}>
            {children}
          </div>
        </Popup>
      </div>
    </Polygon>
  );
};

PolygonComponent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  item: PropTypes.objectOf(PropTypes.any).isRequired,
  useContrast: PropTypes.bool,
  pathOptions: PropTypes.objectOf(PropTypes.any).isRequired,
  children: PropTypes.node,
};

PolygonComponent.defaultProps = {
  useContrast: false,
  children: null,
};

export default PolygonComponent;
