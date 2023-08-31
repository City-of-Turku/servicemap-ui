import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import EcoCounterContent from './EcoCounterContent';
import styles from './styles';

export default withStyles(styles)(injectIntl(EcoCounterContent));
