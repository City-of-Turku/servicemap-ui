import { Divider, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import isClient from '../../utils';

const DescriptionExtraText = ({
  classes, intl, extra, serviceName, html, title, titleComponent,
}) => {
  // Hide linebreak html elements from screen readers
  const hideBRFromSR = text => text.replaceAll('<br>', '<br aria-hidden="true" />');

  const [chargers, setChargers] = useState(null);

  useEffect(() => {
    if (extra.chargers) {
      setChargers(extra.chargers);
    }
  }, [extra]);

  const chargerStationInfo = (
    <>
      <Typography variant="subtitle2" component="h5" className={classes.paragraph}>
        {intl.formatMessage({
          id: 'services.description.extra.cgsTitle',
        })}
        :
      </Typography>
      {chargers?.map(charger => (
        <div key={`${charger.plug}${charger.power}${charger.number}`} className={classes.paragraph}>
          <Typography className={classes.textItem} variant="body2">
            {intl.formatMessage({ id: 'mobilityPlatform.content.cgsType' }, { value: charger.plug })}
          </Typography>
          <Typography className={classes.textItem} variant="body2">
            {intl.formatMessage({ id: 'mobilityPlatform.content.count' }, { value: charger.number })}
          </Typography>
          <Typography className={classes.textItem} variant="body2">
            {intl.formatMessage({ id: 'mobilityPlatform.content.power' }, { value: charger.power })}
          </Typography>
        </div>
      ))}
    </>
  );

  const gasFillingInfo = (
    <>
      <Typography variant="subtitle2" component="h5" className={classes.paragraph}>
        {intl.formatMessage({
          id: 'services.description.extra.gfsTitle',
        })}
      </Typography>
      <div className={classes.paragraph}>
        <Typography className={classes.textItem} variant="body2">
          {intl.formatMessage({ id: 'mobilityPlatform.content.gfsType' }, { value: extra.lng_cng })}
        </Typography>
        <Typography className={classes.textItem} variant="body2">
          {intl.formatMessage({ id: 'mobilityPlatform.content.operator' }, { value: extra.operator })}
        </Typography>
      </div>
    </>
  );

  const bicycleStandInfo = (
    <>
      <Typography variant="subtitle2" component="h5" className={classes.paragraph}>
        {intl.formatMessage({
          id: 'services.description.extra.bisTitle',
        })}
      </Typography>
      <div className={classes.paragraph}>
        {extra.model ? (
          <Typography variant="body2" className={classes.textItem}>
            <strong>
              {intl.formatMessage({
                id: 'mobilityPlatform.content.bicycleStands.model',
              })}
              :
            </strong>
            {' '}
            {extra.model}
          </Typography>
        ) : null}
        <Typography variant="body2" className={classes.textItem}>
          <strong>
            {intl.formatMessage({
              id: 'mobilityPlatform.content.bicycleStands.numOfPlaces',
            })}
            :
          </strong>
          {' '}
          {extra.number_of_places}
        </Typography>
        <Typography variant="body2" className={classes.textItem}>
          <strong>
            {intl.formatMessage({
              id: 'mobilityPlatform.content.bicycleStands.numOfStands',
            })}
            :
          </strong>
          {' '}
          {extra.number_of_stands}
        </Typography>
        {extra.hull_lockable ? (
          <Typography variant="body2" className={classes.textItem}>
            {intl.formatMessage({
              id: 'mobilityPlatform.content.bicycleStands.hullLockable',
            })}
          </Typography>
        ) : (
          <Typography variant="body2" className={classes.textItem}>
            {intl.formatMessage({
              id: 'mobilityPlatform.content.bicycleStands.hullNotLockable',
            })}
          </Typography>
        )}
        {extra.covered ? (
          <Typography variant="body2" className={classes.textItem}>
            {intl.formatMessage({
              id: 'mobilityPlatform.content.bicycleStands.covered',
            })}
          </Typography>
        ) : (
          <Typography variant="body2" className={classes.textItem}>
            {intl.formatMessage({
              id: 'mobilityPlatform.content.bicycleStands.notCovered',
            })}
          </Typography>
        )}
        {extra.maintained_by_turku ? (
          <Typography variant="body2" className={classes.textItem}>
            {intl.formatMessage({
              id: 'mobilityPlatform.content.bicycleStands.maintainedByTku',
            })}
          </Typography>
        ) : null}
      </div>
    </>
  );

  if (extra && isClient()) {
    return (
      <div className={classes.left}>
        <Typography
          className={classes.subtitle}
          component={titleComponent}
          variant="subtitle1"
        >
          {title}
        </Typography>
        <Divider className={classes.divider} aria-hidden="true" />
        { !html ? (
          <>
            {serviceName === 'Kaasutankkausasema' ? gasFillingInfo : null}
            {serviceName === 'Autojen sähkölatauspiste' ? chargerStationInfo : null}
            {serviceName === 'Pyöräpysäköinti' ? bicycleStandInfo : null}
          </>
        ) : (
          <Typography dangerouslySetInnerHTML={{ __html: hideBRFromSR(extra) }} className={classes.paragraph} variant="body2" />
        )}
      </div>
    );
  } return null;
};

DescriptionExtraText.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  extra: PropTypes.objectOf(PropTypes.any).isRequired,
  serviceName: PropTypes.string,
  title: PropTypes.node.isRequired,
  html: PropTypes.bool,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).isRequired,
};

DescriptionExtraText.defaultProps = {
  serviceName: null,
  html: false,
};

export default DescriptionExtraText;
