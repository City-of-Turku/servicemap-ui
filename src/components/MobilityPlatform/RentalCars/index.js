import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import RentalCars from './RentalCars';
import styles from './styles';

export default withStyles(styles)(injectIntl(RentalCars));
