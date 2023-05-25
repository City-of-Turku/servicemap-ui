import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import styles from '../../styles/styles';
import ContactInfo from './ContactInfo';

export default injectIntl(withStyles(styles)(ContactInfo));
