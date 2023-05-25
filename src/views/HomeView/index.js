import { withStyles } from '@mui/styles';
import { connect } from 'react-redux';
import { toggleSettings } from '../../redux/actions/settings';
import HomeView from './HomeView';
import styles from './styles';

// Listen to redux state
const mapStateToProps = (state) => {
  const { user, navigator } = state;

  return {
    unit: state.unit,
    navigator,
    userLocation: user.position,
  };
};

export default connect(
  mapStateToProps,
  { toggleSettings },
)(withStyles(styles)(HomeView));
