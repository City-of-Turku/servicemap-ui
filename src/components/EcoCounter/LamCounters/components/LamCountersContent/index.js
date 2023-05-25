import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import LamCountersContent from './LamCountersContent';
import styles from './styles';

export default withStyles(styles)(injectIntl(LamCountersContent));
