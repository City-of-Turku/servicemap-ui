import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import ScooterProviderList from './ScooterProviderList';
import styles from './styles';

export default withStyles(styles)(injectIntl(ScooterProviderList));
