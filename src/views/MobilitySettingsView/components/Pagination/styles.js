const styles = theme => ({
  pagination: {
    flexDirection: 'row',
    margin: theme.spacing(1, 2),
    padding: theme.spacing(0.5),
  },
  button: {
    margin: theme.spacing(0.5),
    height: 32,
    width: 32,
    minHeight: 32,
    minWidth: 32,
    backgroundColor: theme.palette.white.main,
    color: 'rgb(0, 0, 0)',
  },
  active: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.white.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.white.main,
    },
  },
});

export default styles;
