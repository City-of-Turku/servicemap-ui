import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import LoadingPlacesContent from './LoadingPlacesContent';
import styles from './styles';

export default withStyles(styles)(injectIntl(LoadingPlacesContent));
