import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import CityBikeInfo from './CityBikeInfo';
import styles from './styles';

export default withStyles(styles)(injectIntl(CityBikeInfo));
