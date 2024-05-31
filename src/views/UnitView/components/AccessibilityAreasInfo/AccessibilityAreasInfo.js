import React from 'react';
import { Typography } from '@mui/material';
import styled from '@emotion/styled';
import { useIntl } from 'react-intl';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';
import AccessibilityAreasToggle from './components/AccessibilityAreasToggle';
import toggleObjectValue from '../../../MapView/utils/updateObject';
import { Container } from '../../../../components';

const AccessibilityAreasInfo = () => {
  const { showAccessibilityAreas, setShowAccessibilityAreas } = useMobilityPlatformContext();

  const intl = useIntl();

  const accessibilityAreasToggle = () => {
    toggleObjectValue('all', showAccessibilityAreas, setShowAccessibilityAreas);
  };

  const accessibilityAreasWalkingToggle = () => {
    toggleObjectValue('walking', showAccessibilityAreas, setShowAccessibilityAreas);
  };

  const accessibilityAreasCyclingToggle = () => {
    toggleObjectValue('cycling', showAccessibilityAreas, setShowAccessibilityAreas);
  };

  const settingsData = [
    {
      type: 'allAccessibilityAreas',
      msgId: 'unit.accessibilityAreas.all.label',
      checkedValue: showAccessibilityAreas.all,
      onChangeValue: accessibilityAreasToggle,
    },
    {
      type: 'accessibilityAreasWalking',
      msgId: 'unit.accessibilityAreas.walking.label',
      checkedValue: showAccessibilityAreas.walking,
      onChangeValue: accessibilityAreasWalkingToggle,
    },
    {
      type: 'accessibilityAreasCycling',
      msgId: 'unit.accessibilityAreas.cycling.label',
      checkedValue: showAccessibilityAreas.cycling,
      onChangeValue: accessibilityAreasCyclingToggle,
    },
  ];

  const renderSettings = () => settingsData.map(item => (
    <StyledCheckBoxContainer key={item.type}>
      <AccessibilityAreasToggle
        msgId={item.msgId}
        checkedValue={item.checkedValue}
        onChangeValue={item.onChangeValue}
        selectionSize={settingsData.length}
      />
    </StyledCheckBoxContainer>
  ));

  return (
    <StyledContent>
      <StyledContainer>
        <Typography variant="subtitle1" component="h4">
          {intl.formatMessage({ id: 'unit.accessibilityAreas.title' })}
        </Typography>
      </StyledContainer>
      <StyledContainer>
        <Typography variant="body2" component="p">
          {intl.formatMessage({ id: 'unit.accessibilityAreas.description' })}
        </Typography>
      </StyledContainer>
      <Container>{renderSettings()}</Container>
    </StyledContent>
  );
};

const StyledContent = styled.div(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(1),
}));

const StyledContainer = styled(Container)(() => ({
  alignItems: 'flex-start',
  textAlign: 'left',
}));

const StyledCheckBoxContainer = styled.div(({ theme }) => ({
  width: '100%',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  textAlign: 'left',
}));

export default AccessibilityAreasInfo;
