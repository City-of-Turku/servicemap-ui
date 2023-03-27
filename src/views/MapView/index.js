import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setMapRef } from '../../redux/actions/map';
import { findUserLocation } from '../../redux/actions/user';
import { getHighlightedDistrict } from '../../redux/selectors/district';
import { getSelectedUnit } from '../../redux/selectors/selectedUnit';
import MapView from './MapView';
import styles from './styles';

// Get redux states as props to component
const mapStateToProps = (state) => {
  const {
    navigator, settings, user, measuringMode, districts,
  } = state;
  const serviceUnitsLoading = state.service.isFetching;
  const searchUnitsLoading = state.searchResults.isFetching;
  const highlightedDistrict = getHighlightedDistrict(state);
  const highlightedUnit = getSelectedUnit(state);
  const {
    customPosition, locale, page, position,
  } = user;
  const districtUnitsFetching = districts.unitFetch.isFetching;
  const { districtsFetching } = districts;

  const userLocation = customPosition.coordinates || position.coordinates;
  return {
    highlightedDistrict,
    highlightedUnit,
    districtViewFetching: !!(districtUnitsFetching || districtsFetching?.length),
    unitsLoading: serviceUnitsLoading || searchUnitsLoading,
    currentPage: page,
    userLocation,
    hideUserMarker: customPosition.hideMarker,
    settings,
    navigator,
    locale,
    measuringMode,
  };
};

export default withStyles(styles)(withRouter(injectIntl(connect(
  mapStateToProps,
  { setMapRef, findUserLocation },
)(MapView))));
