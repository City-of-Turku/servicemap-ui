import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import styled from '@emotion/styled';
import { format, isValid } from 'date-fns';
import { enGB, fi, sv } from 'date-fns/locale';
import { ButtonBase, Dialog, DialogTitle, IconButton } from '@mui/material';
import { CalendarMonth, Close } from '@mui/icons-material';
import { unstable_useId as useId, visuallyHidden } from '@mui/utils';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { enUS, fiFI, svSE } from '@mui/x-date-pickers/locales';

const getLocaleText = (pickerLocale) =>
  pickerLocale.components.MuiLocalizationProvider.defaultProps.localeText;

// Station data can be missing dates, which would otherwise end up as Invalid Date
const validDateOrUndefined = (date) =>
  date && isValid(date) ? date : undefined;

// Standalone weekday names for the column headers, e.g. 'maanantai' instead of 'maanantaina'
const dateFormats = { weekday: 'cccc' };

const locales = {
  fi: { dateFns: fi, localeText: getLocaleText(fiFI) },
  sv: { dateFns: sv, localeText: getLocaleText(svSE) },
  en: { dateFns: enGB, localeText: getLocaleText(enUS) },
};

const DatePickerDialog = ({
  value,
  onChange,
  minDate,
  maxDate,
  buttonLabel,
  dialogTitle,
  showYearSelection,
}) => {
  const intl = useIntl();
  const { dateFns, localeText } = locales[intl.locale] || locales.fi;
  const [open, setOpen] = useState(false);
  const openButtonRef = useRef(null);
  const titleId = useId();
  const selectedDate = validDateOrUndefined(value);

  const closeDialog = () => setOpen(false);

  // Ignore partial (year) selections
  const handleCalendarChange = (newDate, selectionState) => {
    if (selectionState !== 'finish' || !newDate) {
      return;
    }
    onChange(newDate);
    closeDialog();
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={dateFns}
      localeText={localeText}
      dateFormats={dateFormats}
    >
      <StyledOpenButton
        ref={openButtonRef}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <CalendarMonth />
        <span style={visuallyHidden}>{`${buttonLabel} `}</span>
        <span>
          {selectedDate ? format(selectedDate, 'P', { locale: dateFns }) : ''}
        </span>
      </StyledOpenButton>
      <StyledDialog
        open={open}
        onClose={closeDialog}
        aria-labelledby={titleId}
        // Restore focus manually without scrolling, which would shift the map
        disableRestoreFocus
        TransitionProps={{
          onExited: () => openButtonRef.current?.focus({ preventScroll: true }),
        }}
      >
        <StyledDialogHeader>
          <StyledDialogTitle id={titleId}>{dialogTitle}</StyledDialogTitle>
          <IconButton
            aria-label={intl.formatMessage({ id: 'general.close' })}
            onClick={closeDialog}
          >
            <Close />
          </IconButton>
        </StyledDialogHeader>
        <DateCalendar
          autoFocus
          value={selectedDate ?? null}
          onChange={handleCalendarChange}
          minDate={validDateOrUndefined(minDate)}
          maxDate={validDateOrUndefined(maxDate)}
          views={showYearSelection ? ['year', 'day'] : ['day']}
          openTo="day"
        />
      </StyledDialog>
    </LocalizationProvider>
  );
};

const focusOutline = (theme) => ({
  outline: `2px solid ${theme.palette.primary.main}`,
  outlineOffset: '2px',
});

const StyledOpenButton = styled(ButtonBase)(({ theme }) => ({
  gap: theme.spacing(1),
  padding: theme.spacing(0.5, 1),
  fontSize: '0.913rem',
  fontWeight: 'bold',
  backgroundColor: '#fff',
  borderRadius: '4px',
  '&.Mui-focusVisible': focusOutline(theme),
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& button:focus-visible, & .Mui-focusVisible': focusOutline(theme),
  '& .MuiPickersDay-root:focus-visible, & .MuiPickersDay-root.Mui-focusVisible, & .MuiPickersYear-yearButton:focus-visible':
    {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: '-2px',
      boxShadow: 'inset 0 0 0 4px #fff',
    },
}));

const StyledDialogHeader = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 1, 0, 0),
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontSize: '1.1rem',
  padding: theme.spacing(1, 2.5),
}));

DatePickerDialog.propTypes = {
  value: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  buttonLabel: PropTypes.string.isRequired,
  dialogTitle: PropTypes.string.isRequired,
  showYearSelection: PropTypes.bool,
};

DatePickerDialog.defaultProps = {
  minDate: undefined,
  maxDate: undefined,
  showYearSelection: true,
};

export default DatePickerDialog;
