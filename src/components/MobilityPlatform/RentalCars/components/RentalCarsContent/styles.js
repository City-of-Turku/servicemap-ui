export default theme => ({
  container: {
    margin: theme.spacing(1),
  },
  title: {
    width: '94%',
    borderBottom: '1px solid #000000',
    marginBottom: theme.spacing(1),
  },
  text: {
    paddingBottom: theme.spacing(1),
  },
  linkContainer: {
    paddingBottom: theme.spacing(1),
    width: '55%',
  },
  link: {
    color: theme.palette.link.main,
    textDecoration: 'underline',
  },
});
