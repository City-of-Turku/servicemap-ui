import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { setDistrictAddressData } from '../../redux/actions/district';
import {
  setAddressData,
  setAddressUnits,
  setAddressLocation,
  setAdminDistricts,
  setToRender,
} from '../../redux/actions/address';
import AddressView from './AddressView';
import { formatDistanceObject } from '../../utils';
import { calculateDistance, getCurrentlyUsedPosition } from '../../redux/selectors/unit';

const mapStateToProps = (state, props) => {
  const { intl } = props;
  /* TODO: create custom hooks for getAddressNavigatorParams and getDistance
  to prevent re-rendering on every state change */
  const currentPosition = getCurrentlyUsedPosition(state);
  const getDistance = unit => formatDistanceObject(intl, calculateDistance(unit, currentPosition));
  return {
    getDistance,
  };
};

export default withRouter(injectIntl(connect(
  mapStateToProps,
  {
    setAddressData,
    setAddressUnits,
    setAddressLocation,
    setAdminDistricts,
    setToRender,
    setDistrictAddressData,
  },
)(AddressView)));
