const styles = (theme) => ({
  input: {
    border: 'none',
    textAlign: 'end',
    paddingRight: theme.spacing(0.7),
    ...theme.typography.body2,
    '&:hover': {
      cursor: 'pointer',
      border: 'none',
    },
  },
});

export default styles;
