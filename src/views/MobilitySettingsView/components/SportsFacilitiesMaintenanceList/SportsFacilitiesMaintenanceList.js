import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Typography, FormControlLabel, Checkbox } from '@mui/material';
import styled from '@emotion/styled';
import InfoTextBox from '../../../../components/MobilityPlatform/InfoTextBox';
import { useAccessibleMap } from '../../../../redux/selectors/settings';

const SportsFacilitiesMaintenanceList = ({
  openSportsFacilitiesMaintenanceList, isActive, maintenancePeriod, maintenanceSelections,
}) => {
  const intl = useIntl();
  const useContrast = useSelector(useAccessibleMap);

  const streetMaintenanceInfo = (colorClass, translationId) => (
    <StyledFlexBox>
      <StyledBox color={colorClass} />
      <StyledMarginLeftSm>
        <Typography variant="body2">{intl.formatMessage({ id: translationId })}</Typography>
      </StyledMarginLeftSm>
    </StyledFlexBox>
  );

  const colorValues = {
    green: 'rgba(15, 115, 6, 255)',
    blue: 'rgba(7, 44, 115, 255)',
    purple: 'rgba(202, 15, 212, 255)',
  };

  // Dash patterns per condition for accessibility (color + texture in both normal and contrast mode)
  const getSkiTrailDashArray = period => {
    switch (period) {
      case '1day':
        return ''; // solid line – maintained within 1 day
      case '3days':
        return '12, 8'; // dashed – maintained within 3 days
      case 'over3days':
        return '4, 4, 12, 4'; // dash-dot – over 3 days
      default:
        return '2, 6'; // dotted – unknown
    }
  };

  const showSkiTrailLegend = maintenanceSelections?.some(s => s.type === '3days');

  const skiTrailLegendItem = (period, translationId) => {
    const strokeColor = useContrast
      ? 'rgba(0, 0, 0, 255)'
      : (colorValues[period === '1day' ? 'green' : period === '3days' ? 'blue' : 'purple']);
    return (
      <StyledFlexBox key={period}>
        <StyledLineSample>
          <svg width="32" height="12" aria-hidden="true">
            <line
              x1="0"
              y1="6"
              x2="32"
              y2="6"
              stroke={strokeColor}
              strokeWidth="3"
              strokeDasharray={getSkiTrailDashArray(period)}
              strokeLinecap="round"
            />
          </svg>
        </StyledLineSample>
        <StyledMarginLeftSm>
          <Typography variant="body2">{intl.formatMessage({ id: translationId })}</Typography>
        </StyledMarginLeftSm>
      </StyledFlexBox>
    );
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
            {showSkiTrailLegend ? (
              <>
                {skiTrailLegendItem('1day', 'mobilityPlatform.menu.maintenance.1day')}
                {skiTrailLegendItem('3days', 'mobilityPlatform.menu.maintenance.3days')}
                {skiTrailLegendItem('over3days', 'mobilityPlatform.menu.maintenance.over3days')}
              </>
            ) : maintenanceSelections?.length > 0 ? (
              <>
                {streetMaintenanceInfo(colorValues.green, 'mobilityPlatform.info.iceTracks.green')}
                {streetMaintenanceInfo(colorValues.blue, 'mobilityPlatform.info.iceTracks.orange')}
                {streetMaintenanceInfo(colorValues.purple, 'mobilityPlatform.info.iceTracks.red')}
              </>
            ) : null}
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

const StyledLineSample = styled.div(() => ({
  display: 'flex',
  alignItems: 'center',
  width: '1.5rem',
  height: '1.5rem',
  flexShrink: 0,
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
