import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import SpeedLimitZonesList from './SpeedLimitZonesList';
import styles from './styles';

export default withStyles(styles)(injectIntl(SpeedLimitZonesList));
