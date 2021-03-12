import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import config from '../../../config';
import { getIcon } from '../SMIcon';
import isClient from '../../utils';

const SettingsText = ({ classes, type, variant }) => {
  if (!isClient()) {
    return null;
  }
  let settings;
  let icon;
  const citySettings = useSelector((state) => {
    const cities = state.settings.cities;
    return config.cities.filter(c => cities[c]);
  });
  const a11ySettings = useSelector((state) => {
    return ['colorblind', 'hearingAid', 'visuallyImpaired'].filter(a => state.settings[a])
  });
  const map = useSelector(state => state.settings.mapType);
  const mobility = useSelector(state => state.settings.mobility);
  // Attempt to get 
  try {
    switch(type) {
      case 'citySettings':
        if (citySettings.length) {
          settings = citySettings.map(c => ({ id: `settings.city.${c}` }));
          break;
        }
        settings = [{ id: 'settings.city.all' }];
        break;
      case 'mapSettings':
        if (!map) break;
        icon = getIcon(map, { className: classes.smallIcon });
        settings = [{ id: `settings.map.${map}`, icon }];
        break;
      case 'accessibilitySettings':
        if (!a11ySettings.length && !mobility) {
          settings = ['settings.accessibility.none'];
          break;
        }
        settings = a11ySettings.map(a => ({ id: `settings.sense.${a}` }));
        if (mobility) {
          settings.push({ id: `settings.mobility.${mobility}` });
        }
        break;
      default:
    }
  } catch (e) {
    console.error(e);

  }

  if (!settings) {
    return null;
  }

  let title;
  let text;
  switch (variant) {
    case 'small':
      title = classes.titleSmall;
      text = classes.textSmall;
      break;
    default:
      title = classes.title;
      text = classes.text; 
  };

  return (
    <>
      <Typography
        className={title}
        component="p"
        variant="subtitle1"
      >
        <FormattedMessage id={`settings.${type}`} />
      </Typography>
      <Typography component="p" className={text}>
        {settings.map((s, i) => (
          <React.Fragment key={s.id}>
            {s.icon}
            <FormattedMessage id={s.id} />
            {i + 1 !== settings.length && ', '}
          </React.Fragment>
        ))}
      </Typography>
    </>
  );
};

SettingsText.propTypes = {
  classes: PropTypes.shape({
    title: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
  type: PropTypes.oneOf(['citySettings', 'mapSettings', 'accessibilitySettings']).isRequired,
  variant: PropTypes.oneOf(['small', 'default']),
};

SettingsText.defaultProps = {
  variant: 'default',
};

export default SettingsText;
