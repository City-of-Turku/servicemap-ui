import React from 'react';
import { useIntl } from 'react-intl';
import PopupCloseButton from '../PopupCloseButton';
import PopupEscapeHandler from '../PopupEscapeHandler';
import PopupFocusReturn from '../PopupFocusReturn';
import PopupRegion from '../PopupRegion';

const AccessibleMapPopups = () => {
  const intl = useIntl();

  return (
    <>
      <PopupCloseButton label={intl.formatMessage({ id: 'general.close' })} />
      <PopupEscapeHandler />
      <PopupFocusReturn />
      <PopupRegion />
    </>
  );
};

export default AccessibleMapPopups;
