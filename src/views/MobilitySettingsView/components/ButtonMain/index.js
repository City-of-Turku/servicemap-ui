import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import ButtonMain from './ButtonMain';
import styles from './styles';

export default withStyles(styles)(injectIntl(ButtonMain));
