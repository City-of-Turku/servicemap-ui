import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import config from '../../../../config';
import logoENContrast from '../../../assets/images/Logo-ENG-Contrast.svg';
import logoEN from '../../../assets/images/Logo-ENG.svg';
import logoSVContrast from '../../../assets/images/Logo-SWE-Contrast.svg';
import logoSV from '../../../assets/images/Logo-SWE.svg';
import logoContrastDev from '../../../assets/images/service-map-logo-contrast-dev.svg';
import logoContrast from '../../../assets/images/service-map-logo-contrast.svg';
import logoNormalDev from '../../../assets/images/service-map-logo-fi-dev.svg';
import logoNormal from '../../../assets/images/service-map-logo-fi.svg';
import { useUserLocale } from '../../../utils/user';
import styles from './styles';

const HomeLogo = React.forwardRef((props, ref) => {
  const {
    contrast, classes, ...rest
  } = props;
  const locale = useUserLocale();

  const getLogo = (production = false, contrast = false) => {
    if (production) {
      let logo = null;

      switch (locale) {
        case 'en':
          logo = contrast ? logoENContrast : logoEN;
          break;
        case 'sv':
          logo = contrast ? logoSVContrast : logoSV;
          break;
        case 'fi':
        default:
          logo = contrast ? logoContrast : logoNormal;
      }

      return logo;
    }
    return contrast ? logoContrastDev : logoNormalDev;
  };

  const logo = getLogo(config.production, contrast);

  return (
    <div ref={ref} role="img" {...rest}>
      <img src={logo} alt="" className={classes.icon} />
    </div>
  );
});


HomeLogo.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  contrast: PropTypes.bool,
};

HomeLogo.defaultProps = {
  contrast: false,
};

export default withStyles(styles)(HomeLogo);
