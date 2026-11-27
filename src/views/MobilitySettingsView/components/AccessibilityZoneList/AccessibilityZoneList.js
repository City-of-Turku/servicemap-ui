import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import {
  FormControlLabel, Checkbox, TextField, Typography,
} from '@mui/material';
import { isDataValid } from '../../../../components/MobilityPlatform/utils/utils';
import { getAccessibilityZoneLineStyle } from '../../../../components/MobilityPlatform/AccessibilityZones/utils/utils';
import { useAccessibleMap } from '../../../../redux/selectors/settings';
import { StyledCheckboxItem } from '../styled/styled';
import Pagination from '../Pagination';

/**
 * List of sites (bus stops, schools and kindergartens) whose accessibility zones can be shown on the map.
 * There are over a thousand bus stops, so the list can be filtered by name.
 */
const AccessibilityZoneList = ({
  openList, itemsPerPage, items, selections, setState,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const intl = useIntl();
  const useContrast = useSelector(useAccessibleMap);

  const isListValid = isDataValid(openList, items);

  const normalizedSearchText = searchText.trim().toLowerCase();
  const filteredItems = normalizedSearchText
    ? items.filter(item => item.name.toLowerCase().includes(normalizedSearchText))
    : items;

  const handleSearchChange = event => {
    setSearchText(event.target.value);
    setCurrentPage(1);
  };

  const isSelected = id => selections.some(item => item.id === id);

  // Legend explains the line of each travel time on the map. On the contrast map the lines are white,
  // so the legend uses the text color with the same line widths and dash pattern.
  // Item ids contain the site name, and ids with spaces would not work in aria-labelledby.
  const getLegendId = item => `${item.id.replace(/\s+/g, '_')}-legend`;

  const renderLegend = item => (
    <StyledLegend>
      <Typography component="p" variant="body2" id={getLegendId(item)}>
        {intl.formatMessage({ id: 'mobilityPlatform.menu.accessibilityZones.legend' })}
      </Typography>
      <StyledLegendList aria-labelledby={getLegendId(item)}>
        {item.minutes.map((minutes, ringIndex) => {
          const { color, weight, dashArray } = getAccessibilityZoneLineStyle(ringIndex, item.transport, useContrast);
          return (
            <StyledLegendItem key={minutes}>
              <svg aria-hidden="true" width="40" height="10" viewBox="0 0 40 10">
                <line
                  x1="0"
                  y1="5"
                  x2="40"
                  y2="5"
                  stroke={useContrast ? 'currentColor' : color}
                  strokeWidth={weight}
                  strokeDasharray={dashArray ?? undefined}
                />
              </svg>
              <Typography component="span" variant="body2">
                {intl.formatMessage({ id: 'mobilityPlatform.menu.accessibilityZones.minutes' }, { value: minutes })}
              </Typography>
            </StyledLegendItem>
          );
        })}
      </StyledLegendList>
    </StyledLegend>
  );

  const renderList = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    return paginatedItems.map(item => (
      <StyledCheckboxItem key={item.id}>
        <FormControlLabel
          control={(
            <Checkbox
              checked={isSelected(item.id)}
              aria-checked={isSelected(item.id)}
              onChange={() => setState(item)}
            />
          )}
          label={(
            <Typography variant="body2" aria-label={item.name}>
              {item.name}
            </Typography>
          )}
        />
        {isSelected(item.id) ? renderLegend(item) : null}
      </StyledCheckboxItem>
    ));
  };

  if (!isListValid) {
    return null;
  }

  return (
    <div>
      <StyledSearch>
        <TextField
          fullWidth
          size="small"
          type="search"
          label={intl.formatMessage({ id: 'mobilityPlatform.menu.accessibilityZones.search' })}
          value={searchText}
          onChange={handleSearchChange}
        />
      </StyledSearch>
      {filteredItems.length ? (
        <>
          <div>{renderList()}</div>
          <Pagination
            items={filteredItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      ) : (
        <StyledNoResults role="status">
          <Typography component="p" variant="body2">
            {intl.formatMessage({ id: 'mobilityPlatform.menu.accessibilityZones.noResults' })}
          </Typography>
        </StyledNoResults>
      )}
    </div>
  );
};

const StyledSearch = styled.div(({ theme }) => ({
  padding: theme.spacing(1, 2),
}));

const StyledNoResults = styled.div(({ theme }) => ({
  textAlign: 'left',
  padding: theme.spacing(0, 2, 1.5, 2),
}));

const StyledLegend = styled.div(({ theme }) => ({
  textAlign: 'left',
  paddingBottom: theme.spacing(1.5),
  marginLeft: theme.spacing(4),
}));

const StyledLegendList = styled.ul(({ theme }) => ({
  listStyle: 'none',
  margin: 0,
  padding: theme.spacing(0.5, 0, 0, 0),
}));

const StyledLegendItem = styled.li(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

AccessibilityZoneList.propTypes = {
  openList: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    transport: PropTypes.string,
    minutes: PropTypes.arrayOf(PropTypes.number),
  })),
  itemsPerPage: PropTypes.number,
  selections: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
  })),
  setState: PropTypes.func.isRequired,
};

AccessibilityZoneList.defaultProps = {
  openList: false,
  items: [],
  itemsPerPage: 10,
  selections: [],
};

export default AccessibilityZoneList;
