import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import CultureRouteUnits from './CultureRouteUnits';
import styles from './styles';

export default injectIntl(withStyles(styles)(CultureRouteUnits));
