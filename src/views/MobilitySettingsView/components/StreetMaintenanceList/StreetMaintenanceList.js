import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Typography, FormControlLabel, Checkbox } from '@mui/material';
import styled from '@emotion/styled';
import InfoTextBox from '../../../../components/MobilityPlatform/InfoTextBox';

const StreetMaintenanceList = ({
  openStreetMaintenanceList, isActive, streetMaintenancePeriod, streetMaintenanceSelections,
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
    green: 'rgba(15, 115, 6, 255)',
  };

  return (
    openStreetMaintenanceList ? (
      <>
        <StyledBorderedParagraph>
          <Typography
            variant="body2"
            aria-label={intl.formatMessage({ id: 'mobilityPlatform.menu.streetMaintenance.info' })}
          >
            {intl.formatMessage({ id: 'mobilityPlatform.menu.streetMaintenance.info' })}
          </Typography>
          {!isActive && streetMaintenancePeriod ? (
            <InfoTextBox infoText="mobilityPlatform.info.streetMaintenance.noActivity" reducePadding />
          ) : null}
        </StyledBorderedParagraph>
        {streetMaintenanceSelections?.length > 0
              && streetMaintenanceSelections.map(item => (
                <StyledCheckBoxItem key={item.type}>
                  <FormControlLabel
                    control={(
                      <StyledCheckBox
                        checked={item.type === streetMaintenancePeriod}
                        aria-checked={item.type === streetMaintenancePeriod}
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
            {streetMaintenanceInfo(colorValues.blue, 'mobilityPlatform.menu.streetMaintenance.info.snowplow')}
            {streetMaintenanceInfo(colorValues.purple, 'mobilityPlatform.menu.streetMaintenance.info.deicing')}
            {streetMaintenanceInfo(colorValues.burgundy, 'mobilityPlatform.menu.streetMaintenance.info.sandRemoval')}
            {streetMaintenanceInfo(colorValues.green, 'mobilityPlatform.menu.streetMaintenance.info.sanitation')}
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

StreetMaintenanceList.propTypes = {
  openStreetMaintenanceList: PropTypes.bool,
  isActive: PropTypes.bool,
  streetMaintenancePeriod: PropTypes.string,
  streetMaintenanceSelections: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
  })),
};

StreetMaintenanceList.defaultProps = {
  openStreetMaintenanceList: false,
  isActive: false,
  streetMaintenancePeriod: '',
  streetMaintenanceSelections: [],
};

export default StreetMaintenanceList;
