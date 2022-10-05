/* eslint-disable global-require */
/* eslint-disable camelcase */
import { ButtonBase, Divider, List, Typography } from '@material-ui/core';
import { Map } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { AddressIcon } from '../../components/SMIcon';
import TitleBar from '../../components/TitleBar';
import { focusToPosition, useMapFocusDisabled } from '../MapView/utils/mapActions';
import fetchAdministrativeDistricts from './utils/fetchAdministrativeDistricts';

import config from '../../../config';
import { DistrictItem, SearchBar } from '../../components';
import DesktopComponent from '../../components/DesktopComponent';
import DivisionItem from '../../components/ListItems/DivisionItem';
import MobileComponent from '../../components/MobileComponent';
import SMButton from '../../components/ServiceMapButton';
import TabLists from '../../components/TabLists';
import { parseSearchParams } from '../../utils';
import { addressMatchParamsToFetchOptions, getAddressText, useNavigationParams } from '../../utils/address';
import useLocaleText from '../../utils/useLocaleText';
import { getCategoryDistricts } from '../AreaView/utils/districtDataHelper';
import fetchAddressData from './utils/fetchAddressData';
import fetchAddressUnits from './utils/fetchAddressUnits';


const hiddenDivisions = {
  emergency_care_district: true,
};

const getEmergencyCareUnit = (division) => {
  if (division && division.type === 'emergency_care_district') {
    switch (division.ocd_id) {
      case 'ocd-division/country:fi/kunta:helsinki/päivystysalue:haartmanin_päivystysalue': {
        return 26104; // Haartman
      }
      case 'ocd-division/country:fi/kunta:helsinki/päivystysalue:marian_päivystysalue': {
        return 26107; // Malmi
      }
      // The next ID anticipates a probable change in the division name
      case 'ocd-division/country:fi/kunta:helsinki/päivystysalue:malmin_päivystysalue': {
        return 26107; // Malmi
      }
      default: {
        return null;
      }
    }
  }
  return null;
};

