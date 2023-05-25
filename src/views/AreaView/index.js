import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import {
    fetchAllDistricts, fetchDistrictUnitList, setDistrictAddressData, setMapState, setSelectedDistrictServices, setSelectedDistrictType,
    setSelectedSubdistricts
} from '../../redux/actions/district';
import { getAddressDistrict, getDistrictsByType } from '../../redux/selectors/district';
import AreaView from './AreaView';
import styles from './styles';

const mapStateToProps = (state) => {
  const { navigator } = state;
  const {
    districtData,
    districtAddressData,
    subdistrictUnits,
    selectedSubdistricts,
    selectedDistrictServices,
    unitFetch,
    mapState,
  } = state.districts;
  const map = state.mapRef;
  const selectedDistrictData = getDistrictsByType(state);
  const addressDistrict = getAddressDistrict(state);
  return {
    districtData,
    selectedDistrictData,
    districtAddressData,
    addressDistrict,
    subdistrictUnits,
    selectedSubdistricts,
    selectedDistrictServices,
    unitsFetching: unitFetch.nodesFetching,
    mapState,
    navigator,
    map,
  };
};

export default injectIntl(withStyles(styles)(connect(
  mapStateToProps,
  {
    setSelectedDistrictType,
    setSelectedSubdistricts,
    setSelectedDistrictServices,
    setDistrictAddressData,
    setMapState,
    fetchDistrictUnitList,
    fetchAllDistricts,
  },
)(AreaView)));
