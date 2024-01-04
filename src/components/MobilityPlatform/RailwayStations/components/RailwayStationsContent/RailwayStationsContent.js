import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import styled from '@emotion/styled';
import { fetchRailwaysData } from '../../../mobilityPlatformRequests/mobilityPlatformRequests';

// TODO Add timetable info & separate trains that will arrive and trains that will leave

const RailwayStationsContent = ({ intl, item }) => {
  const [stationTrainsData, setStationTrainsData] = useState([]);

  useEffect(() => {
    const endpoint = `live-trains/station/${item.stationShortCode}`;
    const params = 'minutes_before_departure=120&minutes_after_departure=30&minutes_before_arrival=120&minutes_after_arrival=30&train_categories=Long-distance';
    const query = `${endpoint}?${params}`;
    fetchRailwaysData(query, setStationTrainsData);
  }, [item.stationShortCode]);

  return (
    <StyledPopupInner>
      <StyledHeader>
        <StyledText variant="subtitle2" component="h4">
          {item?.stationName}
        </StyledText>
      </StyledHeader>
      <div>
        {stationTrainsData.map(train => (
          <StyledTextContainer>
            <StyledText variant="body2" component="p">
              {intl.formatMessage(
                { id: 'mobilityPlatform.content.railways.train' },
                { value1: train.trainType, value2: train.trainNumber },
              )}
            </StyledText>
          </StyledTextContainer>
        ))}
      </div>
    </StyledPopupInner>
  );
};

const StyledText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
}));

const StyledTextContainer = styled.div(({ theme }) => ({
  marginBottom: theme.spacing(0.75),
}));

const StyledPopupInner = styled.div(({ theme }) => ({
  borderRadius: '3px',
  marginBottom: theme.spacing(1),
  marginLeft: theme.spacing(1.2),
  lineHeight: 1.2,
  overflowX: 'hidden',
}));

const StyledHeader = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  marginTop: theme.spacing(0.5),
  marginBottom: theme.spacing(1),
  alignItems: 'flex-end',
  borderBottom: '2px solid gray',
  justifyContent: 'space-between',
  width: '86%',
}));

RailwayStationsContent.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  item: PropTypes.shape({
    stationShortCode: PropTypes.string,
    stationName: PropTypes.string,
  }),
};

RailwayStationsContent.defaultProps = {
  item: {},
};

export default RailwayStationsContent;
