import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import SingleValueText from './SingleValueText';
import styles from './styles';

export default withStyles(styles)(injectIntl(SingleValueText));
