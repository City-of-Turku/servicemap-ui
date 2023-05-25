import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import EmptyRouteList from './EmptyRouteList';
import styles from './styles';

export default withStyles(styles)(injectIntl(EmptyRouteList));
