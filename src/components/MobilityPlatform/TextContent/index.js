import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import styles from './styles';
import TextContent from './TextContent';

export default withStyles(styles)(injectIntl(TextContent));
