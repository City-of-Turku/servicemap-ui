import { Link, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import styled from '@emotion/styled';
import { StyledContainer, StyledHeaderContainer, StyledTextContainer } from '../../../../styled/styled';

const MarinasContent = ({ berthItem }) => {
  const intl = useIntl();

  const renderText = (translationId, value) => (
    <StyledTextContainer>
      <Typography variant="body2">
        {intl.formatMessage({ id: translationId }, { value })}
      </Typography>
    </StyledTextContainer>
  );

  const renderTypePrice = (price, berthType) => {
    const alvTax = 1.24;
    const fullPrice = price * alvTax;
    return (
      <>
        <StyledTextContainer>
          <Typography variant="body2">
            <strong>
              {intl.formatMessage({ id: 'mobilityPlatform.content.marinas.typeTitle' })}
            </strong>
          </Typography>
        </StyledTextContainer>
        {renderText('mobilityPlatform.content.marinas.type', berthType)}
        {renderText('mobilityPlatform.content.marinas.price', Math.round(fullPrice))}
      </>
    );
  };

  const countBerths = berthsData => {
    let count = 0;
    berthsData.forEach(item => {
      if (item.Varaustyyppi === 'Venepaikat' || item.Varaustyyppi === 'Soutuvenepaikka') {
        count += 1;
      }
    });
    return (
      renderText('mobilityPlatform.content.marinas.berthsCount', count)
    );
  };

  const countWinterStorage = berthsData => {
    let count = 0;
    berthsData.forEach(item => {
      if (item.Varaustyyppi === 'Soutuveneiden talvisäilytyspaikat' || item.Varaustyyppi === 'Talvisäilytyspaikat') {
        count += 1;
      }
    });
    return (
      renderText('mobilityPlatform.content.marinas.winterStorage', count)
    );
  };

  const renderLink = (linkUrl, translationId) => (
    <StyledTextContainer>
      <Link target="_blank" href={linkUrl}>
        <StyledLinkText variant="body2">
          {intl.formatMessage({
            id: translationId,
          })}
        </StyledLinkText>
      </Link>
    </StyledTextContainer>
  );

  return (
    <StyledContainer>
      <StyledHeaderContainer>
        <Typography variant="subtitle1" component="h3">
          {berthItem.name}
        </Typography>
      </StyledHeaderContainer>
      <div>
        {countBerths(berthItem.extra.berths)}
        {berthItem.name === 'Satama: Lauttaranta' ? countWinterStorage(berthItem.extra.berths) : null}
        {renderTypePrice(berthItem.extra.berths[0].HintaAlv0, berthItem.extra.berths[0].Kohdetyyppi)}
        <StyledTextContainer>
          <Typography variant="body2">
            {intl.formatMessage({ id: 'mobilityPlatform.content.marinas.reservationInfo' })}
          </Typography>
        </StyledTextContainer>
        {renderLink('https://opaskartta.turku.fi/ePermit/fi/Reservation/', 'mobilityPlatform.info.marinas.link')}
        {renderLink('https://www.turku.fi/venepaikat', 'mobilityPlatform.content.marinas.infoLink')}
      </div>
    </StyledContainer>
  );
};

const StyledLinkText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(0.7),
  color: theme.palette.link.main,
  textDecoration: 'underline',
}));

MarinasContent.propTypes = {
  berthItem: PropTypes.shape({
    name: PropTypes.string,
    extra: PropTypes.shape({
      berths: PropTypes.arrayOf(PropTypes.shape({
        Kohdetyyppi: PropTypes.string,
        HintaAlv0: PropTypes.number,
      })),
    }),
  }).isRequired,
};

export default MarinasContent;
