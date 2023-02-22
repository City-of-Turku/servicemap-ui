import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel, Typography } from '@material-ui/core';
import { isDataValid } from '../../../../components/MobilityPlatform/utils/utils';
import useLocaleText from '../../../../utils/useLocaleText';
import TrailInfo from '../TrailInfo';

const TrailList = ({
  classes, openList, inputData, itemsToShow, trailsObj, setTrailState,
}) => {
  const renderData = isDataValid(openList, inputData);

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

  const checkContentType = data => data.forEach(item => item.name === 'PaavonPolku');

  const renderName = (item) => {
    if (checkContentType(item.content_types)) {
      return fixRouteName(item.name_fi, item.name_en, item.name_sv);
    } return item.name;
  };

  return (
    renderData
      ? inputData.slice(0, itemsToShow).map(item => (
        <div key={item.id} className={classes.checkBoxItem}>
          <FormControlLabel
            control={(
              <Checkbox
                checked={item.id === trailsObj.id}
                aria-checked={item.id === trailsObj.id}
                className={classes.margin}
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
        </div>
      )) : null);
};

TrailList.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  openList: PropTypes.bool,
  inputData: PropTypes.arrayOf(PropTypes.any),
  itemsToShow: PropTypes.number,
  trailsObj: PropTypes.objectOf(PropTypes.any),
  setTrailState: PropTypes.func.isRequired,
};

TrailList.defaultProps = {
  openList: false,
  inputData: [],
  itemsToShow: 4,
  trailsObj: {},
};

export default TrailList;
