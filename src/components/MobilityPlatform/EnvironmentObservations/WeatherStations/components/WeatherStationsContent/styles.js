const styles = (theme) => ({
  buttonTransparent: {
    backgroundColor: '#fff',
    border: 'none',
    cursor: 'pointer',
    '&:hover': {
      color: 'rgba(84, 84, 84, 255)',
    },
  },
  button: {
    border: '1px solid gray',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: theme.spacing(1.5),
  },
  buttonGray: {
    backgroundColor: '#ddd',
    border: 'none',
    borderRadius: '5px',
    color: '#fff',
    cursor: 'pointer',
    padding: theme.spacing(1),
  },
  buttonWhite: {
    backgroundColor: '#fff',
  },
  buttonActive: {
    backgroundColor: 'rgba(7, 44, 115, 255)',
    color: '#fff',
  },
  paddingWide: {
    padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
  },
  paddingNarrow: {
    padding: theme.spacing(0.5),
  },
  widthMd: {
    width: '95%',
  },
  widthSm: {
    width: '87%',
  },
  contentHeader: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(1.5),
    alignItems: 'flex-end',
    borderBottom: '2px solid gray',
    justifyContent: 'space-between',
  },
  headerSubtitle: {
    padding: '4px 0 5px',
    fontWeight: 'bold',
    marginBlockStart: theme.spacing(2),
    marginBlockEnd: theme.spacing(0.2),
  },
  textContainer: {
    paddingBottom: theme.spacing(1),
  },
  parameterTitle: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  parameterTypeText: {
    marginTop: theme.spacing(0.5),
    marginLeft: theme.spacing(3),
  },
  buttonText: {
    fontSize: '0.75rem',
  },
  chartContainer: {
    margin: 0,
  },
  iconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 44, 115, 255)',
    color: '#fff',
    border: '1px solid gray',
    borderRadius: '5px',
    padding: theme.spacing(0.5),
    width: '30px',
    height: '30px',
  },
  cardContainer: {
    padding: theme.spacing(1),
  },
  card: {
    padding: theme.spacing(3),
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default styles;
