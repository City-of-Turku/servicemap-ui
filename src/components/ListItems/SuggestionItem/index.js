import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import styles from './styles';
import SuggestionItem from './SuggestionItem';

export default injectIntl(withStyles(styles)(SuggestionItem));
