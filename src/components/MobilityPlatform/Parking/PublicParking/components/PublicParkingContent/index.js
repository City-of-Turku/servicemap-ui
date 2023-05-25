import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import PublicParkingContent from './PublicParkingContent';
import styles from './styles';

export default withStyles(styles)(injectIntl(PublicParkingContent));
