import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import DisabledParkingContent from './DisabledParkingContent';
import styles from './styles';

export default withStyles(styles)(injectIntl(DisabledParkingContent));
