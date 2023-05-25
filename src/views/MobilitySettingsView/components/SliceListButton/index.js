import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import SliceListButton from './SliceListButton';
import styles from './styles';

const SliceList = SliceListButton;

export default withStyles(styles)(injectIntl(SliceList));
