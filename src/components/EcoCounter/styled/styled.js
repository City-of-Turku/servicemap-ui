import styled from '@emotion/styled';
import { ButtonBase, Typography } from '@mui/material';

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
  paddingRight: theme.spacing(1),
  fontSize: '0.8rem',
}));

const StyledButtonBase = styled(ButtonBase)(({ theme }) => ({
  border: '1px solid gray',
  borderRadius: '5px',
  cursor: 'pointer',
  marginRight: theme.spacing(1.5),
}));

const StyledDateContainer = styled.div(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  maxWidth: '32%',
}));

const StyledUserTypesContainer = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: theme.spacing(0.5),
}));

const StyledButtonText = styled.div(() => ({
  display: 'flex',
  flexDirection: 'column',
  marginRight: '0.7rem',
  alignItems: 'center',
}));

const StyledCharContainer = styled.div(() => ({
  margin: 0,
}));

const StyledStepsContainer = styled.div(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  padding: '1rem 0',
}));

export {
  StyledContentHeader,
  StyledHeaderSubtitle,
  StyledUserTypeText,
  StyledButtonBase,
  StyledDateContainer,
  StyledUserTypesContainer,
  StyledButtonText,
  StyledCharContainer,
  StyledStepsContainer,
};
