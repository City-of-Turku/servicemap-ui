import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import ScooterProviderList from './ScooterProviderList';
import styles from './styles';

export default withStyles(styles)(injectIntl(ScooterProviderList));
