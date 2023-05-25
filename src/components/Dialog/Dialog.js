import {
  Dialog as MUIDialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';
import { visuallyHidden } from '@mui/utils';
import CloseButton from '../CloseButton';
import SMButton from '../ServiceMapButton';

const Dialog = ({
  classes,
  title,
  content,
  actions,
  open,
  setOpen,
  referer,
}) => {
  const intl = useIntl();
  const dialogRef = useRef();

  const handleClose = () => {
    setOpen(false);
    if (referer?.current?.anchorEl) {
      setTimeout(() => {
        referer.current.anchorEl.focus();
      }, 1);
    }
  };

  const focusToFirstElement = () => {
    const dialog = dialogRef.current;
    const elem = dialog.querySelectorAll('button');
    elem[0].focus();
  };

  const focusToLastElement = () => {
    const dialog = dialogRef.current;
    const buttons = dialog.querySelectorAll('button');
    buttons[buttons.length - 1].focus();
  };

  const cancelText = intl.formatMessage({ id: 'general.close' });

  return (
    <div>
      <MUIDialog ref={dialogRef} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <div className={classes.root}>
          {/* Empty element that makes keyboard focus loop in dialog */}
          <Typography style={visuallyHidden} aria-hidden tabIndex={0} onFocus={focusToLastElement} />
          <CloseButton
            autoFocus
            className={classes.topCloseButton}
            onClick={handleClose}
            role="link"
          />
          <DialogTitle id="form-dialog-title" autoFocus>{title}</DialogTitle>
          <DialogContent>
            {content}
          </DialogContent>
          <DialogActions>
            {actions}
            <SMButton className={classes.closeButton} onClick={handleClose} role="link">
              {cancelText}
            </SMButton>
          </DialogActions>
          {/* Empty element that makes keyboard focus loop in dialog */}
          <Typography style={visuallyHidden} aria-hidden tabIndex={0} onFocus={focusToFirstElement} />
        </div>
      </MUIDialog>
    </div>
  );
};

Dialog.propTypes = {
  classes: PropTypes.shape({
    closeButton: PropTypes.string,
    root: PropTypes.string,
    topCloseButton: PropTypes.string,
  }).isRequired,
  title: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  actions: PropTypes.node,
  open: PropTypes.bool,
  setOpen: PropTypes.func.isRequired,
  referer: PropTypes.shape({
    current: PropTypes.shape({
      anchorEl: PropTypes.objectOf(PropTypes.any),
    }),
  }).isRequired,
};

Dialog.defaultProps = {
  actions: null,
  open: false,
};

export default Dialog;
