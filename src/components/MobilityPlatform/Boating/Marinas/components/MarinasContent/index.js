import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import MarinasContent from './MarinasContent';
import styles from './styles';

export default withStyles(styles)(injectIntl(MarinasContent));
