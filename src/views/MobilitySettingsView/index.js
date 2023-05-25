import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MobilitySettingsView from './MobilitySettingsView';
import styles from './styles';

const mapStateToProps = (state) => {
  const { navigator } = state;
  return {
    navigator,
  };
};

export default injectIntl(withRouter(withStyles(styles)(connect(
  mapStateToProps,
)(MobilitySettingsView))));
