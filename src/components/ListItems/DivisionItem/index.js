import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import DivisionItem from './DivisionItem';
import styles from './styles';

const mapStateToProps = (state) => {
  const { navigator, user } = state;
  const { locale } = user;

  return {
    locale,
    navigator,
  };
};

export default injectIntl(connect(mapStateToProps)(withStyles(styles)(DivisionItem)));
