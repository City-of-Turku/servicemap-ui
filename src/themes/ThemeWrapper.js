import { ThemeProvider } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import themes from '.';

const mapStateToProps = (state) => {
  const { user } = state;
  return {
    theme: user.theme,
  };
};

// Component to handle theme changes
const ThemeHandler = ({ children, theme }) => (
// Get correct theme setting from store
  <ThemeProvider theme={theme === 'dark' ? themes.SMThemeDark : themes.SMTheme}>
    {children}
  </ThemeProvider>
);
ThemeHandler.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.string.isRequired,
};
ThemeHandler.defaultProps = {
  children: null,
};

const ThemeWrapper = connect(
  mapStateToProps,
)(ThemeHandler);

export default ThemeWrapper;
