import { PropTypes } from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import ecoCounterIcon from 'servicemap-ui-turku/assets/icons/icons-icon_ecocounter.svg';
import ecoCounterIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_ecocounter-bw.svg';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { createIcon } from '../../MobilityPlatform/utils/utils';

const CounterMarkers = ({ counterStation, children }) => {
  const useContrast = useSelector(useAccessibleMap);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const customIcon = icon(createIcon(useContrast ? ecoCounterIconBw : ecoCounterIcon));

  return (
    <Marker icon={customIcon} position={[counterStation.lat, counterStation.lon]}>
      <StyledWrapper>
        <Popup className="ecocounter-popup">
          <StyledContentInner>
            {children}
          </StyledContentInner>
        </Popup>
      </StyledWrapper>
    </Marker>
  );
};

const StyledWrapper = styled.div(({ theme }) => ({
  position: 'absolute',
  textAlign: 'center',
  marginBottom: theme.spacing(2),
  width: '429px',
}));

const StyledContentInner = styled.div(({ theme }) => ({
  borderRadius: '3px',
  marginBottom: theme.spacing(1),
  marginLeft: theme.spacing(1.2),
  lineHeight: 1.2,
  overflowX: 'hidden',
}));

CounterMarkers.propTypes = {
  counterStation: PropTypes.shape({
    lat: PropTypes.number,
    lon: PropTypes.number,
  }),
  children: PropTypes.node,
};

CounterMarkers.defaultProps = {
  counterStation: {},
  children: null,
};

export default CounterMarkers;
