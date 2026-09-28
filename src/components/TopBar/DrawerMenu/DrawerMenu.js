import PropTypes from 'prop-types';
import React from 'react';
import {
  ButtonBase, Divider, Drawer, Typography,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { getTheme, getPage } from '../../../redux/selectors/user';
import { changeTheme } from '../../../redux/actions/user';
import openA11yLink from '../util';
import { getLocale } from '../../../redux/selectors/locale';
import config from '../../../../config';
import NewTabIndicator from '../../NewTabIndicator/NewTabIndicator';
import { getServiceMapFeedbackUrl } from '../../../utils/feedbackLink';

const DrawerMenu = (props) => {
  const {
    classes, pageType, isOpen, toggleDrawerMenu, handleNavigation,
  } = props;
  const dispatch = useDispatch();
  const currentPage = useSelector(getPage);
  const locale = useSelector(getLocale);
  const theme = useSelector(getTheme);

  const menuMainButton = (headerId, textId, pageId) => (
    <StyledButtonBase
      aria-current={currentPage === pageId}
      role="link"
      onClick={() => {
        toggleDrawerMenu();
        handleNavigation(pageId);
      }}
    >
      <StyledTextContainer>
        <StyledTitle>
          <FormattedMessage id={headerId} />
        </StyledTitle>
        <Typography sx={{ color: '#666', fontSize: '0.913rem', lineHeight: '1.5rem' }}>
          <FormattedMessage id={textId} />
        </Typography>
      </StyledTextContainer>
      <ArrowForward sx={{ fontSize: '2.5rem', ml: 'auto' }} />
    </StyledButtonBase>
  );

  const menuExternalLink = (headerId, href, buttonId) => (
    <StyledButtonBase
      id={buttonId}
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        backgroundColor: 'rgba(167, 200, 232, 0.15)',
        color: 'inherit',
        textDecoration: 'none',
        width: '100%',
        '&:hover, &:active, &:focus, &:visited': {
          color: 'inherit !important',
        },
      }}
      onClick={() => toggleDrawerMenu()}
    >
      <StyledTextContainer>
        <StyledTitle component="span">
          <FormattedMessage id={headerId} />
          <NewTabIndicator />
        </StyledTitle>
      </StyledTextContainer>
    </StyledButtonBase>
  );

  const menuSecondaryButton = (headerId, pageId, handleClick, isLink, buttonId) => (
    <StyledButtonBase
      id={buttonId}
      sx={{ backgroundColor: 'rgba(167, 200, 232, 0.15)' }}
      aria-current={pageId && currentPage === pageId}
      role={isLink ? 'link' : 'button'}
      onClick={
        handleClick
        || (() => {
          toggleDrawerMenu();
          handleNavigation(pageId);
        })
      }
    >
      <StyledTextContainer>
        <StyledTitle>
          <FormattedMessage id={headerId} />
        </StyledTitle>
      </StyledTextContainer>
    </StyledButtonBase>
  );

  // If external theme (by Turku) is true, then can be used to select which content to render
  const externalTheme = config.themePKG;
  const isExternalTheme = !externalTheme || externalTheme === 'undefined' ? null : externalTheme;

  // If accessibility statement link is true, then can be used to select which content to render
  const a11yUrl = config.accessibilityStatementURL.fi;
  const isA11yUrl = !a11yUrl || a11yUrl === 'undefined' ? null : a11yUrl;

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={isOpen}
      classes={{ paper: pageType === 'mobile' ? classes.drawerContainerMobile : classes.drawerContainer }}
    >
      <div className={classes.scrollContainer}>
        {/* Main links */}
        {menuMainButton('general.frontPage', isExternalTheme ? 'app.description.tku' : 'app.description', 'home')}
        <Divider />
        {menuMainButton(
          'general.pageLink.area',
          isExternalTheme ? 'home.buttons.area.tku' : 'home.buttons.area',
          'area',
        )}
        <Divider />
        {menuMainButton(
          'general.pageTitles.mobilityPlatform',
          'home.buttons.mobilityPlatformSettings',
          'mobilityPlatform',
        )}
        <Divider />
        {menuMainButton('services', 'home.buttons.services', 'services')}
        <Divider />

        {/* Smaller buttons  */}
        {menuSecondaryButton(
          theme === 'default' ? 'general.contrast.ariaLabel.on' : 'general.contrast.ariaLabel.off',
          null,
          () => dispatch(changeTheme(theme === 'default' ? 'dark' : 'default')),
          false,
          'ContrastButton',
        )}
        {isA11yUrl ? <Divider /> : null}
        {isA11yUrl
          ? menuSecondaryButton(
            'info.statement',
            'accessibilityStatement',
            () => openA11yLink(locale),
            true,
            'AccessibilityStatementButton',
          )
          : null}
        <Divider />
        {menuExternalLink('home.send.feedback', getServiceMapFeedbackUrl(locale), 'FeedbackButton')}
        <Divider />
        {menuSecondaryButton('general.pageTitles.info', 'info', null, true, 'PageInfoButton')}
      </div>
    </Drawer>
  );
};

const StyledButtonBase = styled(ButtonBase)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(1.5),
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  justifyContent: 'flex-start',
}));

const StyledTextContainer = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  textAlign: 'left',
  paddingRight: theme.spacing(2),
}));

const StyledTitle = styled(Typography)(() => ({
  fontSize: '1.25rem',
  fontWeight: 500,
}));

DrawerMenu.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  pageType: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleDrawerMenu: PropTypes.func.isRequired,
  handleNavigation: PropTypes.func.isRequired,
};

export default DrawerMenu;
