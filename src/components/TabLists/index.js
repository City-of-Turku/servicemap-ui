import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styles from './styles';
import TabLists from './TabLists';

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator } = state;
  const { customPosition, position } = state.user;
  return {
    navigator,
    userAddress: position.addressData || customPosition.addressData,
  };
};

export default connect(
  mapStateToProps,
)(injectIntl(withRouter(withStyles(styles)(TabLists))));
