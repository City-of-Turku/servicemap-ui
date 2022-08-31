export default theme => ({
  container: {
    margin: theme.spacing(1),
  },
  headerContainer: {
    width: '85%',
    borderBottom: '1px solid #000',
    paddingBottom: theme.spacing(0.5),
  },
  textContainer: {
    marginTop: theme.spacing(0.5),
  },
  margin: {
    marginTop: theme.spacing(0.7),
  },
  link: {
    marginTop: theme.spacing(0.7),
    color: theme.palette.link.main,
    textDecoration: 'underline',
  },
});
