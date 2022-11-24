import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from '@material-ui/core';

/* By default 4 routes/items are shown from the route list. Button and functions control number of routes shown (4 or all routes). */

const SliceListButton = ({
  classes, intl, openList, itemsToShow, routes, setItemsToShow,
}) => {
  const showMore = () => {
    setItemsToShow(routes.length);
  };

  const showLess = () => {
    setItemsToShow(4);
  };

  return openList && routes.length >= itemsToShow ? (
    <div className={classes.container}>
      <Button className={classes.button} onClick={itemsToShow === 4 ? () => showMore() : () => showLess()}>
        {itemsToShow === 4 ? (
          <Typography variant="body2" aria-label={intl.formatMessage({ id: 'mobilityPlatform.menu.list.showMore' })}>
            {intl.formatMessage({ id: 'mobilityPlatform.menu.list.showMore' })}
          </Typography>
        ) : (
          <Typography variant="body2" aria-label={intl.formatMessage({ id: 'mobilityPlatform.menu.list.showLess' })}>
            {intl.formatMessage({ id: 'mobilityPlatform.menu.list.showLess' })}
          </Typography>
        )}
      </Button>
    </div>
  ) : null;
};

SliceListButton.propTypes = {
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  openList: PropTypes.bool,
  itemsToShow: PropTypes.number,
  routes: PropTypes.arrayOf(PropTypes.any),
  setItemsToShow: PropTypes.func.isRequired,
};

SliceListButton.defaultProps = {
  openList: false,
  itemsToShow: 4,
  routes: [],
};

export default SliceListButton;
