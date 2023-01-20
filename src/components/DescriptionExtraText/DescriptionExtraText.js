import { Divider, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import isClient from '../../utils';

const DescriptionExtraText = ({
  extra, chargers, serviceId, html, classes, title, titleComponent, intl,
}) => {
  // Hide linebreak html elements from screen readers
  const hideBRFromSR = text => text.replaceAll('<br>', '<br aria-hidden="true" />');

  const chargerStationInfo = (
    <>
      <Typography variant="subtitle1" className={classes.paragraph}>
        {intl.formatMessage({
          id: 'services.description.extra.cgsTitle',
        })}
        :
      </Typography>
      {chargers.map(charger => (
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
      <Typography variant="subtitle1" className={classes.paragraph}>
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
      <Typography variant="subtitle1" className={classes.paragraph}>
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
            {serviceId === 20000 ? gasFillingInfo : null}
            {serviceId === 30000 ? chargerStationInfo : null}
            {serviceId === 40000 ? bicycleStandInfo : null}
          </>
        ) : (
          <Typography dangerouslySetInnerHTML={{ __html: hideBRFromSR(extra) }} className={classes.paragraph} variant="body2" />
        )}
      </div>
    );
  } return null;
};

DescriptionExtraText.propTypes = {
  extra: PropTypes.objectOf(PropTypes.any).isRequired,
  chargers: PropTypes.arrayOf(PropTypes.any),
  title: PropTypes.node.isRequired,
  serviceId: PropTypes.number,
  html: PropTypes.bool,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

DescriptionExtraText.defaultProps = {
  html: false,
  chargers: [],
  serviceId: 0,
};

export default DescriptionExtraText;
