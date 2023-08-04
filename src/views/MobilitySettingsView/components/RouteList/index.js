import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import RouteList from './RouteList';
import styles from './styles';

export default withStyles(styles)(injectIntl(RouteList));
