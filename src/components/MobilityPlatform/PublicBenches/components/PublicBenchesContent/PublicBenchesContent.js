import PropTypes from 'prop-types';
import React from 'react';
import { Typography } from '@mui/material';

const PublicBenchesContent = ({ classes, intl, item }) => {
  const singleValText = (messageId, value) => (
    <div className={classes.margin}>
      <Typography component="p" variant="body2">
        {intl.formatMessage({ id: messageId }, { value })}
      </Typography>
    </div>
  );

  const publicBenchInfo = (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <Typography variant="subtitle1" component="h3">
          {intl.formatMessage({ id: 'mobilityPlatform.content.publicBench.title' })}
        </Typography>
      </div>
      <div className={classes.textContainer}>
        {singleValText('mobilityPlatform.content.publicBench.condition', item.extra.Kunto)}
        {singleValText('mobilityPlatform.content.publicBench.model', item.extra.Malli)}
      </div>
    </div>
  );

  return (
    <div className={classes.padding}>
      {publicBenchInfo}
    </div>
  );
};

PublicBenchesContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  item: PropTypes.objectOf(PropTypes.any),
};

PublicBenchesContent.defaultProps = {
  item: {},
};

export default PublicBenchesContent;
