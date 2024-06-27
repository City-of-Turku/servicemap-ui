import { ThemeProvider } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import themes from '.';
import config from '../../config';
import { selectThemeMode } from '../redux/selectors/user';

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
const ThemeHandler = ({ children }) => {
  const themeMode = useSelector(selectThemeMode);
  return (// Get correct theme setting from store
    <ThemeProvider theme={themeMode === 'dark' ? themes.SMThemeDark : getTheme()}>
      {children}
    </ThemeProvider>
  );
};
ThemeHandler.propTypes = {
  children: PropTypes.node,
};
ThemeHandler.defaultProps = {
  children: null,
};

export default ThemeHandler;
