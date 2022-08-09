import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import FormLabel from './FormLabel';
import styles from './styles';

export default withStyles(styles)(injectIntl(FormLabel));
