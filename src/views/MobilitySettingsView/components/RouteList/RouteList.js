import React, { useState } from 'react';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import useLocaleText from '../../../../utils/useLocaleText';
import { isDataValid } from '../../../../components/MobilityPlatform/utils/utils';
import { StyledCheckboxItem } from '../styled/styled';
import RouteLength from '../RouteLength';
import Description from '../Description';
import Pagination from '../Pagination';

const RouteList = ({
  openList,
  items,
  itemsPerPage,
  routeAttr,
  type,
  setRouteState,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const getLocaleText = useLocaleText();

  const getRouteName = (name, nameEn, nameSv) => getLocaleText({ fi: name, en: nameEn, sv: nameSv });

  const isListValid = isDataValid(openList, items);

  const renderContent = item => {
    if (type === 'BicycleRoute') {
      return (
        item.name_fi === routeAttr ? <RouteLength key={item.id} route={item} /> : null
      );
    }
    if (type === 'CultureRoute') {
      return (
        item.id === routeAttr ? <Description key={item.name} route={item} /> : null
      );
    }
    return null;
  };

  const renderList = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = items.slice(startIndex, endIndex);

    return isListValid
      ? paginatedItems.map(item => (
        <StyledCheckboxItem key={item.id}>
          <FormControlLabel
            control={(
              <Checkbox
                checked={type === 'BicycleRoute' ? item.name_fi === routeAttr : item.id === routeAttr}
                aria-checked={type === 'BicycleRoute' ? item.name_fi === routeAttr : item.id === routeAttr}
                onChange={() => setRouteState(type === 'BicycleRoute' ? item.name_fi : item.id)}
              />
          )}
            label={(
              <Typography variant="body2" aria-label={getRouteName(item.name_fi, item.name_en, item.name_sv)}>
                {getRouteName(item.name_fi, item.name_en, item.name_sv)}
              </Typography>
          )}
          />
          {renderContent(item)}
        </StyledCheckboxItem>
      ))
      : null;
  };

  return (
    <div>
      <div>{renderList()}</div>
      {openList ? (
        <Pagination
          items={items}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      ) : null}
    </div>
  );
};

RouteList.propTypes = {
  openList: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })),
  itemsPerPage: PropTypes.number,
  routeAttr: PropTypes.string,
  type: PropTypes.string,
  setRouteState: PropTypes.func.isRequired,
};

RouteList.defaultProps = {
  openList: false,
  items: [],
  itemsPerPage: 5,
  routeAttr: '',
  type: '',
};

export default RouteList;
