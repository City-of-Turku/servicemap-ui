import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import SpeedLimitZonesContent from './SpeedLimitZonesContent';
import styles from './styles';

export default withStyles(styles)(injectIntl(SpeedLimitZonesContent));
