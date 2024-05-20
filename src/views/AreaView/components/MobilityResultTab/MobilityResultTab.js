import React from 'react';
import { List, ListItem } from '@mui/material';
import styled from '@emotion/styled';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';
import MobilityToggleButton from '../../../MobilitySettingsView/components/MobilityToggleButton';
import InfoTextBox from '../../../../components/MobilityPlatform/InfoTextBox/InfoTextBox';

const MobilityResultTab = () => {
  const { showMobilityResults, setShowMobilityResults } = useMobilityPlatformContext();

  const toggleMobilityResults = () => {
    setShowMobilityResults(current => !current);
  };

  return (
    <div>
      <List>
        <ListItem divider disableGutters style={{ padding: '0px' }}>
          <StyledContainer>
            <StyledMargin>
              <MobilityToggleButton
                msgId="area.mobilityResults.toggle"
                checkedValue={showMobilityResults}
                onChangeValue={toggleMobilityResults}
              />
            </StyledMargin>
          </StyledContainer>
        </ListItem>
        <ListItem disableGutters style={{ padding: '0px' }}>
          <StyledContainer>
            <InfoTextBox
              infoText="area.mobilityResults.info.text"
              linkUrl="https://liikkumistesti.turku.fi"
              linkText="area.mobilityResults.link.text"
            />
          </StyledContainer>
        </ListItem>
      </List>
    </div>
  );
};

const StyledContainer = styled.div(({ theme }) => ({
  padding: `0 ${theme.spacing(1)}`,
}));

const StyledMargin = styled.div(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
}));

export default MobilityResultTab;
