import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Typography, FormControlLabel, Checkbox } from '@mui/material';
import styled from '@emotion/styled';
import InfoTextBox from '../../../../components/MobilityPlatform/InfoTextBox';

const SportsFacilitiesMaintenanceList = ({
  openSportsFacilitiesMaintenanceList, isActive, maintenancePeriod, maintenanceSelections,
}) => {
  const intl = useIntl();

  const streetMaintenanceInfo = (colorClass, translationId) => (
    <StyledFlexBox>
      <StyledBox color={colorClass} />
      <StyledMarginLeftSm>
        <Typography variant="body2">{intl.formatMessage({ id: translationId })}</Typography>
      </StyledMarginLeftSm>
    </StyledFlexBox>
  );

  const colorValues = {
    blue: 'rgba(7, 44, 115, 255)',
    purple: 'rgba(202, 15, 212, 255)',
    burgundy: 'rgba(128, 0, 32, 255)',
  };

  return (
    openSportsFacilitiesMaintenanceList ? (
      <>
        <StyledBorderedParagraph>
          <Typography
            variant="body2"
            aria-label={intl.formatMessage({ id: 'mobilityPlatform.menu.sportsFacilitiesMaintenance.info' })}
          >
            {intl.formatMessage({ id: 'mobilityPlatform.menu.sportsFacilitiesMaintenance.info' })}
          </Typography>
          {!isActive && maintenancePeriod ? (
            <InfoTextBox infoText="mobilityPlatform.info.streetMaintenance.noActivity" reducePadding />
          ) : null}
        </StyledBorderedParagraph>
        {maintenanceSelections?.length > 0
              && maintenanceSelections.map(item => (
                <StyledCheckBoxItem key={item.type}>
                  <FormControlLabel
                    control={(
                      <StyledCheckBox
                        checked={item.type === maintenancePeriod}
                        aria-checked={item.type === maintenancePeriod}
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
        <StyledBorderedParagraph>
          <div>
            {maintenanceSelections?.length > 2
              ? (
                <>
                  {streetMaintenanceInfo(colorValues.blue, 'mobilityPlatform.info.iceTracks.green')}
                  {streetMaintenanceInfo(colorValues.purple, 'mobilityPlatform.info.iceTracks.orange')}
                  {streetMaintenanceInfo(colorValues.burgundy, 'mobilityPlatform.info.iceTracks.red')}
                </>
              )
              : (
                <>
                  {streetMaintenanceInfo(colorValues.blue, 'mobilityPlatform.info.iceTracks.green')}
                  {streetMaintenanceInfo(colorValues.burgundy, 'mobilityPlatform.info.iceTracks.red')}
                </>
              )}
          </div>
        </StyledBorderedParagraph>
      </>
    ) : null
  );
};

const StyledBorderedParagraph = styled.div(({ theme }) => ({
  textAlign: 'left',
  padding: theme.spacing(1.5),
  borderBottom: '1px solid rgb(193, 193, 193)',
}));

const StyledCheckBoxItem = styled.div(() => ({
  width: '100%',
  borderBottom: '1px solid rgb(193, 193, 193)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
}));

const StyledFlexBox = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  marginTop: theme.spacing(1),
}));

const StyledBox = styled.div(({ color }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '1.5rem',
  height: '1.5rem',
  backgroundColor: color,
}));

const StyledCheckBox = styled(Checkbox)(({ theme }) => ({
  marginLeft: theme.spacing(4),
}));

const StyledMarginLeftSm = styled.div(({ theme }) => ({
  marginLeft: theme.spacing(0.7),
}));

SportsFacilitiesMaintenanceList.propTypes = {
  openSportsFacilitiesMaintenanceList: PropTypes.bool,
  isActive: PropTypes.bool,
  maintenancePeriod: PropTypes.string,
  maintenanceSelections: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
  })),
};

SportsFacilitiesMaintenanceList.defaultProps = {
  openSportsFacilitiesMaintenanceList: false,
  isActive: false,
  maintenancePeriod: '',
  maintenanceSelections: [],
};

export default SportsFacilitiesMaintenanceList;
