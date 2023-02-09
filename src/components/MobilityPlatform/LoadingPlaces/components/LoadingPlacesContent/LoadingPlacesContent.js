import PropTypes from 'prop-types';
import React from 'react';
import SingleValueText from '../../../SingleValueText';
import TextComponent from '../../../TextComponent';

const LoadingPlacesContent = ({ classes, item }) => {
  const loadingPlaceName = {
    fi: item.name_fi,
    en: item.name_en,
    sv: item.name_sv,
  };

  const loadingPlaceAddress = {
    fi: item.address_fi,
    en: item.address_en,
    sv: item.address_sv,
  };

  const loadingPlaceInfo = (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <TextComponent textObj={loadingPlaceName} isTitle />
      </div>
      <div className={classes.textContainer}>
        {item.address_fi !== '' ? <SingleValueText messageId="mobilityPlatform.content.address" textObj={loadingPlaceAddress} /> : null}
        <TextComponent textObj={item.extra.lastauspiste} />
        <TextComponent textObj={item.extra.Saavutettavuus} />
        <TextComponent textObj={item.extra.rajoitustyyppi} />
      </div>
    </div>
  );

  return (
    <div className={classes.container}>
      {loadingPlaceInfo}
    </div>
  );
};

LoadingPlacesContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  item: PropTypes.objectOf(PropTypes.any),
};

LoadingPlacesContent.defaultProps = {
  item: {},
};

export default LoadingPlacesContent;
