import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import AirMonitoringContent from './AirMonitoringContent';
import styles from './styles';

export default withStyles(styles)(injectIntl(AirMonitoringContent));
