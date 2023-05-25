import { withStyles } from '@mui/styles';
import { connect } from 'react-redux';
import { getSelectedUnit, getSelectedUnitEvents } from '../../../../redux/selectors/selectedUnit';
import { calculateDistance, getCurrentlyUsedPosition } from '../../../../redux/selectors/unit';
import { formatDistanceObject } from '../../../../utils';
import styles from '../../styles';
import MarkerCluster from './MarkerCluster';


const mapStateToProps = (state) => {
  const { navigator, user, settings } = state;
  const { page, theme } = user;
  const distanceCoordinates = getCurrentlyUsedPosition(state);
  // TODO: optimization: memoize getDistance (move from mapStateToProps to custom hook)
  const getDistance = (unit, intl) => (
    formatDistanceObject(intl, calculateDistance(unit, distanceCoordinates))
  );
  const highlightedUnit = getSelectedUnit(state);
  const highlightedUnitEvents = getSelectedUnitEvents(state);
  if (highlightedUnit) {
    highlightedUnit.events = highlightedUnitEvents.data;
  }

  return {
    currentPage: page,
    getDistance,
    highlightedUnit,
    highlightedUnitEvents,
    navigator,
    settings,
    theme,
  };
};


export default withStyles(styles)(connect(mapStateToProps)(MarkerCluster));
