import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import ParkingChargeZoneList from './ParkingChargeZoneList';
import styles from './styles';

export default withStyles(styles)(injectIntl(ParkingChargeZoneList));
