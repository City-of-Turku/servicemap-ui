import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import styled from '@emotion/styled';
import { format } from 'date-fns';
import { fetchRailwaysData } from '../../../mobilityPlatformRequests/mobilityPlatformRequests';

const RailwayStationsContent = ({ intl, item, stationsData }) => {
  const [stationTrainsData, setStationTrainsData] = useState([]);

  const formatDateTime = (scheduled, estimate) => {
    if (estimate) {
      return format(new Date(estimate), 'HH:mm');
    }
    return format(new Date(scheduled), 'HH:mm');
  };

  useEffect(() => {
    const endpoint = `live-trains/station/${item.stationShortCode}`;
    const params = 'minutes_before_departure=120&minutes_after_departure=20&minutes_before_arrival=120&minutes_after_arrival=20&train_categories=Long-distance';
    const query = `${endpoint}?${params}`;
    fetchRailwaysData(query, setStationTrainsData);
  }, [item.stationShortCode]);

  const filterArrivals = data => data.filter(train => {
    const lastRow = train.timeTableRows[train.timeTableRows.length - 1];
    return lastRow.stationShortCode === item.stationShortCode && lastRow.type === 'ARRIVAL';
  });

  const filterDeparting = data => data.filter(train => {
    const firstRow = train.timeTableRows[0];
    return firstRow.stationShortCode === item.stationShortCode && firstRow.type === 'DEPARTURE';
  });

  const arrivingTrains = filterArrivals(stationTrainsData);
  const departingTrains = filterDeparting(stationTrainsData);

  const findStation = (stationsArr, codeValue) => stationsArr.find(station => station.stationShortCode === codeValue);

  const renderDestinations = data => {
    const firstIdx = data[0];
    const lastIdx = data.slice(-1)[0];
    const departureStation = findStation(stationsData, firstIdx.stationShortCode);
    const arrivalStation = findStation(stationsData, lastIdx.stationShortCode);
    return (
      <StyledText>
        {`${departureStation.stationName} - ${arrivalStation.stationName}`}
      </StyledText>
    );
  };

  const renderTrainInfo = train => (
    <StyledText variant="body2" component="p">
      {intl.formatMessage(
        { id: 'mobilityPlatform.content.railways.train' },
        { value1: train.trainType, value2: train.trainNumber },
      )}
    </StyledText>
  );

  const renderTimeValues = (elem, translationId) => (
    <StyledText>
      {intl.formatMessage(
        { id: translationId },
        { value: formatDateTime(elem.scheduledTime, elem.liveEstimateTime) },
      )}
    </StyledText>
  );

  return (
    <StyledPopupInner>
      <StyledHeader>
        <StyledText variant="subtitle1" component="h4">
          {item?.stationName}
        </StyledText>
      </StyledHeader>
      <div>
        <div>
          <StyledTextContainer>
            <StyledText variant="subtitle2" component="h5">
              {intl.formatMessage({ id: 'mobilityPlatform.content.departingTrains.title' })}
            </StyledText>
          </StyledTextContainer>
          {departingTrains?.map(train => (
            <StyledTextContainer>
              {renderTrainInfo(train)}
              {renderDestinations(train.timeTableRows)}
              {train.timeTableRows
                .filter(elem => elem.stationShortCode === item.stationShortCode && elem.type === 'DEPARTURE')
                .map(elem => (
                  renderTimeValues(elem, 'mobilityPlatform.content.railways.train.departing')
                ))}
            </StyledTextContainer>
          ))}
        </div>
        <div>
          <StyledTextContainer>
            <StyledText variant="subtitle2" component="h5">
              {intl.formatMessage({ id: 'mobilityPlatform.content.arrivingTrains.title' })}
            </StyledText>
          </StyledTextContainer>
          {arrivingTrains?.map(train => (
            <StyledTextContainer>
              {renderTrainInfo(train)}
              {renderDestinations(train.timeTableRows)}
              {train.timeTableRows
                .filter(elem => elem.stationShortCode === item.stationShortCode && elem.type === 'ARRIVAL')
                .map(elem => (
                  renderTimeValues(elem, 'mobilityPlatform.content.railways.train.arriving')
                ))}
            </StyledTextContainer>
          ))}
        </div>
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
  stationsData: PropTypes.shape({
    stationShortCode: PropTypes.string,
  }),
};

RailwayStationsContent.defaultProps = {
  item: {},
  stationsData: [],
};

export default RailwayStationsContent;
