import React from 'react';
import { PropTypes } from 'prop-types';
import { StyledPopupWrapper, StyledPopupInner } from '../styled/styled';
import AccessibleMarker from '../../AccessibleMarker';

const MarkerComponent = ({
  item, icon, typeId, name, children,
}) => {
  const { Popup } = global.rL;

  return (
    <AccessibleMarker
      typeId={typeId}
      name={name}
      icon={icon}
      position={[item.geometry_coords.lat, item.geometry_coords.lon]}
    >
      <StyledPopupWrapper>
        <Popup className="popup-w350">
          <StyledPopupInner>{children}</StyledPopupInner>
        </Popup>
      </StyledPopupWrapper>
    </AccessibleMarker>
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
  /** See AccessibleMarker */
  typeId: PropTypes.string.isRequired,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(PropTypes.string)]),
  children: PropTypes.node,
};

MarkerComponent.defaultProps = {
  item: {},
  name: null,
  children: null,
};

export default MarkerComponent;
