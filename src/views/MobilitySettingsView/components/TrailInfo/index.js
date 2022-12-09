import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import TrailInfo from './TrailInfo';
import styles from './styles';

export default withStyles(styles)(injectIntl(TrailInfo));
