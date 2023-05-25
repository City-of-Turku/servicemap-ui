import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import styles from '../../styles';
import GeographicalTab from './GeographicalTab';

export default injectIntl(withStyles(styles)(GeographicalTab));
