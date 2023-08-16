import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import RentalCarParkingContent from './RentalCarParkingContent';
import styles from './styles';

export default withStyles(styles)(injectIntl(RentalCarParkingContent));
