import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import DisabledParkingContent from './DisabledParkingContent';
import styles from './styles';

export default withStyles(styles)(injectIntl(DisabledParkingContent));
