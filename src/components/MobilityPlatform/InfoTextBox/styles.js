export default theme => ({
  container: {
    textAlign: 'left',
    borderTop: 'rgb(193, 193, 193)',
  },
  link: {
    marginTop: theme.spacing(0.5),
    color: theme.palette.link.main,
    textDecoration: 'underline',
  },
  padding: {
    padding: theme.spacing(2),
  },
  paddingSm: {
    padding: '1rem 0.5rem 0.5rem 0',
  },
});
