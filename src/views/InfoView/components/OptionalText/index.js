import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import OptionalText from './OptionalText';
import styles from './styles';

export default injectIntl(withStyles(styles)(OptionalText));
