import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import serviceTreeTku from 'servicemap-ui-turku/assets/images/service-tree-tku.webp';
import areaServicesTku from 'servicemap-ui-turku/assets/images/area-page-tku.webp';
import mobilityMapTku from 'servicemap-ui-turku/assets/images/mobility-map-tku.webp';
import { NewsInfo, SearchBar, SettingsComponent } from '../../components';
import config from '../../../config';
import CardSmall from '../../components/CardSmall/CardSmall';
import areaServices from '../../assets/images/area-services.jpg';
import serviceTree from '../../assets/images/service-tree.jpg';
import mobilityTree from '../../assets/images/mobility-tree.jpg';

const HomeView = props => {
  const { navigator } = props;

  // If external theme (by Turku) is true, then can be used to select which content to render
  const externalTheme = config.themePKG;
  const isExternalTheme = !externalTheme || externalTheme === 'undefined' ? null : externalTheme;

  const renderNavigationOptions = () => {
    let areaSelection = null;

    if (config.showAreaSelection) {
      areaSelection = (
        <CardSmall
          image={isExternalTheme ? areaServicesTku : areaServices}
          headerMessageID="area.services.local"
          messageID={isExternalTheme ? 'home.buttons.area.tku' : 'home.buttons.area'}
          onClick={() => navigator.push('area')}
        />
      );
    }

    let mobilityMap = null;

    if (isExternalTheme) {
      mobilityMap = (
        <CardSmall
          image={mobilityMapTku}
          headerMessageID="home.buttons.mobilityPlatformSettings.title"
          messageID="home.buttons.mobilityPlatformSettings"
          onClick={() => navigator.push('mobilityPlatform')}
        />
      );
    }

    return (
      <StyledContainer>
        {areaSelection}
        {mobilityMap}
        <CardSmall
          image={isExternalTheme ? serviceTreeTku : serviceTree}
          headerMessageID="general.pageTitles.serviceTree.title"
          messageID="home.buttons.services"
          onClick={() => navigator.push('serviceTree')}
        />
        {!isExternalTheme ? (
          <CardSmall
            image={mobilityTree}
            headerMessageID="general.pageTitles.mobilityTree.title"
            messageID="home.buttons.mobilityTree"
            onClick={() => navigator.push('mobilityTree')}
          />
        ) : null}
        <NewsInfo showCount={2} />
      </StyledContainer>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <SearchBar hideBackButton header />
      {renderNavigationOptions()}
    </div>
  );
};

const StyledContainer = styled.div(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingBottom: theme.spacing(4),
}));

export default HomeView;

// Typechecking
HomeView.propTypes = {
  navigator: PropTypes.objectOf(PropTypes.any),
};

HomeView.defaultProps = {
  navigator: null,
};
