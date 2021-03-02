
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core';
import UnitItem from './UnitItem';
import { changeSelectedUnit } from '../../../redux/actions/selectedUnit';
import styles from './styles';
import { calculateDistance, getCurrentlyUsedPosition } from '../../../redux/selectors/unit';
import { formatDistanceObject } from '../../../utils';

// Listen to redux state
const mapStateToProps = (state, props) => {
  const {
    intl, unit,
  } = props;
  const {
    navigator, settings, user,
  } = state;
  return {
    distance: formatDistanceObject(intl, calculateDistance(unit, getCurrentlyUsedPosition(state))),
    navigator,
    settings,
    theme: user.theme,
  };
};

export default injectIntl(withStyles(styles)(connect(
  mapStateToProps,
  { changeSelectedUnit },
)(UnitItem)));
