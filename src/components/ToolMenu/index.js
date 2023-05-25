import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { setMeasuringMode } from '../../redux/actions/map';
import MapUtility from '../../utils/mapUtility';
import styles from './styles';
import ToolMenu from './ToolMenu';

const mapStateToProps = (state) => {
  const {
    mapRef, navigator, measuringMode, user,
  } = state;
  const map = mapRef;

  return {
    mapUtility: map ? new MapUtility({ map }) : null,
    navigator,
    measuringMode,
    currentPage: user.page,
  };
};

export default injectIntl(connect(
  mapStateToProps,
  { setMeasuringMode },
)(withStyles(styles)(ToolMenu)));
