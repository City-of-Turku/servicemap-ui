import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import ScooterInfo from './ScooterInfo';
import styles from './styles';

export default withStyles(styles)(injectIntl(ScooterInfo));
