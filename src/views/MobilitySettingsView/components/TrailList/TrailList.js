import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormControlLabel, Checkbox, Typography } from '@mui/material';
import useLocaleText from '../../../../utils/useLocaleText';
import { isDataValid } from '../../../../components/MobilityPlatform/utils/utils';
import { StyledCheckboxItem } from '../styled/styled';
import TrailInfo from '../TrailInfo';
import Pagination from '../Pagination';

const TrailList = ({
  openList, itemsPerPage, items, trailsObj, setTrailState,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const isListValid = isDataValid(openList, items);

  const getLocaleText = useLocaleText();

  const fixRouteName = (routeNameFi, routeNameEn, routeNameSv) => {
    const routes = {
      fi: routeNameFi,
      en: routeNameEn,
      sv: routeNameSv,
    };
    const route = getLocaleText(routes);
    const split = route.split(': ');
    return split.slice(-1);
  };

  const renderName = item => {
    if (item.content_types[0].type_name === 'PaavonPolku') {
      return fixRouteName(item.name_fi, item.name_en, item.name_sv);
    }
    return item.name;
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
                checked={item.id === trailsObj.id}
                aria-checked={item.id === trailsObj.id}
                onChange={() => setTrailState(item)}
              />
              )}
            label={(
              <Typography variant="body2" aria-label={renderName(item)}>
                {renderName(item)}
              </Typography>
              )}
          />
          {item.id === trailsObj.id ? <TrailInfo item={item} /> : null}
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

TrailList.propTypes = {
  openList: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
  })),
  itemsPerPage: PropTypes.number,
  trailsObj: PropTypes.shape({
    id: PropTypes.string,
  }),
  setTrailState: PropTypes.func.isRequired,
};

TrailList.defaultProps = {
  openList: false,
  items: [],
  itemsPerPage: 5,
  trailsObj: {},
};

export default TrailList;
