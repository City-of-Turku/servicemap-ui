import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const Description = ({ classes, route, currentLocale }) => {
  // Hide references to sizes of audio files.
  // Only finnish and english descriptions have those.
  const replaceWord = inputStr => inputStr.replace(/Latauskoko ~90M|koko ~43M|Size ~6MB/gi, '');

  const selectRouteDescription = (descriptionSv, descriptionEn, descriptionFi) => {
    if (currentLocale === 'sv' && descriptionSv) {
      return descriptionSv;
    }
    if (currentLocale === 'en' && descriptionEn) {
      return replaceWord(descriptionEn);
    }
    return replaceWord(descriptionFi);
  };

  return (
    <div className={classes.descriptionContainer}>
      <div className={classes.paragraph}>
        <Typography
          component="p"
          variant="body2"
          aria-label={selectRouteDescription(route.description_sv, route.description_en, route.description)}
        >
          {selectRouteDescription(route.description_sv, route.description_en, route.description)}
        </Typography>
      </div>
    </div>
  );
};

Description.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  route: PropTypes.objectOf(PropTypes.any),
  currentLocale: PropTypes.string,
};

Description.defaultProps = {
  route: null,
  currentLocale: 'fi',
};

export default Description;
