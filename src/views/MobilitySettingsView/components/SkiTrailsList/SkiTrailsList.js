import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useIntl } from 'react-intl';
import { Typography, FormControlLabel, Checkbox } from '@mui/material';
import InfoTextBox from '../../../../components/MobilityPlatform/InfoTextBox';

// TODO: ski trails
const SkiTrailsList = ({
  openSkiTrailsList,
  isActive,
  skiTrailsPeriod,
  skiTrailsSelections,
}) => {
  const intl = useIntl();

  return (
    openSkiTrailsList ? (
      <>
        <StyledBorderedParagraph>
          <Typography
            variant="body2"
            aria-label={intl.formatMessage({ id: 'mobilityPlatform.menu.streetMaintenance.info' })}
          >
            {intl.formatMessage({ id: 'mobilityPlatform.menu.streetMaintenance.info' })}
          </Typography>
          {!isActive && skiTrailsPeriod ? (
            <InfoTextBox infoText="mobilityPlatform.info.streetMaintenance.noActivity" reducePadding />
          ) : null}
        </StyledBorderedParagraph>
        {skiTrailsSelections?.length > 0
              && skiTrailsSelections.map(item => (
                <StyledCheckBoxItem key={item.type}>
                  <FormControlLabel
                    control={(
                      <StyledCheckBox
                        checked={item.type === skiTrailsPeriod}
                        aria-checked={item.type === skiTrailsPeriod}
                        onChange={() => item.onChangeValue(item.type)}
                      />
                    )}
                    label={(
                      <Typography variant="body2" aria-label={intl.formatMessage({ id: item.msgId })}>
                        {intl.formatMessage({ id: item.msgId })}
                      </Typography>
                    )}
                  />
                </StyledCheckBoxItem>
              ))}
      </>
    ) : null
  );
};

const StyledBorderedParagraph = styled.div(({ theme }) => ({
  textAlign: 'left',
  padding: theme.spacing(1.5),
  borderBottom: '1px solid rgb(193, 193, 193)',
}));

const StyledCheckBox = styled(Checkbox)(({ theme }) => ({
  marginLeft: theme.spacing(4),
}));

const StyledCheckBoxItem = styled.div(() => ({
  width: '100%',
  borderBottom: '1px solid rgb(193, 193, 193)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
}));

SkiTrailsList.propTypes = {
  openSkiTrailsList: PropTypes.bool,
  isActive: PropTypes.bool,
  skiTrailsPeriod: PropTypes.string,
  skiTrailsSelections: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
  })),
};

SkiTrailsList.defaultProps = {
  openSkiTrailsList: false,
  isActive: false,
  skiTrailsPeriod: '',
  skiTrailsSelections: [],
};

export default SkiTrailsList;
