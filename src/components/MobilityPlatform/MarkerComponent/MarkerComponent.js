import React from 'react';
import { PropTypes } from 'prop-types';
import { StyledPopupWrapper, StyledPopupInner } from '../styled/styled';

const MarkerComponent = ({ item, icon, children }) => {
  const { Marker, Popup } = global.rL;

  return (
    <Marker icon={icon} position={[item.geometry_coords.lat, item.geometry_coords.lon]}>
      <StyledPopupWrapper>
        <Popup className="popup-w350">
          <StyledPopupInner>{children}</StyledPopupInner>
        </Popup>
      </StyledPopupWrapper>
    </Marker>
  );
};

MarkerComponent.propTypes = {
  item: PropTypes.shape({
    geometry_coords: PropTypes.objectOf(PropTypes.number),
  }),
  icon: PropTypes.shape({
    path: PropTypes.string,
    viewBox: PropTypes.string,
  }).isRequired,
  children: PropTypes.node,
};

MarkerComponent.defaultProps = {
  item: {},
  children: null,
};

export default MarkerComponent;
