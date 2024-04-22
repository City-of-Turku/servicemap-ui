import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MobilitySettingsView from './MobilitySettingsView';

const mapStateToProps = state => {
  const { navigator } = state;
  return {
    navigator,
  };
};

export default withRouter(connect(mapStateToProps)(MobilitySettingsView));
