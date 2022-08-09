import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import EmptyRouteList from './EmptyRouteList';
import styles from './styles';

export default withStyles(styles)(injectIntl(EmptyRouteList));
