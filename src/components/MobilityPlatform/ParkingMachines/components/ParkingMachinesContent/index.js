import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import ParkingMachinesContent from './ParkingMachinesContent';
import styles from './styles';

export default withStyles(styles)(injectIntl(ParkingMachinesContent));
