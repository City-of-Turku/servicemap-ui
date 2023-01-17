import { PropTypes } from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import ecoCounterIcon from 'servicemap-ui-turku/assets/icons/icons-icon_ecocounter.svg';
import ecoCounterIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_ecocounter-bw.svg';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { createIcon } from '../../MobilityPlatform/utils/utils';

const CounterMarkers = ({
  classes, counterStation, children,
}) => {
  const useContrast = useSelector(useAccessibleMap);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const customIcon = icon(createIcon(useContrast ? ecoCounterIconBw : ecoCounterIcon));

  return (
    <Marker key={counterStation.id} icon={customIcon} position={[counterStation.lat, counterStation.lon]}>
      <div className={classes.popupWrapper}>
        <Popup className="ecocounter-popup">
          <div className={classes.popupInner}>
            {children}
          </div>
        </Popup>
      </div>
    </Marker>
  );
};

CounterMarkers.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  counterStation: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.node,
};

CounterMarkers.defaultProps = {
  counterStation: {},
  children: null,
};

export default CounterMarkers;
