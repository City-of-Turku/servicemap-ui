import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import { format } from 'date-fns';
import styled from '@emotion/styled';
import {
  StyledContainer, StyledFlexContainer, StyledHeaderContainer, StyledTextContainer,
} from '../../../styled/styled';

const PortInfoContent = ({ portItem, portCalls }) => {
  const intl = useIntl();

  const formatDateTime = dateTimeValue => format(new Date(dateTimeValue), 'dd.MM (HH:mm)');

  const renderArrivals = () => (
    <div>
      <StyledTextContainer>
        <Typography variant="subtitle1" component="h5">
          {intl.formatMessage({ id: 'mobilityPlatform.content.portInfo.arrivals' })}
        </Typography>
      </StyledTextContainer>
      {portCalls?.map(item => (
        <StyledFlexContainer>
          <FerryIcon color="rgba(7, 44, 115, 255)" className="icon-icon-hsl-ferry" />
          <StyledTextContainer>
            <Typography variant="body2" component="p">
              {item.vesselName}
            </Typography>
          </StyledTextContainer>
          <StyledTextContainer>
            <Typography variant="body2" component="p">
              {formatDateTime(item.portAreaDetails[0].eta)}
            </Typography>
          </StyledTextContainer>
        </StyledFlexContainer>
      ))}
    </div>
  );

  const renderDeparting = () => (
    <div>
      <StyledTextContainer>
        <Typography variant="subtitle1" component="h5">
          {intl.formatMessage({ id: 'mobilityPlatform.content.portInfo.departing' })}
        </Typography>
      </StyledTextContainer>
      {portCalls?.map(item => (
        <StyledFlexContainer>
          <FerryIcon color="rgba(7, 44, 115, 255)" className="icon-icon-hsl-ferry" />
          <StyledTextContainer>
            <Typography variant="body2" component="p">
              {item.vesselName}
            </Typography>
          </StyledTextContainer>
          <StyledTextContainer>
            <Typography variant="body2" component="p">
              {formatDateTime(item.portAreaDetails[0].etd)}
            </Typography>
          </StyledTextContainer>
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
    vesselName: PropTypes.string,
  })),
};

PortInfoContent.defaultProps = {
  portItem: {},
  portCalls: [],
};

export default PortInfoContent;
