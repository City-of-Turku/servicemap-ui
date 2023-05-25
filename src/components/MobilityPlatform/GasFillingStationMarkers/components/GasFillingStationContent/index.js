import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import GasFillingStationContent from './GasFillingStationContent';
import styles from './styles';

export default withStyles(styles)(injectIntl(GasFillingStationContent));
