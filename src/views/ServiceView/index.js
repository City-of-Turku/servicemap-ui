
import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchService } from '../../redux/actions/services';
import { getServiceUnits } from '../../redux/selectors/service';
import ServiceView from './ServiceView';
import styles from './styles';

const mapStateToProps = (state) => {
  const { mapRef, service, user } = state;
  const { customPosition } = user;
  const map = mapRef;
  const units = getServiceUnits(state);

  return {
    customPosition: customPosition.coordinates,
    map,
    unitData: units,
    serviceReducer: service,
  };
};

export default withRouter(injectIntl(withStyles(styles)(connect(
  mapStateToProps,
  { fetchService },
)(ServiceView))));
