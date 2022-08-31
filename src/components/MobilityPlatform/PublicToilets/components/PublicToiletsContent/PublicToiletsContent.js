import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

const PublicToiletsContent = ({ classes, intl }) => {
  const titleTypo = (messageId, props = {}) => (
    <div {...props}>
      <Typography variant="subtitle1">
        {intl.formatMessage({
          id: messageId,
        })}
      </Typography>
    </div>
  );

  const singleValTypo = (messageId, isSubtitle, props = {}) => (
    <div {...props}>
      <Typography variant={isSubtitle ? 'subtitle2' : 'body2'}>
        {intl.formatMessage({
          id: messageId,
        })}
      </Typography>
    </div>
  );

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        {titleTypo('mobilityPlatform.content.publicToilets.title')}
      </div>
      <div className={classes.textContainer}>
        {singleValTypo('mobilityPlatform.content.publicToilets.openNormalTitle', true)}
        {singleValTypo('mobilityPlatform.content.publicToilets.openNormalDate')}
        {singleValTypo('mobilityPlatform.content.publicToilets.openNormal')}
        {singleValTypo('mobilityPlatform.content.publicToilets.openSummerTitle', true, { className: classes.marginTop })}
        {singleValTypo('mobilityPlatform.content.publicToilets.openSummerDate')}
        {singleValTypo('mobilityPlatform.content.publicToilets.openSummer')}
      </div>
    </div>
  );
};

PublicToiletsContent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default PublicToiletsContent;
