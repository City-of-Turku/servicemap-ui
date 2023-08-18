import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import Pagination from './Pagination';
import styles from './styles';

export default withStyles(styles)(injectIntl(Pagination));
