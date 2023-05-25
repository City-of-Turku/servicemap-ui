import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import TrafficCountersContent from './TrafficCountersContent';
import styles from './styles';

export default withStyles(styles)(injectIntl(TrafficCountersContent));
