import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import ChoiceGroup from '../ChoiceGroup';

const StyledContentHeader = styled.div(({ theme, isNarrow }) => ({
  display: 'flex',
  flexDirection: 'row',
  marginTop: theme.spacing(0.5),
  marginBottom: theme.spacing(1.5),
  alignItems: 'flex-end',
  borderBottom: '2px solid gray',
  justifyContent: 'space-between',
  width: isNarrow ? '87%' : '95%',
}));

const StyledHeaderSubtitle = styled(Typography)(({ theme }) => ({
  padding: '4px 0 5px',
  fontWeight: 'bold',
  marginBlockStart: theme.spacing(2),
  marginBlockEnd: theme.spacing(0.2),
}));

const StyledUserTypeText = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  paddingTop: theme.spacing(0.5),
  fontSize: '0.8rem',
}));

const StyledDateContainer = styled.div(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  maxWidth: '32%',
}));

const StyledUserTypesContainer = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-evenly',
  marginBottom: theme.spacing(0.5),
}));

const StyledChartContainer = styled.div(() => ({
  margin: 0,
}));

const StyledIconContainer = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(7, 44, 115, 255)',
  color: 'rgba(255, 255, 255, 255)',
  border: '1px solid gray',
  borderRadius: '5px',
  padding: theme.spacing(0.5),
}));

const choiceFace = {
  display: 'inline-flex',
  alignItems: 'center',
  border: '1px solid gray',
  borderRadius: '5px',
  color: 'rgb(0, 0, 0)',
};

const selectedChoiceFace = {
  backgroundColor: 'rgba(7, 44, 115, 255)',
  color: 'rgb(255, 255, 255)',
  boxShadow: '0 0 0 2px rgb(255, 255, 255), 0 0 0 4px rgba(7, 44, 115, 255)',
  fontWeight: 'bold',
  // Forced colors drops box-shadow and overrides backgrounds, so the selection is drawn with system colors
  '@media (forced-colors: active)': {
    forcedColorAdjust: 'none',
    backgroundColor: 'Highlight',
    color: 'HighlightText',
    boxShadow: '0 0 0 2px Canvas, 0 0 0 4px Highlight',
    '& svg': {
      fill: 'HighlightText',
    },
  },
};

const StyledUserTypeChoices = styled(ChoiceGroup)(({ theme }) => ({
  '& .choices': {
    display: 'flex',
    justifyContent: 'space-evenly',
    marginBottom: theme.spacing(0.5),
  },
  '& .choice': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  '& .choice-face': {
    ...choiceFace,
    padding: '4px',
  },
  '& input:checked + .choice-face': selectedChoiceFace,
}));

const StyledTimeStepChoices = styled(ChoiceGroup)(({ theme }) => ({
  '& .choices': {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: '1rem 0',
  },
  '& .choice-face': {
    ...choiceFace,
    ...theme.typography.body2,
    fontSize: '0.75rem',
    padding: '4px 8px',
  },
  '& input:checked + .choice-face': selectedChoiceFace,
}));

// Unselected series are dashed and struck through, so the state does not rely on colour
const StyledSeriesChoices = styled(ChoiceGroup)(({ theme }) => ({
  '& .choices': {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing(1),
    margin: `${theme.spacing(1)} 0`,
  },
  '& .choice-face': {
    ...choiceFace,
    gap: theme.spacing(0.75),
    padding: '4px 8px',
    border: '1px solid rgb(0, 0, 0)',
    fontSize: '0.75rem',
    backgroundColor: 'rgb(255, 255, 255)',
  },
  '& input:not(:checked) + .choice-face': {
    borderStyle: 'dashed',
    borderColor: 'rgb(110, 110, 110)',
    '& .series-label': {
      textDecoration: 'line-through',
    },
    '& .series-swatch': {
      opacity: 0.4,
    },
  },
}));

export {
  StyledSeriesChoices,
  StyledTimeStepChoices,
  StyledUserTypeChoices,
  StyledContentHeader,
  StyledHeaderSubtitle,
  StyledUserTypeText,
  StyledDateContainer,
  StyledUserTypesContainer,
  StyledChartContainer,
  StyledIconContainer,
};
