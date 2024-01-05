import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import styled from '@emotion/styled';
import { format } from 'date-fns';
import { fetchRailwaysData } from '../../../mobilityPlatformRequests/mobilityPlatformRequests';

// TODO render additional timetable info

const RailwayStationsContent = ({ intl, item, stationsData }) => {
  const [stationTrainsData, setStationTrainsData] = useState([]);

  const formatDateTime = dateTimeValue => format(new Date(dateTimeValue), 'HH:mm');

  useEffect(() => {
    const endpoint = `live-trains/station/${item.stationShortCode}`;
    const params = 'minutes_before_departure=120&minutes_after_departure=30&minutes_before_arrival=120&minutes_after_arrival=30&train_categories=Long-distance';
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
              <StyledText variant="body2" component="p">
                {intl.formatMessage(
                  { id: 'mobilityPlatform.content.railways.train' },
                  { value1: train.trainType, value2: train.trainNumber },
                )}
              </StyledText>
              {renderDestinations(train.timeTableRows)}
              {train.timeTableRows
                .filter(elem => elem.stationShortCode === item.stationShortCode && elem.type === 'DEPARTURE')
                .map(elem => (
                  <StyledText>
                    {intl.formatMessage(
                      { id: 'mobilityPlatform.content.railways.train.departing' },
                      { value: formatDateTime(elem.scheduledTime) },
                    )}
                  </StyledText>
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
              <StyledText variant="body2" component="p">
                {intl.formatMessage(
                  { id: 'mobilityPlatform.content.railways.train' },
                  { value1: train.trainType, value2: train.trainNumber },
                )}
              </StyledText>
              {renderDestinations(train.timeTableRows)}
              {train.timeTableRows
                .filter(elem => elem.stationShortCode === item.stationShortCode && elem.type === 'ARRIVAL')
                .map(elem => (
                  <StyledText>
                    {intl.formatMessage(
                      { id: 'mobilityPlatform.content.railways.train.arriving' },
                      { value: formatDateTime(elem.scheduledTime) },
                    )}
                  </StyledText>
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
