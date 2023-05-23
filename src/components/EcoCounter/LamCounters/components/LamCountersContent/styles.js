const styles = {
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
    padding: '0.3rem',
  },
  buttonWhite: {
    backgroundColor: '#fff',
    border: '1px solid gray',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '0.75rem',
    padding: '0.3rem',
  },
  buttonActive: {
    backgroundColor: 'rgba(7, 44, 115, 255)',
    color: '#fff',
    border: '1px solid gray',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '0.75rem',
    padding: '0.3rem',
  },
  lamCounterHeader: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '0.35rem',
    marginBottom: '0.75rem',
    borderBottom: '2px solid gray',
    width: '95%',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  headerSubtitle: {
    marginBlockStart: '1rem',
    marginBlockEnd: '0.1rem',
    fontWeight: 'bold',
  },
  headerDate: {
    marginLeft: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  lamCounterDatePicker: {
    width: '75%',
    marginRight: 'auto',
  },
  lamCounterUserTypes: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '0.3rem',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '0.7rem',
    alignItems: 'center',
  },
  textContainer: {
    width: '40px',
    marginRight: '0.75rem',
  },
  iconWrapper: {
    backgroundColor: 'rgba(7, 44, 115, 255)',
    color: '#fff',
    border: '1px solid gray',
    borderRadius: '5px',
    marginRight: '0.75rem',
    padding: '0.3rem',
  },
  userTypeText: {
    fontWeight: 'bold',
    paddingTop: '0.3rem',
    paddingRight: '0.6rem',
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
    marginRight: '0.3rem',
    paddingTop: '0.6rem',
  },
};

export default styles;
