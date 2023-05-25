import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import ParkingMachinesContent from './ParkingMachinesContent';
import styles from './styles';

export default withStyles(styles)(injectIntl(ParkingMachinesContent));
