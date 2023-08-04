import React, { useState } from 'react';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import useLocaleText from '../../../../utils/useLocaleText';
import { isDataValid } from '../../../../components/MobilityPlatform/utils/utils';
import SMButton from '../../../../components/ServiceMapButton';
import Container from '../../../../components/Container';
import RouteLength from '../RouteLength';
import Description from '../Description';

const RouteList = ({
  classes,
  intl,
  openList,
  items,
  itemsPerPage,
  routeAttr,
  type,
  setRouteState,
  locale,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const getLocaleText = useLocaleText();

  const getRouteName = (name, nameEn, nameSv) => getLocaleText({ fi: name, en: nameEn, sv: nameSv });

  const isListValid = isDataValid(openList, items);

  const renderContent = (item) => {
    if (type === 'BicycleRoute') {
      return (
        item.name_fi === routeAttr ? <RouteLength key={item.id} route={item} /> : null
      );
    }
    if (type === 'CultureRoute') {
      return (
        item.id === routeAttr ? <Description key={item.name} route={item} currentLocale={locale} /> : null
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
        <div key={item.id} className={classes.checkBoxItem}>
          <FormControlLabel
            control={(
              <Checkbox
                checked={type === 'BicycleRoute' ? item.name_fi === routeAttr : item.id === routeAttr}
                aria-checked={type === 'BicycleRoute' ? item.name_fi === routeAttr : item.id === routeAttr}
                className={classes.margin}
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
        </div>
      ))
      : null;
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const paginationLinks = [];

    for (let i = 1; i <= totalPages; i += 1) {
      paginationLinks.push(
        <SMButton
          key={i}
          aria-label={intl.formatMessage({ id: 'general.pagination.page.number' }, { number: i })}
          onClick={() => setCurrentPage(i)}
          className={`${classes.button} ${currentPage === i ? classes.active : ''}`}
          variant="contained"
          role="link"
        >
          {i}
        </SMButton>,
      );
    }

    return <Container className={classes.pagination}>{paginationLinks}</Container>;
  };

  return (
    <div>
      <div className={classes.listContainer}>{renderList()}</div>
      {openList ? renderPagination() : null}
    </div>
  );
};

RouteList.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  openList: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.any),
  itemsPerPage: PropTypes.number,
  routeAttr: PropTypes.string,
  type: PropTypes.string,
  setRouteState: PropTypes.func.isRequired,
  locale: PropTypes.string,
};

RouteList.defaultProps = {
  openList: false,
  items: [],
  itemsPerPage: 5,
  routeAttr: '',
  type: '',
  locale: 'fi',
};

export default RouteList;
