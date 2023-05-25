import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchErrors, fetchNews } from '../redux/actions/alerts';
import DefaultLayout from './DefaultLayout';
import styles from './styles';

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator, settings, user } = state;
  const { toggled } = settings;
  return {
    currentPage: user.page,
    settingsToggled: toggled,
    navigator,
  };
};

export default injectIntl(withRouter(connect(
  mapStateToProps,
  { fetchErrors, fetchNews },
)(withStyles(styles)(DefaultLayout))));
