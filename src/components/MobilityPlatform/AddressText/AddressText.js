import React from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import useLocaleText from '../../../utils/useLocaleText';

const AddressText = ({ classes, intl, addressObj }) => {
  const getLocaleText = useLocaleText();

  const renderAddressText = (messageId, value, props = {}) => (
    <div {...props}>
      <Typography component="p" variant="body2">
        {intl.formatMessage({ id: messageId }, { value })}
      </Typography>
    </div>
  );

  return (
    <>
      {renderAddressText('mobilityPlatform.content.address', getLocaleText(addressObj), { className: classes.margin })}
    </>
  );
};

AddressText.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  addressObj: PropTypes.objectOf(PropTypes.any),
};

AddressText.defaultProps = {
  addressObj: {},
};

export default AddressText;
