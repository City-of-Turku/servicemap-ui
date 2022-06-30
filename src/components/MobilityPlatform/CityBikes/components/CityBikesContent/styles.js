export default theme => ({
  popupInner: {
    margin: theme.spacing(2),
  },
  subtitle: {
    marginBottom: theme.spacing(1),
    paddingBottom: theme.spacing(0.5),
    borderBottom: '1px solid #000000',
    width: '88%',
  },
  paragraph: {
    marginBottom: theme.spacing(0.4),
  },
  bold: {
    fontWeight: 'bold',
  },
  link: {
    color: theme.palette.link.main,
    textDecoration: 'underline',
  },
});
