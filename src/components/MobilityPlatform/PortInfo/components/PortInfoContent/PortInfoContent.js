import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import styled from '@emotion/styled';
import {
  StyledContainer, StyledFlexContainer, StyledHeaderContainer, StyledTextContainer,
} from '../../../styled/styled';
import DateTimeText from '../../../DateTimeText';

const PortInfoContent = ({ portItem, portCalls }) => {
  const intl = useIntl();

  const portCallsFiltered = portCalls?.filter(item => item?.portAreaDetails[0]?.portAreaName === portItem?.properties?.portAreaName);

  const renderText = msgId => (
    <StyledTextContainer>
      <Typography variant="subtitle1" component="h5">
        {intl.formatMessage({ id: msgId })}
      </Typography>
    </StyledTextContainer>
  );

  const renderValue = value => (
    <StyledTextContainer>
      <Typography variant="body2" component="p">
        {value}
      </Typography>
    </StyledTextContainer>
  );

  const renderArrivals = () => (
    <div>
      {renderText('mobilityPlatform.content.portInfo.arrivals')}
      {portCallsFiltered?.map(item => (
        <StyledFlexContainer key={item.portCallTimestamp}>
          <FerryIcon color="rgba(7, 44, 115, 255)" className="icon-icon-hsl-ferry" />
          {renderValue(item.vesselName)}
          <DateTimeText dateTimeText={item.portAreaDetails[0].eta} />
        </StyledFlexContainer>
      ))}
    </div>
  );

  const renderDeparting = () => (
    <div>
      {renderText('mobilityPlatform.content.portInfo.departing')}
      {portCallsFiltered?.map(item => (
        <StyledFlexContainer key={item.portCallId}>
          <FerryIcon color="rgba(7, 44, 115, 255)" className="icon-icon-hsl-ferry" />
          {renderValue(item.vesselName)}
          <DateTimeText dateTimeText={item.portAreaDetails[0].etd} />
        </StyledFlexContainer>
      ))}
    </div>
  );

  return (
    <StyledContainer>
      <StyledHeaderContainer>
        <Typography variant="subtitle1" component="h4">
          {portItem?.properties?.portAreaName}
        </Typography>
      </StyledHeaderContainer>
      <>
        {renderArrivals()}
        {renderDeparting()}
      </>
    </StyledContainer>
  );
};

const FerryIcon = styled.span(({ color }) => ({
  fontSize: 20,
  width: '20px',
  height: '20px',
  lineHeight: '21px',
  marginLeft: '6px',
  marginRight: '4px',
  marginTop: '8px',
  color,
}));

PortInfoContent.propTypes = {
  portItem: PropTypes.shape({
    properties: PropTypes.shape({
      portAreaName: PropTypes.string,
    }),
  }),
  portCalls: PropTypes.arrayOf(PropTypes.shape({
    portCallId: PropTypes.number,
    portCallTimestamp: PropTypes.string,
    vesselName: PropTypes.string,
    portAreaDetails: PropTypes.arrayOf(PropTypes.shape({
      eta: PropTypes.string,
      etd: PropTypes.string,
    })),
  })),
};

PortInfoContent.defaultProps = {
  portItem: {},
  portCalls: [],
};

export default PortInfoContent;
