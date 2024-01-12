import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import styled from '@emotion/styled';
import { format } from 'date-fns';
import { fetchRailwaysData } from '../../../mobilityPlatformRequests/mobilityPlatformRequests';

const RailwayStationsContent = ({ intl, item, stationsData }) => {
  const [stationTrainsData, setStationTrainsData] = useState([]);

  const formatDateTime = timeValue => format(new Date(timeValue), 'HH:mm');

  const optionsToParams = options => {
    const params = new URLSearchParams();
    Object.entries({ ...options }).forEach(([key, value]) => {
      params.set(key, value);
    });
    return params.toString();
  };

  useEffect(() => {
    const options = {
      minutes_before_departure: 180,
      minutes_after_departure: 15,
      minutes_before_arrival: 180,
      minutes_after_arrival: 15,
      train_categories: 'Long-distance',
    };
    const endpoint = `live-trains/station/${item.stationShortCode}`;
    const params = optionsToParams(options);
    const query = `${endpoint}?${params}`;
    fetchRailwaysData(query, setStationTrainsData);
  }, [item.stationShortCode]);

  const filterArrivals = data => data.filter(train => {
    const lastRow = train.timeTableRows.slice(-1)[0];
    return lastRow.stationShortCode === item.stationShortCode && lastRow.type === 'ARRIVAL';
  });

  const filterDeparting = data => data.filter(train => {
    const firstRow = train.timeTableRows[0];
    return firstRow.stationShortCode === item.stationShortCode && firstRow.type === 'DEPARTURE';
  });

  const arrivingTrains = filterArrivals(stationTrainsData);
  const departingTrains = filterDeparting(stationTrainsData);

  const findStation = (stationsArr, codeValue) => stationsArr.find(station => station.stationShortCode === codeValue);

  const renderDestination = data => {
    const lastIdx = data.slice(-1)[0];
    const arrivalStation = findStation(stationsData, lastIdx.stationShortCode);
    return (
      <StyledText variant="body2" component="p">
        {arrivalStation.stationName}
      </StyledText>
    );
  };

  const renderTrainInfo = train => (
    <StyledText variant="body2" component="p">{`${train.trainType} ${train.trainNumber}`}</StyledText>
  );

  const renderTimeValues = elem => (
    <StyledText key={elem.scheduledTime} variant="body2" component="p">
      {elem.liveEstimateTime && elem.differenceInMinutes > 1
        ? `${formatDateTime(elem.liveEstimateTime)} (${formatDateTime(elem.scheduledTime)})`
        : `${formatDateTime(elem.scheduledTime)}`}
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
            <StyledText variant="subtitle1" component="h5">
              {intl.formatMessage({ id: 'mobilityPlatform.content.departingTrains.title' })}
            </StyledText>
            {!departingTrains?.length ? (
              <StyledText variant="body2" component="p">
                {intl.formatMessage({ id: 'mobilityPlatform.content.departingTrains.empty' })}
              </StyledText>
            ) : null}
          </StyledTextContainer>
          {departingTrains?.map(train => (
            <StyledFlexContainer key={train.trainNumber}>
              <TrainIcon color="rgba(7, 44, 115, 255)" className="icon-icon-hsl-train" />
              {renderTrainInfo(train)}
              {renderDestination(train.timeTableRows)}
              {train.timeTableRows
                .filter(elem => elem.stationShortCode === item.stationShortCode && elem.type === 'DEPARTURE')
                .map(elem => renderTimeValues(elem))}
            </StyledFlexContainer>
          ))}
        </div>
        <div>
          <StyledTextContainer>
            <StyledText variant="subtitle1" component="h5">
              {intl.formatMessage({ id: 'mobilityPlatform.content.arrivingTrains.title' })}
            </StyledText>
            {!arrivingTrains?.length ? (
              <StyledText variant="body2" component="p">
                {intl.formatMessage({ id: 'mobilityPlatform.content.arrivingTrains.empty' })}
              </StyledText>
            ) : null}
          </StyledTextContainer>
          {arrivingTrains?.map(train => (
            <StyledFlexContainer key={train.trainNumber}>
              <TrainIcon color="rgba(7, 44, 115, 255)" className="icon-icon-hsl-train" />
              {renderTrainInfo(train)}
              {renderDestination(train.timeTableRows)}
              {train.timeTableRows
                .filter(elem => elem.stationShortCode === item.stationShortCode && elem.type === 'ARRIVAL')
                .map(elem => renderTimeValues(elem))}
            </StyledFlexContainer>
          ))}
        </div>
      </div>
    </StyledPopupInner>
  );
};

const TrainIcon = styled.span(({ color }) => ({
  fontSize: 20,
  width: 20,
  height: 20,
  lineHeight: '21px',
  marginLeft: 6,
  marginRight: 4,
  color,
}));

const StyledText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
}));

const StyledTextContainer = styled.div(({ theme }) => ({
  marginBottom: theme.spacing(0.75),
}));

const StyledFlexContainer = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.75),
  width: '90%',
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
  stationsData: PropTypes.arrayOf(
    PropTypes.shape({
      stationShortCode: PropTypes.string,
    }),
  ),
};

RailwayStationsContent.defaultProps = {
  item: {},
  stationsData: [],
};

export default RailwayStationsContent;
