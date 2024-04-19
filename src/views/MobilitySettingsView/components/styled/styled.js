import styled from '@emotion/styled';

const StyledCheckboxItem = styled.div(({ theme }) => ({
  borderBottom: '1px solid rgb(193, 193, 193)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  paddingLeft: theme.spacing(3.5),
}));

const StyledParagraph = styled.div(({ theme }) => ({
  textAlign: 'left',
  padding: theme.spacing(1.5),
  width: '85%',
}));

export { StyledCheckboxItem, StyledParagraph };
