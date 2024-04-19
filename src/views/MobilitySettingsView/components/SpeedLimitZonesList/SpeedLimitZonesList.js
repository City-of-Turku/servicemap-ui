import React from 'react';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import styled from '@emotion/styled';

const SpeedLimitZonesList = ({
  openSpeedLimitList, speedLimitListAsc, speedLimitSelections, setState,
}) => {
  const intl = useIntl();

  return (openSpeedLimitList ? (
    <>
      <StyledContainer>
        <Typography
          variant="body2"
          aria-label={intl.formatMessage({ id: 'mobilityPlatform.menu.speedLimitZones.select' })}
        >
          {intl.formatMessage({ id: 'mobilityPlatform.menu.speedLimitZones.select' })}
        </Typography>
      </StyledContainer>
      <StyledButtonList>
        {openSpeedLimitList && speedLimitListAsc.reduce((acc, curr) => {
          acc.push(
            <StyledCheckboxContainer key={curr}>
              <FormControlLabel
                control={(
                  <StyledCheckBox
                    checked={speedLimitSelections.includes(curr)}
                    aria-checked={speedLimitSelections.includes(curr)}
                    onChange={() => setState(curr)}
                  />
              )}
                label={(
                  <Typography
                    variant="body2"
                    aria-label={intl.formatMessage(
                      {
                        id: 'mobilityPlatform.content.speedLimitZones.suffix',
                      },
                      { curr },
                    )}
                  >
                    {intl.formatMessage(
                      {
                        id: 'mobilityPlatform.content.speedLimitZones.suffix',
                      },
                      { curr },
                    )}
                  </Typography>
              )}
              />
            </StyledCheckboxContainer>,
          );
          return acc;
        }, [])}
      </StyledButtonList>
    </>
  ) : null);
};

const StyledContainer = styled.div(({ theme }) => ({
  textAlign: 'left',
  padding: theme.spacing(1.5),
  borderBottom: '1px solid #6f7276',
}));

const StyledCheckboxContainer = styled.div(() => ({
  width: '100%',
  borderBottom: '1px solid #6f7276',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
}));

const StyledButtonList = styled.div(() => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'left',
}));

const StyledCheckBox = styled(Checkbox)(({ theme }) => ({
  marginLeft: theme.spacing(4),
}));

SpeedLimitZonesList.propTypes = {
  openSpeedLimitList: PropTypes.bool,
  speedLimitListAsc: PropTypes.arrayOf(PropTypes.number),
  speedLimitSelections: PropTypes.arrayOf(PropTypes.number),
  setState: PropTypes.func.isRequired,
};

SpeedLimitZonesList.defaultProps = {
  openSpeedLimitList: false,
  speedLimitListAsc: [],
  speedLimitSelections: [],
};

export default SpeedLimitZonesList;
