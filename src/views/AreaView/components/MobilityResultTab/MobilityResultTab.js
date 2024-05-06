import React from 'react';
import { useIntl } from 'react-intl';
import { List, ListItem, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';
import MobilityToggleButton from '../../../MobilitySettingsView/components/MobilityToggleButton';

const MobilityResultTab = () => {
  const intl = useIntl();

  const { showMobilityResults, setShowMobilityResults } = useMobilityPlatformContext();

  const toggleMobilityResults = () => {
    setShowMobilityResults(current => !current);
  };

  /* const categories = [
    {
      component: renderSettings(),
      title: intl.formatMessage({ id: 'area.mobilityResults.title' }),
      icon: <LocationCity />,
      onClick: toggleOpen,
      setState: openMobilityResults,
    },
  ]; */

  return (
    <div>
      <List>
        <ListItem divider disableGutters style={{ padding: '0px' }}>
          <StyledContainer>
            <StyledMargin>
              <Typography component="p" variant="subtitle2">
                {intl.formatMessage({ id: 'area.mobilityResults.title' })}
              </Typography>
            </StyledMargin>
            <StyledMargin>
              <MobilityToggleButton
                msgId="area.mobilityResults.toggle"
                checkedValue={showMobilityResults}
                onChangeValue={toggleMobilityResults}
              />
            </StyledMargin>
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
