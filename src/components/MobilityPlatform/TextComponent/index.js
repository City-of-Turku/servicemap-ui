import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import TextComponent from './TextComponent';
import styles from './styles';

export default withStyles(styles)(injectIntl(TextComponent));
