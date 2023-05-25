import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import RentalCarsContent from './RentalCarsContent';
import styles from './styles';

export default withStyles(styles)(injectIntl(RentalCarsContent));
