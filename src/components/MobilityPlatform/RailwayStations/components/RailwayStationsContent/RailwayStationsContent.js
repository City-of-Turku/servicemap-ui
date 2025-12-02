import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import styled from '@emotion/styled';
import { format } from 'date-fns';
import { useIntl } from 'react-intl';
import { fetchRailwaysData } from '../../../mobilityPlatformRequests/mobilityPlatformRequests';
import { optionsToParams } from '../../../utils/utils';
import {
  StyledContainer, StyledHeaderContainer, StyledFlexContainer, StyledTextContainer,
} from '../../../styled/styled';

const RailwayStationsContent = ({ item, stationsData }) => {
  const [stationTrainsData, setStationTrainsData] = useState([]);

  const intl = useIntl();
  const formatDateTime = timeValue => format(new Date(timeValue), 'HH:mm');

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
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
    fetchRailwaysData(query, setStationTrainsData, signal);
    return () => controller.abort();
  }, [item.stationShortCode]);

  const filterArrivals = data => data.filter(
    train => train.timeTableRows.some(
      row => row.stationShortCode === item.stationShortCode
      && row.type === 'ARRIVAL'
      && row.trainStopping
      && row.commercialStop,
    ),
  );

  const filterDeparting = data => data.filter(
    train => train.timeTableRows.some(
      row => row.stationShortCode === item.stationShortCode
              && row.type === 'DEPARTURE'
              && row.trainStopping
              && row.commercialStop,
    ),
  );

  const sortTrainsByTime = (trains, rowType) => trains.sort((a, b) => {
    const aRow = a.timeTableRows.find(
      row => row.stationShortCode === item.stationShortCode && row.type === rowType,
    );
    const bRow = b.timeTableRows.find(
      row => row.stationShortCode === item.stationShortCode && row.type === rowType,
    );
    const aTime = aRow?.actualTime || aRow?.scheduledTime;
    const bTime = bRow?.actualTime || bRow?.scheduledTime;
    return new Date(aTime) - new Date(bTime);
  });

  const arrivingTrains = sortTrainsByTime(filterArrivals(stationTrainsData), 'ARRIVAL');
  const departingTrains = sortTrainsByTime(filterDeparting(stationTrainsData), 'DEPARTURE');

  const findStation = (stationsArr, codeValue) => stationsArr.find(station => station.stationShortCode === codeValue);

  const renderDestination = data => {
    const lastIdx = data.slice(-1)[0];
    const arrivalStation = findStation(stationsData, lastIdx.stationShortCode);
    return (
      <StyledTextContainer>
        <Typography variant="body2" component="p">
          {arrivalStation.stationName}
        </Typography>
      </StyledTextContainer>
    );
  };

  const renderTrainInfo = train => (
    <StyledTextContainer>
      <Typography variant="body2" component="p" left>{`${train.trainType} ${train.trainNumber}`}</Typography>
    </StyledTextContainer>
  );

  const renderTimeValues = elem => (
    <StyledTextContainer>
      <Typography key={elem.scheduledTime} variant="body2" component="p" right>
        {elem.liveEstimateTime && elem.differenceInMinutes > 1
          ? `${formatDateTime(elem.liveEstimateTime)} (${formatDateTime(elem.scheduledTime)})`
          : `${formatDateTime(elem.scheduledTime)}`}
      </Typography>
    </StyledTextContainer>
  );

  return (
    <StyledContainer>
      <StyledHeaderContainer>
        <Typography variant="subtitle1" component="h4">
          {item?.stationName}
        </Typography>
      </StyledHeaderContainer>
      <div>
        <div>
          <StyledTextContainer>
            <Typography variant="subtitle1" component="h5">
              {intl.formatMessage({ id: 'mobilityPlatform.content.departingTrains.title' })}
            </Typography>
          </StyledTextContainer>
          {!departingTrains?.length ? (
            <StyledTextContainer>
              <Typography variant="body2" component="p">
                {intl.formatMessage({ id: 'mobilityPlatform.content.departingTrains.empty' })}
              </Typography>
            </StyledTextContainer>
          ) : null}
          {departingTrains?.map(train => (
            <StyledFlexContainer key={train.trainNumber}>
              <TrainIcon color="rgba(7, 44, 115, 255)" className="icon-icon-hsl-train" />
              {renderTrainInfo(train)}
              {renderDestination(train.timeTableRows)}
              {train.timeTableRows
                .filter(elem => elem.stationShortCode === item.stationShortCode && elem.type === 'DEPARTURE')
                .map(elem => <span key={elem.scheduledTime}>{renderTimeValues(elem)}</span>)}
            </StyledFlexContainer>
          ))}
        </div>
        <div>
          <StyledTextContainer>
            <Typography variant="subtitle1" component="h5">
              {intl.formatMessage({ id: 'mobilityPlatform.content.arrivingTrains.title' })}
            </Typography>
          </StyledTextContainer>
          {!arrivingTrains?.length ? (
            <StyledTextContainer>
              <Typography variant="body2" component="p">
                {intl.formatMessage({ id: 'mobilityPlatform.content.arrivingTrains.empty' })}
              </Typography>
            </StyledTextContainer>
          ) : null}
          {arrivingTrains?.map(train => (
            <StyledFlexContainer key={train.trainNumber}>
              <TrainIcon color="rgba(7, 44, 115, 255)" className="icon-icon-hsl-train" />
              {renderTrainInfo(train)}
              {renderDestination(train.timeTableRows)}
              {train.timeTableRows
                .filter(elem => elem.stationShortCode === item.stationShortCode && elem.type === 'ARRIVAL')
                .map(elem => <span key={elem.scheduledTime}>{renderTimeValues(elem)}</span>)}
            </StyledFlexContainer>
          ))}
        </div>
      </div>
    </StyledContainer>
  );
};

const TrainIcon = styled.span(({ color }) => ({
  fontSize: 20,
  width: '20px',
  height: '20px',
  lineHeight: '21px',
  marginLeft: '6px',
  marginRight: '4px',
  marginTop: '8px',
  color,
}));

RailwayStationsContent.propTypes = {
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
