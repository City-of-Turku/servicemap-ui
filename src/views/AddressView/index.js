import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    setAddressData, setAddressLocation, setAddressUnits, setAdminDistricts,
    setToRender
} from '../../redux/actions/address';
import { setDistrictAddressData } from '../../redux/actions/district';
import { calculateDistance, getCurrentlyUsedPosition } from '../../redux/selectors/unit';
import { formatDistanceObject } from '../../utils';
import AddressView from './AddressView';
import styles from './styles';

const mapStateToProps = (state, props) => {
  const { intl } = props;
  const { address, mapRef, navigator } = state;
  const map = mapRef;
  /* TODO: create custom hooks for getAddressNavigatorParams and getDistance
  to prevent re-rendering on every state change */
  const currentPosition = getCurrentlyUsedPosition(state);
  const getDistance = unit => formatDistanceObject(intl, calculateDistance(unit, currentPosition));
  const { units, adminDistricts } = address;
  return {
    addressData: address.addressData,
    adminDistricts,
    map,
    getDistance,
    navigator,
    units,
  };
};


export default withRouter(withStyles(styles)(injectIntl(connect(
  mapStateToProps,
  {
    setAddressData,
    setAddressUnits,
    setAddressLocation,
    setAdminDistricts,
    setToRender,
    setDistrictAddressData,
  },
)(AddressView))));
