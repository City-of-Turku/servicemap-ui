import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import React from 'react';
import areaServicesTku from 'servicemap-ui-turku/assets/images/area-page-tku.webp';
import mobilityMapTku from 'servicemap-ui-turku/assets/images/mobility-map-tku.webp';
import serviceTreeTku from 'servicemap-ui-turku/assets/images/service-tree-tku.webp';
import config from '../../../config';
import areaServices from '../../assets/images/area-services.jpg';
import mobilityTree from '../../assets/images/mobility-tree.jpg';
import serviceTree from '../../assets/images/service-tree.jpg';
import { SearchBar } from '../../components';
import CardSmall from '../../components/CardSmall/CardSmall';

const HomeView = props => {
  const { navigator } = props;

  // If external theme (by Turku) is true, then can be used to select which content to render
  const externalTheme = config.themePKG;
  const isExternalTheme = !externalTheme || externalTheme === 'undefined' ? null : externalTheme;

  const areaSelection = config.showAreaSelection;
  const isAreaSelection = !areaSelection || areaSelection === 'undefined' ? null : areaSelection;

  const categories = [
    {
      image: isExternalTheme ? areaServicesTku : areaServices,
      header: 'area.services.local',
      message: isExternalTheme ? 'home.buttons.area.tku' : 'home.buttons.area',
      type: 'area',
      visibility: isAreaSelection,
    },
    {
      image: mobilityMapTku,
      header: 'home.buttons.mobilityPlatformSettings.title',
      message: 'home.buttons.mobilityPlatformSettings',
      type: 'mobilityPlatform',
      visibility: !!isExternalTheme,
    },
    {
      image: isExternalTheme ? serviceTreeTku : serviceTree,
      header: 'general.pageTitles.serviceTree.title',
      message: 'home.buttons.services',
      type: 'serviceTree',
      visibility: true,
    },
    {
      image: mobilityTree,
      header: 'general.pageTitles.mobilityTree.title',
      message: 'home.buttons.mobilityTree',
      type: 'mobilityTree',
      visibility: !isExternalTheme,
    },
  ];

  const renderNavigationOptions = () => {
    const filteredCategories = categories.filter(item => item.visibility);

    return (
      <StyledContainer>
        {filteredCategories.map(item => (
          <CardSmall
            image={item.image}
            headerMessageID={item.header}
            messageID={item.message}
            onClick={() => navigator.push(item.type)}
          />
        ))}
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
