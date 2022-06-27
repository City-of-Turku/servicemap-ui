import React, { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useMap } from 'react-leaflet';
import { Typography, ButtonBase } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import routeUnitIcon from 'servicemap-ui-turku/assets/icons/icons-icon_culture_route.svg';
import MobilityPlatformContext from '../../../../../context/MobilityPlatformContext';
import { selectRouteName } from '../../../utils/utils';

const CultureRouteUnits = ({ classes, cultureRouteUnits }) => {
  const { cultureRouteId } = useContext(MobilityPlatformContext);

  const intl = useIntl();

  const locale = useSelector(state => state.user.locale);
  const map = useMap();

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const customIcon = icon({
    iconUrl: routeUnitIcon,
    iconSize: [45, 45],
  });

  const closePopup = () => {
    if (map) {
      map.closePopup();
    }
  };

  const activeCultureRouteUnits = useMemo(
    () => cultureRouteUnits.filter(item => item.mobile_unit_group.id === cultureRouteId),
    [cultureRouteUnits, cultureRouteId],
  );

  /**
   * Returns description based on locale
   * Renders linebreaks as well
   * If description does not exists, return message
   * @param {string} descriptionFi
   * @param {string} descriptionEn
   * @param {string} descriptionSv
   */
  const renderDescription = (descriptionFi, descriptionEn, descriptionSv) => {
    const obj = { key: undefined, text: '' };
    if (descriptionFi && locale === 'fi') {
      obj.key = 'fi';
      obj.text = descriptionFi;
    } else if (descriptionEn && locale === 'en') {
      obj.key = 'en';
      obj.text = descriptionEn;
    } else if (descriptionSv && locale === 'sv') {
      obj.key = 'sv';
      obj.text = descriptionSv;
    }
    if (obj.key) {
      return obj.text.split('\n\n\n').map(paragraph => (
        <Typography key={Math.random()} variant="body2">
          {paragraph.split('\n').reduce((total, line) => [total, <br key={Math.random()} />, line])}
        </Typography>
      ));
    }
    return (
      <Typography variant="body2">
        {intl.formatMessage({ id: 'mobilityPlatform.content.description.notAvailable' })}
      </Typography>
    );
  };

  /**
   * Default close button is set to false, because it would overlap with the scrollbar
   * It is easier to make a custom close button than to edit the default close button
   */

  return (
    <>
      <div>
        {activeCultureRouteUnits
        && activeCultureRouteUnits.length > 0
        && activeCultureRouteUnits.map(item => (
          <Marker key={item.id} icon={customIcon} position={[item.geometry_coords.lat, item.geometry_coords.lon]}>
            <Popup closeButton={false} maxHeight={400} className="culture-route-unit-popup">
              <div className={classes.popupInner}>
                <div className={classes.header}>
                  <Typography variant="subtitle1">
                    {selectRouteName(locale, item.name, item.name_en, item.name_sv)}
                  </Typography>
                  <ButtonBase onClick={() => closePopup()} className={classes.popupCloseButton}>
                    <Close className={classes.closeIcon} />
                  </ButtonBase>
                </div>
                <div className={classes.content}>
                  {renderDescription(item.description, item.description_en, item.description_sv)}
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
