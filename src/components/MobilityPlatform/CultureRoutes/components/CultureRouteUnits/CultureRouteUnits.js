import { ButtonBase, Typography } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import routeUnitIcon from 'servicemap-ui-turku/assets/icons/icons-icon_culture_route.svg';
import routeUnitIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_culture_route-bw.svg';
import MobilityPlatformContext from '../../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../../redux/selectors/settings';
import { createIcon } from '../../../utils/utils';
import useLocaleText from '../../../../../utils/useLocaleText';

const CultureRouteUnits = ({ classes, cultureRouteUnits }) => {
  const { cultureRouteId } = useContext(MobilityPlatformContext);

  const intl = useIntl();

  const locale = useSelector(state => state.user.locale);
  const getLocaleText = useLocaleText();
  const map = useMap();

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);

  const customIcon = icon(createIcon(useContrast ? routeUnitIconBw : routeUnitIcon));

  const closePopup = () => {
    if (map) {
      map.closePopup();
    }
  };

  const activeCultureRouteUnits = cultureRouteUnits.filter(item => item.mobile_unit_group.id === cultureRouteId);

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

  const getRouteUnitName = (name, nameEn, nameSv) => {
    const routeUnitName = {
      fi: name,
      en: nameEn,
      sv: nameSv,
    };
    return getLocaleText(routeUnitName);
  };

  /**
   * Default close button is set to false, because it would overlap with the scrollbar
   * It is easier to make a custom close button than to edit the default close button
   */

  return (
    <>
      {activeCultureRouteUnits
          && activeCultureRouteUnits.length > 0 ? (
          activeCultureRouteUnits.map(item => (
            <Marker key={item.id} icon={customIcon} position={[item.geometry_coords.lat, item.geometry_coords.lon]}>
              <Popup closeButton={false} maxHeight={400} className="culture-route-unit-popup">
                <div className={classes.popupInner}>
                  <div className={classes.header}>
                    <Typography variant="subtitle1">
                      {getRouteUnitName(item.name, item.name_en, item.name_sv)}
                    </Typography>
                    <ButtonBase onClick={() => closePopup()} className={classes.popupCloseButton}>
                      <Close className={classes.closeIcon} />
                    </ButtonBase>
                  </div>
                  <div className={classes.content}>
                    {renderDescription(
                      item.description,
                      item.description_en,
                      item.description_sv,
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))
        ) : null}
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
