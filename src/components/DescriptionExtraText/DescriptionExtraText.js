import { Divider, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from '@emotion/styled';
import isClient from '../../utils';

const DescriptionExtraText = ({
  extra, serviceName, html, title, titleComponent,
}) => {
  // Hide linebreak html elements from screen readers
  const hideBRFromSR = text => text.replaceAll('<br>', '<br aria-hidden="true" />');

  const [chargers, setChargers] = useState(null);

  const intl = useIntl();

  useEffect(() => {
    if (extra.chargers) {
      setChargers(extra.chargers);
    }
  }, [extra]);

  useEffect(() => {
    if (extra.chargers) {
      setChargers(extra.chargers);
    }
  }, [extra]);

  const styledTextItem = (messageId, value) => (
    <StyledText variant="body2">
      {intl.formatMessage({ id: messageId }, { value })}
    </StyledText>
  );

  const chargerStationInfo = (
    <>
      <StyledText variant="subtitle2" component="h5">
        {intl.formatMessage({
          id: 'services.description.extra.cgsTitle',
        })}
        :
      </StyledText>
      {chargers?.map(charger => (
        <StyledParagraph key={`${charger.plug}${charger.power}${charger.number}`}>
          {styledTextItem('mobilityPlatform.content.cgsType', charger.plug)}
          {styledTextItem('mobilityPlatform.content.count', charger.number)}
          {styledTextItem('mobilityPlatform.content.power', charger.power)}
        </StyledParagraph>
      ))}
    </>
  );

  const gasFillingInfo = (
    <>
      <StyledText variant="subtitle2" component="h5">
        {intl.formatMessage({
          id: 'services.description.extra.gfsTitle',
        })}
      </StyledText>
      <StyledParagraph>
        {styledTextItem('mobilityPlatform.content.gfsType', extra.lng_cng)}
        {styledTextItem('mobilityPlatform.content.operator', extra.operator)}
      </StyledParagraph>
    </>
  );

  const bicycleStandInfo = (
    <>
      <StyledText variant="subtitle2" component="h5">
        {intl.formatMessage({
          id: 'services.description.extra.bisTitle',
        })}
      </StyledText>
      <StyledParagraph>
        {extra.model ? (
          <StyledText variant="body2">
            {intl.formatMessage({
              id: 'mobilityPlatform.content.bicycleStands.model',
            }, { value: extra.model })}
          </StyledText>
        ) : null}
        <StyledText variant="body2">
          {intl.formatMessage({
            id: 'mobilityPlatform.content.bicycleStands.numOfPlaces',
          }, { value: extra.number_of_places })}
        </StyledText>
        <StyledText variant="body2">
          {intl.formatMessage({
            id: 'mobilityPlatform.content.bicycleStands.numOfStands',
          }, { value: extra.number_of_stands })}
        </StyledText>
        {extra.hull_lockable ? (
          <StyledText variant="body2">
            {intl.formatMessage({
              id: 'mobilityPlatform.content.bicycleStands.hullLockable',
            })}
          </StyledText>
        ) : (
          <StyledText variant="body2">
            {intl.formatMessage({
              id: 'mobilityPlatform.content.bicycleStands.hullNotLockable',
            })}
          </StyledText>
        )}
        {extra.covered ? (
          <StyledText variant="body2">
            {intl.formatMessage({
              id: 'mobilityPlatform.content.bicycleStands.covered',
            })}
          </StyledText>
        ) : (
          <StyledText variant="body2">
            {intl.formatMessage({
              id: 'mobilityPlatform.content.bicycleStands.notCovered',
            })}
          </StyledText>
        )}
        {extra.maintained_by_turku ? (
          <StyledText variant="body2">
            {intl.formatMessage({
              id: 'mobilityPlatform.content.bicycleStands.maintainedByTku',
            })}
          </StyledText>
        ) : null}
      </StyledParagraph>
    </>
  );

  if (extra && isClient() && serviceName !== 'Pyöränkorjauspiste') {
    return (
      <StyledAlignLeft>
        <StyledSubtitle
          component={titleComponent}
          variant="subtitle1"
        >
          {title}
        </StyledSubtitle>
        <StyledDivider aria-hidden="true" />
        { !html ? (
          <>
            {serviceName === 'Kaasutankkausasema' ? gasFillingInfo : null}
            {serviceName === 'Autojen sähkölatauspiste' ? chargerStationInfo : null}
            {serviceName === 'Pyöräpysäköinti' ? bicycleStandInfo : null}
          </>
        ) : (
          <StyledText dangerouslySetInnerHTML={{ __html: hideBRFromSR(extra) }} variant="body2" />
        )}
      </StyledAlignLeft>
    );
  } return null;
};

const StyledParagraph = styled.div(({ theme }) => ({
  margin: theme.spacing(2),
  whiteSpace: 'pre-line',
}));

const StyledText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  whiteSpace: 'pre-line',
}));

const StyledSubtitle = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2),
}));

const StyledAlignLeft = styled.div(() => ({
  textAlign: 'left',
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginLeft: theme.spacing(-2),
  marginRight: theme.spacing(-2),
}));

DescriptionExtraText.propTypes = {
  extra: PropTypes.objectOf(PropTypes.any).isRequired,
  serviceName: PropTypes.string,
  title: PropTypes.node.isRequired,
  html: PropTypes.bool,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).isRequired,
};

DescriptionExtraText.defaultProps = {
  serviceName: null,
  html: false,
};

export default DescriptionExtraText;
