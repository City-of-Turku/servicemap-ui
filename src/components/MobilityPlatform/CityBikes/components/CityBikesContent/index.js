import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import CityBikesContent from './CityBikesContent';
import styles from './styles';

export default withStyles(styles)(injectIntl(CityBikesContent));
