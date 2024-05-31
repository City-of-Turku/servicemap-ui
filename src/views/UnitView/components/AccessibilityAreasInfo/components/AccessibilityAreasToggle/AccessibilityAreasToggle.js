/* eslint-disable react/jsx-props-no-spreading */
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import styled from '@emotion/styled';
import { css } from '@emotion/css';
import { SMSwitch } from '../../../../../../components';

/**
 * Render 1 or more switches.
 * @property {string} msgId
 * @property {boolean} checkedValue
 * @property {Function} onChangeValue
 * @return {JSX Element}
 */

const AccessibilityAreasToggle = ({
  msgId, checkedValue, onChangeValue, selectionSize, inputProps, ...rest
}) => {
  const intl = useIntl();

  const switchBorderClass = css({
    border: '1px solid #949494',
  });

  return (
    <StyledContainer>
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
    </StyledContainer>
  );
};

const StyledContainer = styled.div(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  display: 'inline-flex',
  alignItems: 'center',
  marginLeft: theme.spacing(1),
  verticalAlign: 'middle',
}));

const StyledLabelContainer = styled.div(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

const StyledSMSwitch = styled(SMSwitch)(() => ({
  overflow: 'visible',
}));

AccessibilityAreasToggle.propTypes = {
  msgId: PropTypes.string,
  checkedValue: PropTypes.bool,
  onChangeValue: PropTypes.func.isRequired,
  selectionSize: PropTypes.number,
  inputProps: PropTypes.shape({
    tabindex: PropTypes.string,
  }),
};

AccessibilityAreasToggle.defaultProps = {
  msgId: '',
  checkedValue: false,
  selectionSize: null,
  inputProps: {},
};

export default AccessibilityAreasToggle;
