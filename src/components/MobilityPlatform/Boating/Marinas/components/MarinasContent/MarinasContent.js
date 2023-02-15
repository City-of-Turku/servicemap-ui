import { Link, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const MarinasContent = ({
  classes, intl, berthItem,
}) => {
  const renderText = (translationId, value) => (
    <Typography variant="body2" className={classes.margin}>
      {intl.formatMessage({ id: translationId })}
      :
      {' '}
      {value}
    </Typography>
  );

  const renderTypePrice = (price, berthType) => {
    const alvTax = 1.24;
    const fullPrice = price * alvTax;
    return (
      <>
        <Typography variant="body2" className={classes.margin}>
          <strong>
            {intl.formatMessage({ id: 'mobilityPlatform.content.marinas.typeTitle' })}
          </strong>
        </Typography>
        {renderText('mobilityPlatform.content.marinas.type', berthType)}
        <Typography variant="body2" className={classes.margin}>
          {intl.formatMessage({ id: 'mobilityPlatform.content.marinas.price' })}
          :
          {' '}
          {Math.round(fullPrice)}
          {' '}
          €
        </Typography>
      </>
    );
  };

  const countBerths = (berthsData) => {
    let count = 0;
    berthsData.forEach((item) => {
      if (item.Varaustyyppi === 'Venepaikat' || item.Varaustyyppi === 'Soutuvenepaikka') {
        count += 1;
      }
    });
    return (
      renderText('mobilityPlatform.content.marinas.berthsCount', count)
    );
  };

  const countWinterStorage = (berthsData) => {
    let count = 0;
    berthsData.forEach((item) => {
      if (item.Varaustyyppi === 'Soutuveneiden talvisäilytyspaikat' || item.Varaustyyppi === 'Talvisäilytyspaikat') {
        count += 1;
      }
    });
    return (
      renderText('mobilityPlatform.content.marinas.winterStorage', count)
    );
  };

  const renderLink = (linkUrl, translationId) => (
    <Link target="_blank" href={linkUrl}>
      <Typography className={classes.link} variant="body2">
        {intl.formatMessage({
          id: translationId,
        })}
      </Typography>
    </Link>
  );

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <Typography variant="subtitle1">
          {berthItem.name}
        </Typography>
      </div>
      <div className={classes.textContainer}>
        {countBerths(berthItem.extra.berths)}
        {berthItem.name === 'Satama: Lauttaranta' ? countWinterStorage(berthItem.extra.berths) : null}
        {renderTypePrice(berthItem.extra.berths[0].HintaAlv0, berthItem.extra.berths[0].Kohdetyyppi)}
        <Typography variant="body2" className={classes.margin}>
          {intl.formatMessage({ id: 'mobilityPlatform.content.marinas.reservationInfo' })}
        </Typography>
        {renderLink('https://opaskartta.turku.fi/ePermit/fi/Reservation/', 'mobilityPlatform.info.marinas.link')}
        {renderLink('https://www.turku.fi/venepaikat', 'mobilityPlatform.content.marinas.infoLink')}
      </div>
    </div>
  );
};

MarinasContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  berthItem: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default MarinasContent;
