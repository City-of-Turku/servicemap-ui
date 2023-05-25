import { withStyles } from '@mui/styles';
import { connect } from 'react-redux';
import { setMapType, toggleSettings } from '../../redux/actions/settings';
import { changeTheme } from '../../redux/actions/user';
import styles from './styles';
import TopBar from './TopBar';

// Listen to redux state
const mapStateToProps = (state) => {
  const {
    navigator, user, breadcrumb, settings,
  } = state;
  return {
    navigator,
    currentPage: user.page,
    breadcrumb,
    settings,
    theme: user.theme,
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  { changeTheme, setMapType, toggleSettings },
)(TopBar));
