import React from 'react';
import { Checkbox, FormControlLabel, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import useLocaleText from '../../../../utils/useLocaleText';

const RouteListItem = ({
  classes,
  item,
  routeAttr,
  type,
  setRouteState,
  children,
}) => {
  const getLocaleText = useLocaleText();

  const getRouteName = (name, nameEn, nameSv) => {
    const routeName = {
      fi: name,
      en: nameEn,
      sv: nameSv,
    };
    return getLocaleText(routeName);
  };

  return (
    <div key={item.id} className={classes.checkBoxItem}>
      <FormControlLabel
        control={(
          <Checkbox
            checked={type === 'CultureRoute' ? item.id === routeAttr : item.name_fi === routeAttr}
            aria-checked={type === 'CultureRoute' ? item.id === routeAttr : item.name_fi === routeAttr}
            className={classes.margin}
            onChange={() => setRouteState(type === 'CultureRoute' ? item.id : item.name_fi)}
          />
          )}
        label={(
          <Typography variant="body2" aria-label={getRouteName(item.name_fi, item.name_en, item.name_sv)}>
            {getRouteName(item.name_fi, item.name_en, item.name_sv)}
          </Typography>
          )}
      />
      {children}
    </div>
  );
};

RouteListItem.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  item: PropTypes.objectOf(PropTypes.any),
  routeAttr: PropTypes.string,
  type: PropTypes.string,
  setRouteState: PropTypes.func.isRequired,
  children: PropTypes.node,
};

RouteListItem.defaultProps = {
  item: {},
  routeAttr: '',
  type: '',
  children: null,
};

export default RouteListItem;
