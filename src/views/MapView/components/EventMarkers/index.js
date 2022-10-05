import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import styles from '../../styles';
import EventMarkers from './EventMarkers';

const mapStateToProps = (state) => {
  const { navigator } = state;
  return {
    navigator,
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
)(EventMarkers));
