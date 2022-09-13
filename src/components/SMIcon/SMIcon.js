import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles';

const SMIcon = ({
  className, classes, icon, ...rest
}) => (
  <span aria-hidden="true" className={`${className} ${icon} ${classes.icon}`} {...rest} />
);

SMIcon.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  icon: PropTypes.string.isRequired,
};

SMIcon.defaultProps = {
  className: '',
};

export default withStyles(styles)(SMIcon);
