import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { findUserLocation } from '../../../redux/actions/user';
import DrawerMenu from './DrawerMenu';
import styles from './styles';

const mapStateToProps = (state) => {
  const { user } = state;
  return {
    currentPage: user.page,
    userLocation: user.position,
  };
};

export default injectIntl(withStyles(styles)(connect(
  mapStateToProps,
  { findUserLocation },
)(DrawerMenu)));
