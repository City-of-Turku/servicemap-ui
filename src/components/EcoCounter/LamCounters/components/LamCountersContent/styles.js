const styles = theme => ({
  buttonTransparent: {
    backgroundColor: '#fff',
    border: 'none',
    cursor: 'pointer',
    '&:hover': {
      color: 'rgba(84, 84, 84, 255)',
    },
  },
  buttonGray: {
    backgroundColor: '#ddd',
    border: 'none',
    borderRadius: '5px',
    color: '#fff',
    cursor: 'pointer',
    padding: theme.spacing(0.5),
  },
  buttonWhite: {
    backgroundColor: '#fff',
    border: '1px solid gray',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: theme.spacing(1.5),
    padding: theme.spacing(0.5),
  },
  buttonActive: {
    backgroundColor: 'rgba(7, 44, 115, 255)',
    color: '#fff',
    border: '1px solid gray',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: theme.spacing(1.5),
    padding: theme.spacing(0.5),
  },
  lamCounterHeader: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(1.5),
    alignItems: 'flex-end',
    borderBottom: '2px solid gray',
    width: '95%',
  },
  headerSubtitle: {
    marginBlockStart: theme.spacing(2),
    marginBlockEnd: theme.spacing(0.2),
    fontWeight: 'bold',
  },
  headerDate: {
    marginLeft: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  lamCounterDatePicker: {
    position: 'absolute',
    top: '10%',
    left: '20%',
    backgroundColor: '#fff',
    zIndex: 1000,
  },
  lamCounterUserTypes: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(0.5),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: theme.spacing(1.5),
    alignItems: 'center',
  },
  textContainer: {
    width: '40px',
    marginRight: theme.spacing(1.5),
  },
  iconWrapper: {
    backgroundColor: 'rgba(7, 44, 115, 255)',
    color: '#fff',
    border: '1px solid gray',
    borderRadius: '5px',
    marginRight: theme.spacing(1.5),
    padding: theme.spacing(0.5),
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
    fill: '#fff',
    width: '40px',
    height: '40px',
  },
  icon: {
    fill: '#000',
    width: '40px',
    height: '40px',
  },
  lamCounterSteps: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: '1rem 0',
  },
  lamCounterChart: {
    margin: 0,
  },
  iconContainer: {
    marginRight: theme.spacing(0.5),
    paddingTop: theme.spacing(1),
  },
  yearText: {
    textAlign: 'center',
    margin: `${theme.spacing(1)} 0`,
  },
});

export default styles;
