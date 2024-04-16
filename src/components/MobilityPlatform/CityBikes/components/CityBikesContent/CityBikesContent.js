import { Link, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import styled from '@emotion/styled';
import {
  StyledContainer, StyledHeaderContainer, StyledTextContainer, StyledBoldText,
} from '../../../styled/styled';

const CityBikesContent = ({ bikeStation, cityBikeStatistics }) => {
  const intl = useIntl();
  const getStationType = () => bikeStation.name.includes('eCargo bikes');

  const isCargoBike = getStationType();

  const getStation = data => {
    if (data && data.length > 0) {
      return data.find(item => item.station_id === bikeStation.station_id);
    }
    return {};
  };

  const stationItem = getStation(cityBikeStatistics);

  const renderText = (translationId, value) => (
    <StyledTextContainer>
      <Typography variant="body2">{intl.formatMessage({ id: translationId }, { value })}</Typography>
    </StyledTextContainer>
  );

  /** Remove 'eCargo bikes' from station name before render  */
  const formatStationName = name => {
    const split = name.split(':');
    return split[1];
  };

  const renderLink = (linkUrl, text) => (
    <StyledTextContainer>
      <Link target="_blank" href={linkUrl}>
        <StyledLinkText variant="body2">
          {text}
        </StyledLinkText>
      </Link>
    </StyledTextContainer>
  );

  const renderStationType = (isVirtual, translationId) => {
    if (isVirtual) {
      return (
        <StyledTextContainer>
          <Typography variant="body2">{intl.formatMessage({ id: translationId })}</Typography>
        </StyledTextContainer>
      );
    }
    return null;
  };

  const getNumberOfVacantPlaces = (capacity, numberOfBikes) => capacity - numberOfBikes;

  return (
    <StyledContainer>
      <StyledHeaderContainer>
        <Typography variant="subtitle1" component="h3">
          {intl.formatMessage({
            id: isCargoBike ? 'mobilityPlatform.content.cargoBikes.title' : 'mobilityPlatform.content.cityBikes.title',
          })}
        </Typography>
      </StyledHeaderContainer>
      {isCargoBike
        ? renderText('mobilityPlatform.content.cityBikes.name', formatStationName(bikeStation.name))
        : renderText('mobilityPlatform.content.cityBikes.name', bikeStation.name)}
      {renderStationType(bikeStation.is_virtual_station, 'mobilityPlatform.content.cityBikes.virtualStation')}
      {!isCargoBike
        ? renderText(
          'mobilityPlatform.content.cityBikes.vacantPlaces',
          getNumberOfVacantPlaces(bikeStation.capacity, stationItem?.num_bikes_available),
        )
        : null}
      <div>
        {!isCargoBike
          ? renderText('mobilityPlatform.content.cityBikes.bikes.available', stationItem?.num_bikes_available)
          : null}
        {isCargoBike
          ? stationItem?.vehicle_types_available
            .filter(item => item.vehicle_type_id === 'ecargo')
            .map(item => (
              <React.Fragment key={item.vehicle_type_id}>
                {renderText('mobilityPlatform.content.cargoBikes.available', item.count)}
              </React.Fragment>
            ))
          : null}
      </div>
      <StyledTextContainer>
        <StyledBoldText variant="body2">
          {intl.formatMessage({ id: 'mobilityPlatform.content.general.rentalUris' })}
          :
        </StyledBoldText>
      </StyledTextContainer>
      {renderLink(bikeStation.rental_uris.android, 'Android')}
      {renderLink(bikeStation.rental_uris.ios, 'iOS')}
    </StyledContainer>
  );
};

const StyledLinkText = styled(Typography)(({ theme }) => ({
  color: theme.palette.link.main,
  textDecoration: 'underline',
}));

CityBikesContent.propTypes = {
  bikeStation: PropTypes.shape({
    station_id: PropTypes.string,
    name: PropTypes.string,
    is_virtual_station: PropTypes.bool,
    capacity: PropTypes.number,
    rental_uris: PropTypes.shape({
      android: PropTypes.string,
      ios: PropTypes.string,
    }),
  }),
  cityBikeStatistics: PropTypes.arrayOf(
    PropTypes.shape({
      station_id: PropTypes.string,
    }),
  ),
};

CityBikesContent.defaultProps = {
  bikeStation: {},
  cityBikeStatistics: [],
};

export default CityBikesContent;
