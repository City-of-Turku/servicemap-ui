import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import ParkingChargeZoneContent from './ParkingChargeZoneContent';
import styles from './styles';

export default withStyles(styles)(injectIntl(ParkingChargeZoneContent));
