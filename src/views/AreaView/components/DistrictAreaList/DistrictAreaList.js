import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Divider, List, Typography } from '@mui/material';
import { getAddressDistrict } from '../../../../redux/selectors/district';
import { DistrictItem } from '../../../../components';
import { sortByOriginID } from '../../utils';

export const DistrictAreaList = ({
  classes,
  selectedAddress,
  district,
}) => {
  const intl = useIntl();
  const citySettings = useSelector(state => state.settings.cities);
  const addressDistrict = useSelector(state => getAddressDistrict(state));
  let sectionText = intl.formatMessage({ id: `area.services.all.${district.id}` });

  const districtsWithoutUnits = district.data.filter(d => (
    !d.unit
    && (
      d.type === 'rescue_area'
      || d.type === 'rescue_district'
      || d.type === 'rescue_sub_district'
    )
  ));

  if (!districtsWithoutUnits.length) {
    return null;
  }

  const selectedCities = Object.keys(citySettings).filter(city => citySettings[city]);
  let filteredData = [];
  if (!selectedCities.length) {
    filteredData = districtsWithoutUnits;
  } else {
    filteredData = districtsWithoutUnits.filter(d => (
      selectedCities.includes(d.municipality)
    ));
  }

  if (!filteredData.length) {
    return null;
  }

  const renderServiceListAccordion = (title, districts) => (
    <div className={classes.serviceTabServiceList}>
      <Typography>{`${title} (${districts.length})`}</Typography>
      <List disablePadding>
        {districts.map(district => (
          <DistrictItem key={district.id} area={district} title={false} paddedDivider />
        ))}
      </List>
    </div>
  );

  sortByOriginID(filteredData);

  if (selectedAddress && addressDistrict) {
    sectionText = intl.formatMessage({ id: `area.services.nearby.${district.id}` });
    const localDistrict = filteredData.filter(obj => obj.id === addressDistrict.id);
    const otherDistricts = filteredData.filter(obj => obj.id !== addressDistrict.id);

    const localAreaDistricts = [];
    localDistrict.forEach((district) => {
      const newValue = district;
      localAreaDistricts.push(newValue);
    });
    const otherAreaDistricts = [];
    otherDistricts.forEach((district) => {
      if (district.municipality === selectedAddress.municipality.id) {
        const newValue = district;
        otherAreaDistricts.push(newValue);
      }
    });

    if (!localAreaDistricts.length && !otherAreaDistricts.length) {
      return null;
    }

    return (
      <div>
        {localAreaDistricts.length ? (
          <>
            <div className={classes.servciceList}>
              <Typography>
                <FormattedMessage id="area.services.local" />
              </Typography>
              <List disablePadding>
                {localAreaDistricts.map(district => (
                  <DistrictItem key={district.id} area={district} title={false} hideDivider />
                ))}
              </List>
            </div>
            <Divider className={classes.serviceDivider} aria-hidden />
          </>
        ) : null}

        {otherAreaDistricts.length ? (
          renderServiceListAccordion(
            sectionText,
            otherAreaDistricts,
          )
        ) : null}
      </div>
    );
  }

  return (
    <div className={`${classes.districtServiceList} ${classes.listLevelFour}`}>
      {
        renderServiceListAccordion(
          sectionText,
          filteredData,
        )
      }
      <Divider aria-hidden className={classes.serviceDivider} />
    </div>
  );
};

DistrictAreaList.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  district: PropTypes.objectOf(PropTypes.any).isRequired,
  selectedAddress: PropTypes.objectOf(PropTypes.any),
};

DistrictAreaList.defaultProps = {
  selectedAddress: null,
};

export default DistrictAreaList;
