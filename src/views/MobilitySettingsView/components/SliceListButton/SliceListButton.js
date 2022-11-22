import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from '@material-ui/core';

const SliceListButton = ({
  classes, intl, openList, itemsToShow, showMore, showLess,
}) => (openList ? (
  <div className={classes.container}>
    <Button className={classes.button} onClick={itemsToShow === 4 ? () => showMore() : () => showLess()}>
      {itemsToShow === 4 ? (
        <Typography variant="body2">{intl.formatMessage({ id: 'mobilityPlatform.menu.list.showMore' })}</Typography>
      ) : (
        <Typography variant="body2">{intl.formatMessage({ id: 'mobilityPlatform.menu.list.showLess' })}</Typography>
      )}
    </Button>
  </div>
) : null);

SliceListButton.propTypes = {
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  openList: PropTypes.bool,
  itemsToShow: PropTypes.number,
  showMore: PropTypes.func.isRequired,
  showLess: PropTypes.func.isRequired,
};

SliceListButton.defaultProps = {
  openList: false,
  itemsToShow: 4,
};

export default SliceListButton;
