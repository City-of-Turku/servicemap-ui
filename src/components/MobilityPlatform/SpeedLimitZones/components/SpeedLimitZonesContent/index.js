import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import SpeedLimitZonesContent from './SpeedLimitZonesContent';
import styles from './styles';

export default withStyles(styles)(injectIntl(SpeedLimitZonesContent));
