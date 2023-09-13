import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import MobilityToggleButton from './MobilityToggleButton';
import styles from './styles';

export default withStyles(styles)(injectIntl(MobilityToggleButton));
