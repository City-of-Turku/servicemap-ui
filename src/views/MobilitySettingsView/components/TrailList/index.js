import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import TrailList from './TrailList';
import styles from './styles';

export default withStyles(styles)(injectIntl(TrailList));
