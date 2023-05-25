import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import LinkBasic from './LinkBasic';
import styles from './styles';

export default injectIntl(withStyles(styles)(LinkBasic));
