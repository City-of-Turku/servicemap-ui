import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import ButtonMain from './ButtonMain';
import styles from './styles';

export default withStyles(styles)(injectIntl(ButtonMain));
