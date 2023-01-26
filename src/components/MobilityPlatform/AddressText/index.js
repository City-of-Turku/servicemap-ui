import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import AddressText from './AddressText';
import styles from './styles';

export default withStyles(styles)(injectIntl(AddressText));
