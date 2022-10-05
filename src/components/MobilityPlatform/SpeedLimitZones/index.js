import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import SpeedLimitZones from './SpeedLimitZones';
import styles from './styles';

export default withStyles(styles)(injectIntl(SpeedLimitZones));
