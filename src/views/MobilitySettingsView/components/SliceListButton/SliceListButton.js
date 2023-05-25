import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from '@mui/material';

/* By default 4 routes/items are shown from the route list. Button and functions control number of routes shown (4 or all routes). */

const SliceListButton = ({
  classes, intl, openList, itemsToShow, routes, setItemsToShow,
}) => {
  const changeItemsToShow = (count = routes.length) => {
    setItemsToShow(count);
  };
  const itemsCountDefault = itemsToShow === 4;

  const buttonConfig = {
    func: itemsCountDefault ? () => changeItemsToShow() : () => changeItemsToShow(4),
    msgId: itemsCountDefault ? 'mobilityPlatform.menu.list.showMore' : 'mobilityPlatform.menu.list.showLess',
  };

  return openList && routes.length >= itemsToShow ? (
    <div className={classes.container}>
      <Button className={classes.button} onClick={() => buttonConfig.func()}>
        <Typography variant="body2" aria-label={intl.formatMessage({ id: buttonConfig.msgId })}>
          {intl.formatMessage({ id: buttonConfig.msgId })}
        </Typography>
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
