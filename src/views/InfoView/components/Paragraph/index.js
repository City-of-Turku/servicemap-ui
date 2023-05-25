import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import Paragraph from './Paragraph';
import styles from './styles';

export default injectIntl(withStyles(styles)(Paragraph));
