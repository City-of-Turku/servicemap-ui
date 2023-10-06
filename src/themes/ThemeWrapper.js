import { ThemeProvider } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import themes from '.';
import config from '../../config';

const mapStateToProps = (state) => {
  const { user } = state;
  return {
    theme: user.theme,
  };
};

// If external theme (by Turku) is true, then can be used to select which theme to get
const externalTheme = config.themePKG;
const isExternalTheme = !externalTheme || externalTheme === 'undefined' ? null : externalTheme;

/**
 * Returns default theme based on env value
 * @returns theme
 */
const getTheme = () => {
  if (isExternalTheme) {
    return themes.SMThemeTku;
  }
  return themes.SMTheme;
};

// Component to handle theme changes
const ThemeHandler = ({ children, theme }) => (
// Get correct theme setting from store
  <ThemeProvider theme={theme === 'dark' ? themes.SMThemeDark : getTheme()}>
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
