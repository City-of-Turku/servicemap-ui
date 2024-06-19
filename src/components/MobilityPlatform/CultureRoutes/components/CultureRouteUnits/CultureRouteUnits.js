import { ButtonBase, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import routeUnitIcon from 'servicemap-ui-turku/assets/icons/icons-icon_culture_route.svg';
import routeUnitIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_culture_route-bw.svg';
import { useMobilityPlatformContext } from '../../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../../redux/selectors/settings';
import { selectMapRef } from '../../../../../redux/selectors/general';
import { createIcon } from '../../../utils/utils';
import useLocaleText from '../../../../../utils/useLocaleText';

const CultureRouteUnits = ({ cultureRouteUnits }) => {
  const { cultureRouteId } = useMobilityPlatformContext();

  const intl = useIntl();

  const locale = useSelector(state => state.user.locale);
  const getLocaleText = useLocaleText();

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const map = useSelector(selectMapRef);
  const useContrast = useSelector(useAccessibleMap);

  const customIcon = icon(createIcon(useContrast ? routeUnitIconBw : routeUnitIcon));

  const closePopup = () => {
    if (map) {
      map.closePopup();
    }
  };

  const filterRouteUnits = data => {
    if (data && data.length > 0) {
      return data.filter(item => item.mobile_unit_group.id === cultureRouteId);
    }
    return [];
  };

  const activeCultureRouteUnits = filterRouteUnits(cultureRouteUnits);

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

  return (activeCultureRouteUnits
          && activeCultureRouteUnits.length > 0 ? (
      activeCultureRouteUnits.map(item => (
        <Marker key={item.id} icon={customIcon} position={[item.geometry_coords.lat, item.geometry_coords.lon]}>
          <Popup closeButton={false} maxHeight={400} className="culture-route-unit-popup">
            <StyledContent>
              <StyledHeader>
                <Typography variant="subtitle1" component="h3">
                  {getRouteUnitName(item.name, item.name_en, item.name_sv)}
                </Typography>
                <StyledButton onClick={() => closePopup()}>
                  <StyledCloseIcon />
                </StyledButton>
              </StyledHeader>
              <div>
                {renderDescription(
                  item.description,
                  item.description_en,
                  item.description_sv,
                )}
              </div>
            </StyledContent>
          </Popup>
        </Marker>
      ))
    ) : null
  );
};

const StyledContent = styled.div(({ theme }) => ({
  padding: theme.spacing(1.5),
}));

const StyledHeader = styled.div(({ theme }) => ({
  width: '98%',
  marginBottom: theme.spacing(1),
  borderBottom: '1px solid rgba(0, 0, 0, 255)',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const StyledButton = styled(ButtonBase)(({ theme }) => ({
  padding: theme.spacing(1),
  '&:hover': {
    cursor: 'pointer',
    borderRadius: '5px',
    border: '1px solid rgba(0, 0, 0, 255)',
  },
}));

const StyledCloseIcon = styled(Close)(() => ({
  fontSize: '1.25rem',
  width: '1.25rem',
  height: '1.25rem',
  lineHeight: '1.4rem',
}));

CultureRouteUnits.propTypes = {
  cultureRouteUnits: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name_fi: PropTypes.string,
    name_en: PropTypes.string,
    name_sv: PropTypes.string,
    description: PropTypes.string,
    description_en: PropTypes.string,
    description_sv: PropTypes.string,
    geometry_coords: PropTypes.objectOf(PropTypes.number),
  })),
};

CultureRouteUnits.defaultProps = {
  cultureRouteUnits: [],
};

export default CultureRouteUnits;
