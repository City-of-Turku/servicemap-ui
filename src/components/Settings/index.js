import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import {
    setMapType, setMobility, toggleCity, toggleColorblind, toggleHearingAid, toggleSettings, toggleVisuallyImpaired
} from '../../redux/actions/settings';
import { changeTheme } from '../../redux/actions/user';
import Settings from './Settings';
import styles from './styles';

const mapStateToProps = (state) => {
  const { settings } = state;
  return {
    settings,
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  {
    toggleHearingAid,
    setMobility,
    setMapType,
    toggleColorblind,
    toggleVisuallyImpaired,
    toggleCity,
    toggleSettings,
    changeTheme,
  },
)(injectIntl(Settings)));
