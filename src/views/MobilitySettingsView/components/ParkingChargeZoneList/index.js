import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import ParkingChargeZoneList from './ParkingChargeZoneList';
import styles from './styles';

export default withStyles(styles)(injectIntl(ParkingChargeZoneList));
