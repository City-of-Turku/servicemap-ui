import { visuallyHidden } from '@mui/utils';
import React from 'react';
import { useIntl } from 'react-intl';

// Visual cue that a link opens in a new tab. The symbol is hidden from
// assistive tech; the translated phrase is what screen readers announce.
const NewTabIndicator = () => {
  const intl = useIntl();

  return (
    <>
      <span aria-hidden="true">{'\u00A0⧉'}</span>
      <span style={visuallyHidden}>
        {` (${intl.formatMessage({ id: 'general.new.tab' })})`}
      </span>
    </>
  );
};

export default NewTabIndicator;
