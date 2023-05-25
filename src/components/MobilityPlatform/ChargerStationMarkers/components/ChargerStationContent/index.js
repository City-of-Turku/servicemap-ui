import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import ChargerStationContent from './ChargerStationContent';
import styles from './styles';

export default withStyles(styles)(injectIntl(ChargerStationContent));
