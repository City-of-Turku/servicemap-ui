
import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { changeSelectedUnit } from '../../../redux/actions/selectedUnit';
import { calculateDistance, getCurrentlyUsedPosition } from '../../../redux/selectors/unit';
import { formatDistanceObject } from '../../../utils';
import styles from './styles';
import UnitItem from './UnitItem';

// Listen to redux state
const mapStateToProps = (state, props) => {
  const {
    intl, unit,
  } = props;
  const {
    navigator, settings,
  } = state;
  return {
    distance: formatDistanceObject(intl, calculateDistance(unit, getCurrentlyUsedPosition(state))),
    navigator,
    settings,
  };
};

export default injectIntl(withStyles(styles)(connect(
  mapStateToProps,
  { changeSelectedUnit },
)(UnitItem)));
