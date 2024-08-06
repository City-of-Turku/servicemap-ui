import React from 'react';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import styled from '@emotion/styled';

const ScooterProviderList = ({ openList, scooterProviders }) => {
  const intl = useIntl();
  const renderData = scooterProviders?.length > 0;

  return (
    openList ? (
      <>
        <StyledContainer>
          <Typography
            variant="body2"
          >
            {intl.formatMessage({ id: 'mobilityPlatform.menu.scooters.list.info' })}
          </Typography>
        </StyledContainer>
        {renderData
              && scooterProviders.map(item => (
                <StyledCheckboxContainer key={item.type}>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={item.checkedValue}
                        aria-checked={item.checkedValue}
                        onChange={() => item.onChangeValue()}
                      />
                    )}
                    label={(
                      <Typography
                        variant="body2"
                      >
                        {intl.formatMessage({ id: item.msgId })}
                      </Typography>
                    )}
                  />
                </StyledCheckboxContainer>
              ))}
      </>
    ) : null
  );
};

const StyledContainer = styled.div(({ theme }) => ({
  textAlign: 'left',
  padding: theme.spacing(1.5),
  borderBottom: '1px solid #6f7276',
}));

const StyledCheckboxContainer = styled.div(({ theme }) => ({
  borderBottom: '1px solid #6f7276',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  paddingLeft: theme.spacing(3.5),
}));

ScooterProviderList.propTypes = {
  openList: PropTypes.bool,
  scooterProviders: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    checkedValue: PropTypes.bool,
    msgId: PropTypes.string,
  })),
};

ScooterProviderList.defaultProps = {
  openList: false,
  scooterProviders: [],
};

export default ScooterProviderList;
