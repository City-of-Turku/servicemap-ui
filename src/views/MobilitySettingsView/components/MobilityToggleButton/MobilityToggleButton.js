import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import { useIntl } from 'react-intl';
import { css } from '@emotion/css';
import { SMSwitch } from '../../../../components';

/**
 * Render 1 or more switches inside form.
 * @property {any} classes
 * @property {any} intl
 * @property {string} keyVal
 * @property {string} msgId
 * @property {boolean} checkedValue
 * @property {Function} onChangeValue
 * @return {JSX Element}
 */

const MobilityToggleButton = ({
  msgId, checkedValue, onChangeValue, selectionSize, inputProps, ...rest
}) => {
  const intl = useIntl();

  const switchBorderClass = css({
    border: '1px solid #949494',
  });

  return (
    <StyledSwitchContainer>
      <StyledSMSwitch
        color="primary"
        classes={{ thumb: switchBorderClass }}
        size="small"
        value={checkedValue}
        inputProps={{
          ...inputProps,
          role: 'button',
          'aria-setsize': selectionSize ? selectionSize.toString() : null,
          'aria-pressed': checkedValue,
          'aria-labelledby': msgId,
        }}
        onChange={e => onChangeValue(e)}
        checked={checkedValue}
        {...rest}
      />
      <StyledLabelContainer>
        <Typography
          variant="body2"
          aria-label={intl.formatMessage({
            id: msgId,
          })}
        >
          {intl.formatMessage({
            id: msgId,
          })}
        </Typography>
      </StyledLabelContainer>
    </StyledSwitchContainer>
  );
};

const StyledSwitchContainer = styled.div(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  display: 'inline-flex',
  alignItems: 'center',
  marginLeft: theme.spacing(2),
  verticalAlign: 'middle',
}));

const StyledSMSwitch = styled(SMSwitch)(() => ({
  overflow: 'visible',
}));

const StyledLabelContainer = styled.div(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

MobilityToggleButton.propTypes = {
  msgId: PropTypes.string,
  checkedValue: PropTypes.bool,
  onChangeValue: PropTypes.func.isRequired,
  selectionSize: PropTypes.number,
  inputProps: PropTypes.shape({
    tabindex: PropTypes.string,
  }),
};

MobilityToggleButton.defaultProps = {
  msgId: '',
  checkedValue: false,
  selectionSize: null,
  inputProps: {},
};

export default MobilityToggleButton;
