import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import WeatherStationContent from './WeatherStationsContent';
import styles from './styles';

export default withStyles(styles)(injectIntl(WeatherStationContent));
