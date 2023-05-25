import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import TrailInfo from './TrailInfo';
import styles from './styles';

export default withStyles(styles)(injectIntl(TrailInfo));
