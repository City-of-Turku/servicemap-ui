import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import routeUnitIcon from 'servicemap-ui-turku/assets/icons/icons-icon_culture_route.svg';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { selectRouteName } from '../utils/utils';

const CultureRouteUnits = ({ classes, cultureRouteUnits }) => {
  const { cultureRouteId } = useContext(MobilityPlatformContext);

  const locale = useSelector(state => state.user.locale);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const customIcon = icon({
    iconUrl: routeUnitIcon,
    iconSize: [45, 45],
  });

  const activeCultureRouteUnits = cultureRouteUnits.filter(item => item.mobile_unit_group.id === cultureRouteId);

  return (
    <>
      <div>
        {activeCultureRouteUnits && activeCultureRouteUnits.length > 0
          && activeCultureRouteUnits.map(item => (
            <Marker key={item.id} icon={customIcon} position={[item.geometry_coords.lat, item.geometry_coords.lon]}>
              <Popup>
                <div className={classes.popupInner}>
                  <div className={classes.subtitle}>
                    <Typography variant="body2">
                      {selectRouteName(locale, item.name, item.name_en, item.name_sv)}
                    </Typography>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </div>
    </>
  );
};

CultureRouteUnits.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  cultureRouteUnits: PropTypes.arrayOf(PropTypes.any),
};

CultureRouteUnits.defaultProps = {
  cultureRouteUnits: [],
};

export default CultureRouteUnits;
