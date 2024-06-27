import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { DescriptionText } from '../../../../components';
import DescriptionExtraText from '../../../../components/DescriptionExtraText';
import useLocaleText from '../../../../utils/useLocaleText';
import unitSectionFilter from '../../utils/unitSectionFilter';
import { StyledAlignLeftParagraph, StyledLink } from '../styled/styled';

const Description = ({ unit }) => {
  const getLocaleText = useLocaleText();

  const additionalInfo = [
    ...unitSectionFilter(unit.connections, 'OTHER_INFO'),
    ...unitSectionFilter(unit.connections, 'TOPICAL'),
  ];

  if (unit.description || additionalInfo.length || unit.extra) {
    return (
      <div>
        {/* Description */}
        {unit.description && (
          <DescriptionText
            description={getLocaleText(unit.description)}
            title={<FormattedMessage id="unit.description" />}
            titleComponent="h4"
            extraField={unit.extra}
          />
        )}
        {/* Extra field */}
        {unit.extra && (
          <DescriptionExtraText
            extra={unit.extra}
            serviceName={unit.services[0].name.fi}
            title={<FormattedMessage id="unit.description" />}
            titleComponent="h4"
          />
        )}
        {/* Other info texts + links */}
        {additionalInfo.map((item) => {
          if (item.value.www) {
            return (
              <StyledAlignLeftParagraph
                key={item.id}
                variant="body2"
              >
                <StyledLink href={getLocaleText(item.value.www)} target="_blank">
                  {getLocaleText(item.value.name)}
                  {' '}
                  <FormattedMessage id="opens.new.tab" />
                </StyledLink>

              </StyledAlignLeftParagraph>
            );
          }
          return (
            <StyledAlignLeftParagraph
              key={item.id}
              variant="body2"
            >
              {getLocaleText(item.value.name)}
            </StyledAlignLeftParagraph>
          );
        })}
      </div>
    );
  }
  return null;
};

Description.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Description;
