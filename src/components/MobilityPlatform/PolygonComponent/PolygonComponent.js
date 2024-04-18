import React from 'react';
import { PropTypes } from 'prop-types';
import { StyledPopupWrapper, StyledPopupInner } from '../styled/styled';

const PolygonComponent = ({
  item, useContrast, pathOptions, children,
}) => {
  const { Polygon, Popup } = global.rL;

  return (
    <Polygon
      key={item.id}
      pathOptions={pathOptions}
      positions={item.geometry_coords}
      eventHandlers={{
        mouseover: e => {
          e.target.setStyle({ fillOpacity: useContrast ? '0.6' : '0.2' });
        },
        mouseout: e => {
          e.target.setStyle({ fillOpacity: useContrast ? '0.3' : '0.2' });
        },
      }}
    >
      <StyledPopupWrapper>
        <Popup>
          <StyledPopupInner>{children}</StyledPopupInner>
        </Popup>
      </StyledPopupWrapper>
    </Polygon>
  );
};

PolygonComponent.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    geometry_coords: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))),
  }).isRequired,
  useContrast: PropTypes.bool,
  pathOptions: PropTypes.shape({
    color: PropTypes.string,
    weight: PropTypes.number,
  }).isRequired,
  children: PropTypes.node,
};

PolygonComponent.defaultProps = {
  useContrast: false,
  children: null,
};

export default PolygonComponent;
