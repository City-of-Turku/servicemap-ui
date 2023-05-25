import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import BicycleStands from './BicycleStands';
import styles from './styles';

export default withStyles(styles)(injectIntl(BicycleStands));
