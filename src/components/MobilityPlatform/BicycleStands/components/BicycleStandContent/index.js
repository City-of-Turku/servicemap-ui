import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import BicycleStandContent from './BicycleStandContent';
import styles from './styles';

export default withStyles(styles)(injectIntl(BicycleStandContent));
