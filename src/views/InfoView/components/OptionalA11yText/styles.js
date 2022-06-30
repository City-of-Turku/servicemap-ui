export default theme => ({
  container: {
    whiteSpace: 'pre-line',
    textAlign: 'left',
  },
  title: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    paddingBottom: theme.spacing(0.1),
  },
  text: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  linkContainer: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  link: {
    color: theme.palette.link.main,
    textDecoration: 'underline',
  },
});
