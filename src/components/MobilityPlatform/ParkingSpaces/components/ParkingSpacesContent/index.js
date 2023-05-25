import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import ParkingSpacesContent from './ParkingSpacesContent';
import styles from './styles';

export default withStyles(styles)(injectIntl(ParkingSpacesContent));
