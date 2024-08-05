import styled from '@emotion/styled';
import {
  BusinessCenter, DirectionsWalk, EscalatorWarning, LocationCity, Map,
} from '@mui/icons-material';
import { List, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import config from '../../../../../config';
import {
  AddressSearchBar,
  MobileComponent,
  SMAccordion,
  SMButton,
  TitleBar,
} from '../../../../components';
import {
  setMapState,
  setSelectedDistrictServices,
  setSelectedDistrictType,
  setSelectedSubdistricts,
} from '../../../../redux/actions/district';
import {
  getDistrictOpenItems,
  selectDistrictMapState,
  selectDistrictsFetching,
  selectSelectedDistrictType,
} from '../../../../redux/selectors/district';
import { selectMapRef, selectNavigator } from '../../../../redux/selectors/general';
import { parseSearchParams, stringifySearchParams } from '../../../../utils';
import useMobileStatus from '../../../../utils/isMobile';
import { mapHasMapPane } from '../../../../utils/mapUtility';
import { dataStructure } from '../../utils/districtDataHelper';
import GeographicalTab from '../GeographicalTab';
import MobilityResultTab from '../MobilityResultTab';
import ServiceTab from '../ServiceTab';
import StatisticalDistrictList from '../StatisticalDistrictList';
import { StyledListItem, StyledLoadingText } from '../styled/styled';

const getViewState = map => ({
  center: map.getCenter(),
  zoom: map.getZoom(),
});

function SideBar({ selectedAddress, setSelectedAddress }) {
  const dispatch = useDispatch();
  const intl = useIntl();
  const location = useLocation();
  const isMobile = useMobileStatus();
  const navigator = useSelector(selectNavigator);
  const selectedDistrictType = useSelector(selectSelectedDistrictType);
  const districtsFetching = useSelector(selectDistrictsFetching);
  const openItems = useSelector(getDistrictOpenItems);
  const mapState = useSelector(selectDistrictMapState);
  const map = useSelector(selectMapRef);
  const searchParams = parseSearchParams(location.search);
  const selectedArea = searchParams.selected;
  const selectedAreaType = selectedArea?.split(/([\d]+)/)[0];
  // Selected category handling
  const [areaSelection, setAreaSelection] = useState(null);

  const externalTheme = config.themePKG;
  const isExternalTheme = !externalTheme || externalTheme === 'undefined' ? null : externalTheme;

  const getInitialOpenItems = () => {
    if (selectedAreaType) {
      const category = dataStructure.find(
        data => data.id === selectedAreaType
          || data.districts.some(obj => obj.id === selectedAreaType),
      );
      return [category?.id];
    }
    return openItems;
  };
  const [initialOpenItems] = useState(getInitialOpenItems);

  useEffect(() => {
    if (mapState) {
      // Returns map to the previous spot
      const { center, zoom } = mapState;
      if (map && center && zoom) {
        map.setView(center, zoom);
      }
    }
    return () => {
      if (map && mapHasMapPane(map)) {
        // On unmount, save map position
        dispatch(setMapState(getViewState(map)));
      }
    };
  }, [mapState, map]);

  const clearRadioButtonValue = useCallback(() => {
    dispatch(setSelectedDistrictType(null));
    dispatch(setSelectedDistrictServices([]));
    dispatch(setSelectedSubdistricts([]));
  }, []);

  const renderServiceTab = () => (
    <ServiceTab
      selectedAddress={selectedAddress}
      initialOpenItems={initialOpenItems}
    />
  );

  const renderGeographicalTab = () => (
    <GeographicalTab
      initialOpenItems={initialOpenItems}
      clearRadioButtonValue={clearRadioButtonValue}
    />
  );

  const renderMobilityResultTab = () => (
    <MobilityResultTab />
  );

  const areaSectionSelection = (open, i) => {
    setAreaSelection(!open ? i : null);
    if (selectedDistrictType) {
      clearRadioButtonValue();
    }
    // Since TabList component was changed in favor of Accordion this
    // updates tab search param for keeping similar functionality as
    // with TabList component
    if (typeof i === 'number') {
      searchParams.t = i;
      // Get new search search params string
      const searchString = stringifySearchParams(searchParams);
      // Update select param to current history
      if (navigator) {
        navigator.replace({
          ...location,
          search: `?${searchString || ''}`,
        });
      }
    }
  };

  const categories = [
    {
      component: renderServiceTab(),
      title: intl.formatMessage({ id: 'area.tab.publicServices' }),
      icon: <StyledBusinessCenter />,
      visibility: true,
    },
    {
      component: renderGeographicalTab(),
      title: intl.formatMessage({ id: 'area.tab.geographical' }),
      icon: <StyledLocationCity />,
      visibility: true,
    },
    {
      component: renderMobilityResultTab(),
      title: intl.formatMessage({ id: 'area.tab.mobilityTest.results' }),
      icon: <StyledDirectionsWalk />,
      visibility: !!isExternalTheme,
    },
    {
      component: <StatisticalDistrictList />,
      title: intl.formatMessage({ id: 'area.tab.statisticalDistricts' }),
      icon: <StyledEscalatorWarning />,
      visibility: !isExternalTheme,
    },
  ];

  const filteredCategories = categories.filter(item => item.visibility);

  return (
    <div data-sm="AreaView">
      <TitleBar
        title={intl.formatMessage({ id: 'general.pageLink.area' })}
        titleComponent="p"
        backButton={!isMobile}
      />
      <StyledInfoText>
        <FormattedMessage id={isExternalTheme ? 'home.buttons.area.tku' : 'home.buttons.area'} />
      </StyledInfoText>
      <AddressSearchBar
        handleAddressChange={setSelectedAddress}
        title={(
          <>
            <FormattedMessage id="area.searchbar.infoText.address" />
            {' '}
            <FormattedMessage id="area.searchbar.infoText.optional" />
          </>
        )}
      />
      <List>
        {
          filteredCategories.map((category, i) => (
            <StyledListItem
              divider
              disableGutters
              key={category.title}
            >
              <SMAccordion // Top level categories
                adornment={category.icon}
                defaultOpen={false}
                disableUnmount
                onOpen={(e, open) => areaSectionSelection(open, i)}
                isOpen={areaSelection === i}
                elevated={areaSelection === i}
                titleContent={(
                  <Typography component="p" variant="subtitle1">
                    {category.title}
                  </Typography>
                )}
                collapseContent={category.component}
              />
            </StyledListItem>
          ))
        }
      </List>
      <MobileComponent>
        {!districtsFetching.length && (
          <SMButton
            aria-hidden
            role="link"
            margin
            messageID="general.showOnMap"
            icon={<Map />}
            onClick={() => navigator.openMap()}
          />
        )}
      </MobileComponent>
      <StyledLoadingText>
        <Typography style={visuallyHidden} aria-live="assertive">
          {districtsFetching.length
            ? <FormattedMessage id="general.loading" />
            : <FormattedMessage id="general.loading.done" />}
        </Typography>
      </StyledLoadingText>
    </div>
  );
}

const iconClass = theme => ({
  padding: theme.spacing(2),
  paddingLeft: theme.spacing(0),
});

const StyledBusinessCenter = styled(BusinessCenter)(({ theme }) => iconClass(theme));
const StyledLocationCity = styled(LocationCity)(({ theme }) => iconClass(theme));
const StyledEscalatorWarning = styled(EscalatorWarning)(({ theme }) => iconClass(theme));
const StyledDirectionsWalk = styled(DirectionsWalk)(({ theme }) => iconClass(theme));
const StyledInfoText = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingTop: 0,
  textAlign: 'start',
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
}));

SideBar.propTypes = {
  selectedAddress: PropTypes.objectOf(PropTypes.any),
  setSelectedAddress: PropTypes.func.isRequired,
};

SideBar.defaultProps = {
  selectedAddress: null,
};

export default SideBar;
