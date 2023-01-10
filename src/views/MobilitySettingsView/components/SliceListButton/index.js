import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import SliceListButton from './SliceListButton';
import styles from './styles';

const SliceList = SliceListButton;

export default withStyles(styles)(injectIntl(SliceList));
