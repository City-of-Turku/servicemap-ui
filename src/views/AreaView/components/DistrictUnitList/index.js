import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import styles from '../../styles';
import DistrictUnitList from './DistrictUnitList';

export default injectIntl(withStyles(styles)(DistrictUnitList));