const AddressView = (props) => {
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const getAddressNavigatorParams = useNavigationParams();
  const getLocaleText = useLocaleText();
  const searchResults = useSelector(state => state.searchResults.data);

  const {
    addressData,
    adminDistricts,
    classes,
    embed,
    intl,
    match,
    getDistance,
    map,
    setAddressData,
    setAddressLocation,
    setAddressUnits,
    setDistrictAddressData,
    setAdminDistricts,
    setToRender,
    navigator,
    location,
    units,
  } = props;

  let title = '';

  if (!isFetching) {
    if (addressData?.name) title = getLocaleText(addressData?.name);
    else title = getAddressText(addressData, getLocaleText);
  }

  const mapFocusDisabled = useMapFocusDisabled();

  const fetchAddressDistricts = (lnglat) => {
    setAdminDistricts(null);
    // Fetch administrative districts data
    fetchAdministrativeDistricts(lnglat)
      .then(response => setAdminDistricts(response));
  };

  const fetchUnits = (lnglat) => {
    fetchAddressUnits(lnglat)
      .then((data) => {
        const units = data.results;
        units.forEach((unit) => {
          unit.object_type = 'unit';
        });
        setAddressUnits(data.results);
      });
  };

  const compareAddress = (newAdddress) => {
    if (!newAdddress) return false;
    const compareValues = (a, b) => {
      if ((!a && !b) || a === b) {
        return true;
      }
      return false;
    };

    return addressData
      && compareValues(newAdddress.street, getLocaleText(addressData.street.name))
      && compareValues(newAdddress.number, addressData.number)
      && compareValues(newAdddress.number_end, addressData.number_end)
      && compareValues(newAdddress.letter, addressData.letter);
  };

  const handleAddressData = (address) => {
    // Check if address data is in different language
    // and move navigation to address page with correct language
    const { params } = match;

    if (params.street.toLowerCase() !== getLocaleText(address.street.name).toLowerCase()) {
      navigator.replace('address', {
        ...getAddressNavigatorParams(address),
        embed,
      });
    }
    setAddressData(address);
    setAddressLocation({ addressCoordinates: address.location.coordinates });
    const { coordinates } = address.location;

    if (!mapFocusDisabled) {
      focusToPosition(map, [coordinates[0], coordinates[1]]);
    }
    fetchAddressDistricts(coordinates);
    fetchUnits(coordinates);
  };

  const fetchData = () => {
    const options = match ? addressMatchParamsToFetchOptions(match) : {};

    const isSameAddress = compareAddress(options);
    if (isSameAddress) return;

    setAddressUnits([]);

    setIsFetching(true);
    fetchAddressData(options)
      .then((data) => {
        setIsFetching(false);
        const address = data;
        if (address) {
          handleAddressData(address);
        } else {
          setError(intl.formatMessage({ id: 'address.error' }));
        }
      });
  };


  const getAddressFromSearch = () => {
    if (!searchResults.length) return null;
    const addressNameFromParams = [match.params.street, match.params.number].join(' ');
    return searchResults.find(item => addressNameFromParams === getLocaleText(item.name));
  };


  const renderHead = (title) => {
    if (addressData) {
      return (
        <Helmet>
          <title>
            {`${title} | ${intl.formatMessage({ id: 'app.title' })}`}
          </title>
        </Helmet>
      );
    } return null;
  };

  const renderTopBar = title => (
    <>
      <DesktopComponent>
        <SearchBar margin />
        <TitleBar
          sticky
          icon={<AddressIcon className={classes.titleIcon} />}
          title={error || title}
          titleComponent="h3"
          primary
        />
      </DesktopComponent>
      <MobileComponent>
        <TitleBar
          sticky
          icon={<AddressIcon />}
          title={title}
          titleComponent="h3"
          primary
          backButton
        />
      </MobileComponent>
    </>
  );

  const renderNearbyList = () => {
    if (isFetching || !units) {
      return <Typography><FormattedMessage id="general.loading" /></Typography>;
    } if (units && !units.length) {
      return <Typography><FormattedMessage id="general.noData" /></Typography>;
    }
    return null;
  };


  const renderClosebyServices = () => {
    if (isFetching || !adminDistricts) {
      return <Typography><FormattedMessage id="general.loading" /></Typography>;
    }
    // Get divisions with units
    const divisionsWithUnits = adminDistricts
      .filter(d => d.unit)
      .filter(d => !hiddenDivisions[d.type]);
    // Get emergency division
    const emergencyDiv = adminDistricts.find(x => x.type === 'emergency_care_district');

    // Also add rescue areas that have no units
    const rescueAreaIDs = getCategoryDistricts('protection');
    const rescueAreas = adminDistricts.filter((obj, i) => {
      if (rescueAreaIDs.includes(obj.type)) {
        if (!obj.unit) {
          return true;
        }
        // Move rescue areas to the end of unit list
        adminDistricts.push(adminDistricts.splice(i, 1)[0]);
        return false;
      }
      return false;
    });

    const getCustomRescueAreaTitle = area => `${area.origin_id} - ${getLocaleText(area.name)}`;

    const units = divisionsWithUnits.map((x) => {
      const { unit } = x;
      const unitData = unit;
      unitData.area = x;
      if (x.type === 'health_station_district') {
        unitData.emergencyUnitId = getEmergencyCareUnit(emergencyDiv);
      }
      return unitData;
    });

    return (
      <>
        <div className={classes.servicesTitle}>
          <Typography align="left" variant="body2"><FormattedMessage id="address.services.info" /></Typography>
          <ButtonBase
            role="link"
            className={classes.areaLink}
            onClick={() => {
              setDistrictAddressData({ address: addressData });
              navigator.push('area');
            }}
          >
            <Typography align="left" variant="body2">
              <FormattedMessage id="address.area.link" />
            </Typography>
          </ButtonBase>
        </div>
        <Divider aria-hidden />
        <List>
          {
            units.map((data) => {
              const key = `${data.area.id}`;
              const distance = getDistance(data);
              const customTitle = rescueAreaIDs.includes(data.area.type)
                ? `${intl.formatMessage({ id: `area.list.${data.area.type}` })} ${getCustomRescueAreaTitle(data.area)}`
                : null;
              return (
                <DivisionItem
                  data={data}
                  distance={distance}
                  divider
                  key={key}
                  customTitle={customTitle}
                />
              );
            })
          }
          {rescueAreas.map(area => (
            <DistrictItem key={area.id} area={area} />
          ))}
        </List>
      </>
    );
  };


  // Render component
  const tabs = [
    {
      ariaLabel: intl.formatMessage({ id: 'address.nearby' }),
      component: renderNearbyList(),
      data: units,
      itemsPerPage: 10,
      title: intl.formatMessage({ id: 'address.nearby' }),
      noOrderer: true, // Remove this when we want result orderer for address unit list
      onClick: () => {
        setToRender('units');
      },
    },
  ];

  // Show/Hide nearby service tab dynamically, show only if area selection is shown
  if (config.showAreaSelection) {
    const nearbyServicesTab = {
      ariaLabel: intl.formatMessage({ id: 'address.services.header' }),
      component: renderClosebyServices(),
      data: null,
      itemsPerPage: null,
      title: intl.formatMessage({ id: 'address.services.header' }),
      onClick: () => {
        setToRender('adminDistricts');
      },
    };
    tabs.unshift(nearbyServicesTab);
  }

  useEffect(() => {
    const searchParams = parseSearchParams(location.search);
    const selectedTab = parseInt(searchParams.t, 10) || 0;
    if (tabs[selectedTab].onClick) {
      tabs[selectedTab].onClick();
    }
  }, []);

  // Update view data when match props (url) change
  useEffect(() => {
    if (map) {
      // If navigating from search page, address data should already be in search results
      const addressFromSearch = getAddressFromSearch();
      if (addressFromSearch) {
        handleAddressData(addressFromSearch);
      } else {
        fetchData();
      }
    }
  }, [match.url, map]);

  if (embed) {
    return null;
  }

  return (
    <div>
      {renderHead(title)}
      {renderTopBar(title)}
      <TabLists
        data={tabs}
        headerComponents={(
          <div className={classes.topArea}>
            {addressData && units && (
              <MobileComponent>
                <SMButton
                  aria-hidden
                  margin
                  messageID="general.showOnMap"
                  icon={<Map />}
                  className={classes.mapButton}
                  onClick={() => {
                    if (navigator) {
                      focusToPosition(map, addressData.location.coordinates);
                      navigator.openMap();
                    }
                  }}
                />
              </MobileComponent>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default AddressView;

AddressView.propTypes = {
  addressData: PropTypes.objectOf(PropTypes.any),
  adminDistricts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
  })),
  match: PropTypes.objectOf(PropTypes.any),
  map: PropTypes.objectOf(PropTypes.any),
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  getDistance: PropTypes.func.isRequired,
  setAddressData: PropTypes.func.isRequired,
  setAddressLocation: PropTypes.func.isRequired,
  setAddressUnits: PropTypes.func.isRequired,
  setAdminDistricts: PropTypes.func.isRequired,
  setDistrictAddressData: PropTypes.func.isRequired,
  setToRender: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  embed: PropTypes.bool,
  units: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
  })),
};

AddressView.defaultProps = {
  addressData: null,
  adminDistricts: null,
  match: {},
  map: null,
  navigator: null,
  embed: false,
  units: [],
};
