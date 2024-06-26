import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  AppBar, ButtonBase, Container, Toolbar, Typography, useMediaQuery,
} from '@mui/material';
import { Map } from '@mui/icons-material';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import paths from '../../../config/paths';
import DrawerMenu from './DrawerMenu';
import DesktopComponent from '../DesktopComponent';
import MobileComponent from '../MobileComponent';
import ToolMenu from '../ToolMenu';
import { focusToViewTitle } from '../../utils/accessibility';
import { useNavigationParams } from '../../utils/address';
import MenuButton from './MenuButton';
import SMLogo from './SMLogo';
import { isHomePage } from '../../utils/path';
import LanguageMenu from './LanguageMenu';
import { getLocale } from '../../redux/selectors/locale';
import MobileNavButton from './MobileNavButton/MobileNavButton';
import LanguageMenuComponent from './LanguageMenu/LanguageMenuComponent';
import openA11yLink from './util';
import config from '../../../config';

const TopBar = (props) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const intl = useIntl();
  const locale = useSelector(getLocale);
  const getAddressNavigatorParams = useNavigationParams();
  const isOnHomePage = isHomePage(location?.pathname);

  // If accessibility statement link is true, then can be used to select which content to render
  const a11yUrl = config.accessibilityStatementURL.fi;
  const isA11yUrl = !a11yUrl || a11yUrl === 'undefined' ? null : a11yUrl;

  const {
    hideButtons,
    settingsOpen,
    classes,
    toggleSettings,
    breadcrumb,
    changeTheme,
    theme,
    setMapType,
    navigator,
    currentPage,
    smallScreen,
  } = props;

  const renderMapButton = () => {
    const mapPage = location.search.indexOf('showMap=true') > -1;
    const textId = mapPage ? 'map.close' : 'map.open';
    return (
      <MobileNavButton
        aria-current={mapPage ? 'page' : false}
        aria-hidden
        icon={<Map />}
        text={<FormattedMessage id={textId} />}
        onClick={(e) => {
          e.preventDefault();
          if (settingsOpen) {
            toggleSettings();
          }
          if (mapPage) {
            navigator.closeMap(breadcrumb.length ? 'replace' : null);
          } else {
            navigator.openMap();
          }
        }}
      />
    );
  };

  const toggleDrawerMenu = () => {
    setTimeout(() => {
      setDrawerOpen(!drawerOpen);
    }, 1);
  };

  const renderMenuButton = (pageType) => (
    <MenuButton
      pageType={pageType}
      drawerOpen={drawerOpen}
      toggleDrawerMenu={() => toggleDrawerMenu()}
    />
  );

  const handleContrastChange = () => {
    changeTheme(theme === 'default' ? 'dark' : 'default');
    setMapType(theme === 'default' ? 'accessible_map' : 'servicemap');
  };

  const handleNavigation = (target, data) => {
    const isHomePage = paths.home.regex.test(window.location.href);
    // Hide settings and map if open
    toggleSettings();
    if (location.search.indexOf('showMap=true') > -1) {
      navigator.closeMap();
    }

    if (currentPage === target) return;

    switch (target) {
      case 'home':
        if (!isOnHomePage) {
          navigator.push('home');
        } else {
          setTimeout(() => {
            focusToViewTitle();
          }, 1);
        }
        break;

      case 'address':
        navigator.push('address', getAddressNavigatorParams(data));
        break;

      case 'services':
        if (currentPage !== 'serviceTree') {
          navigator.push('serviceTree');
        }
        break;

      case 'area':
        navigator.push('area');
        break;

      case 'feedback':
        navigator.push('feedback');
        break;

      case 'info':
        navigator.push('info');
        break;

      case 'mobilityPlatform':
        if (currentPage !== 'mobilityPlatform') {
          navigator.push('mobilityPlatform');
        }
        break;

      default:
        break;
    }
  };

  const large = useMediaQuery('(min-width:360px)');

  const renderDrawerMenu = (pageType) => (
    <DrawerMenu
      isOpen={drawerOpen}
      pageType={pageType}
      toggleDrawerMenu={() => toggleDrawerMenu()}
      toggleSettings={toggleSettings}
      handleNavigation={handleNavigation}
    />
  );

  const renderTopBar = (pageType) => {
    const toolbarBlueClass = `${
      classes.toolbarBlue
    } ${
      pageType === 'mobile' ? classes.toolbarBlueMobile : ''
    }`;
    const contrastAriaLabel = intl.formatMessage({ id: `general.contrast.ariaLabel.${theme === 'dark' ? 'off' : 'on'}` });

    const topBarLink = (textId, onClick, isCurrent, ariaLabel, linkId) => (
      <ButtonBase sx={{ ml: 3 }} onClick={onClick} aria-current={isCurrent} aria-label={ariaLabel} id={linkId}>
        <Typography><FormattedMessage id={textId} /></Typography>
      </ButtonBase>
    );

    const navigationButton = (textId, onClick, isCurrent, buttonId) => (
      <ButtonBase onClick={onClick} aria-current={isCurrent} className={classes.navigationButton} id={buttonId}>
        <Typography sx={{ color: '#000', fontSize: '1.125rem', fontWeight: 600 }}>
          <FormattedMessage id={textId} />
        </Typography>
      </ButtonBase>
    );

    return (
      <>
        <AppBar className={classes.appBar}>
          {/* Toolbar blue area */}
          <DesktopComponent>
            <nav aria-label={intl.formatMessage({ id: 'app.navigation.language' })}>
              <Toolbar className={toolbarBlueClass}>
                <LanguageMenu mobile={pageType === 'mobile'} />
                {/* Right side links */}
                <Container disableGutters sx={{ justifyContent: 'flex-end', display: 'flex', mr: 0 }}>
                  {topBarLink('general.contrast', () => handleContrastChange(), false, contrastAriaLabel, 'ContrastLink')}
                  {!smallScreen
                    ? (
                      <>
                        {isA11yUrl ? topBarLink('info.statement', () => openA11yLink(locale), false, undefined, 'AccessibilityStatementLink') : null}
                        {topBarLink('general.pageTitles.info', () => handleNavigation('info'), currentPage === 'info', undefined, 'PageInfoLink')}
                        {topBarLink('home.send.feedback', () => handleNavigation('feedback'), currentPage === 'feedback', undefined, 'FeedbackLink')}
                      </>
                    )
                    : null}
                </Container>
              </Toolbar>
            </nav>
          </DesktopComponent>

          {/* Toolbar white area */}
          <Toolbar disableGutters className={pageType === 'mobile' ? classes.toolbarWhiteMobile : classes.toolbarWhite}>
            <SMLogo small={!large} onClick={() => handleNavigation('home')} />
            {hideButtons
              ? null
              : (
                <>
                  <MobileComponent>
                    <div className={classes.mobileButtonContainer}>
                      <LanguageMenuComponent mobile classes={classes} />
                      {renderMapButton()}
                      {renderMenuButton(pageType)}
                    </div>
                    {renderDrawerMenu(pageType)}
                  </MobileComponent>
                  <DesktopComponent>
                    <nav className={classes.navContainer}>
                      {!smallScreen ? (
                        <div className={classes.navigationButtonsContainer}>
                          {navigationButton('general.frontPage', () => handleNavigation('home'), currentPage === 'home', 'HomePage')}
                          {navigationButton('general.pageLink.area', () => handleNavigation('area'), currentPage === 'area', 'AreaPage')}
                          {navigationButton('services', () => handleNavigation('services'), currentPage === 'services', 'ServicePage')}
                        </div>
                      ) : (
                        <>
                          <div className={classes.mobileButtonContainer}>
                            {renderMenuButton()}
                          </div>
                          {renderDrawerMenu(pageType)}
                        </>
                      )}
                    </nav>
                    {
                      !smallScreen && (
                        <ToolMenu />
                      )
                    }
                  </DesktopComponent>
                </>
              )}
          </Toolbar>
        </AppBar>
        {/* This empty toolbar fixes the issue where App bar hides the top page content */}
        <Toolbar
          className={
            pageType === 'mobile' ? classes.alignerMobile : classes.aligner
          }
        />
      </>
    );
  };

  return (
    <>
      <MobileComponent>
        <>{renderTopBar('mobile')}</>
      </MobileComponent>
      <DesktopComponent>
        <>{renderTopBar('desktop')}</>
      </DesktopComponent>
    </>
  );
};

TopBar.propTypes = {
  breadcrumb: PropTypes.arrayOf(PropTypes.any).isRequired,
  changeTheme: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  currentPage: PropTypes.string.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  setMapType: PropTypes.func.isRequired,
  settingsOpen: PropTypes.string,
  smallScreen: PropTypes.bool.isRequired,
  theme: PropTypes.string.isRequired,
  toggleSettings: PropTypes.func.isRequired,
  hideButtons: PropTypes.bool,
};

TopBar.defaultProps = {
  navigator: null,
  settingsOpen: null,
  hideButtons: false,
};

export default TopBar;
