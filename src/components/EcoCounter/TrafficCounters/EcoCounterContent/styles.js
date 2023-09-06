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
    padding: `${theme.spacing(0.5)} ${theme.spacing(1.5)}`,
  },
  paddingNarrow: {
    padding: theme.spacing(0.5),
  },
  ecoCounterHeader: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(1.5),
    alignItems: 'flex-end',
    borderBottom: '2px solid gray',
    width: '95%',
    justifyContent: 'space-between',
  },
  headerSubtitle: {
    padding: '4px 0 5px',
    fontWeight: 'bold',
    marginBlockStart: theme.spacing(2),
    marginBlockEnd: theme.spacing(0.2),
  },
  dateContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '32%',
  },
  ecocounterUserTypes: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(0.5),
  },
  buttonAndTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '0.7rem',
    alignItems: 'center',
  },
  textContainer: {
    width: '40px',
    marginRight: theme.spacing(1.5),
  },
  userTypeText: {
    fontWeight: 'bold',
    paddingTop: theme.spacing(0.5),
    paddingRight: theme.spacing(1),
    fontSize: '0.8rem',
  },
  buttonText: {
    fontSize: '0.75rem',
  },
  iconActive: {
    fill: '#ffffff',
    width: '40px',
    height: '40px',
  },
  icon: {
    fill: '#000000',
    width: '40px',
    height: '40px',
  },
  ecocounterSteps: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: '1rem 0',
  },
  ecocounterChart: {
    margin: 0,
  },
  iconContainer: {
    marginRight: theme.spacing(0.5),
    paddingTop: theme.spacing(1),
  },
});

export default styles;
