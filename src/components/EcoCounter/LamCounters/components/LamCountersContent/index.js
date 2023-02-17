import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import LamCountersContent from './LamCountersContent';
import styles from './styles';

export default withStyles(styles)(injectIntl(LamCountersContent));
