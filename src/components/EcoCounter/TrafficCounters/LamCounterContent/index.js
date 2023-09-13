import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import LamCounterContent from './LamCounterContent';
import styles from './styles';

export default withStyles(styles)(injectIntl(LamCounterContent));
