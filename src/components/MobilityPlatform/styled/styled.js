import styled from '@emotion/styled';

const StyledPopupInner = styled.div(({ theme }) => ({
  borderRadius: '3px',
  marginBottom: theme.spacing(1),
  marginLeft: theme.spacing(1.2),
  lineHeight: 1.2,
  overflowX: 'hidden',
}));

const StyledContentHeader = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  marginTop: theme.spacing(0.5),
  marginBottom: theme.spacing(1.5),
  alignItems: 'flex-end',
  borderBottom: '2px solid gray',
  justifyContent: 'space-between',
  width: '95%',
}));

const StyledContainer = styled.div(({ theme }) => ({
  margin: theme.spacing(1),
}));

const StyledHeaderContainer = styled.div(({ theme }) => ({
  width: '85%',
  borderBottom: '1px solid #000',
  paddingBottom: theme.spacing(0.5),
}));

const StyledTextContainer = styled.div(({ theme }) => ({
  marginTop: theme.spacing(0.5),
}));

const StyledMargin = styled.div(({ theme }) => ({
  margin: theme.spacing(0.4),
}));

export {
  StyledPopupInner,
  StyledContentHeader,
  StyledContainer,
  StyledHeaderContainer,
  StyledTextContainer,
  StyledMargin,
};
