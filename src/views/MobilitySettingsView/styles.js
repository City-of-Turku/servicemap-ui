const styles = theme => ({
  topBarColor: {
    background: theme.palette.background.main,
  },
  buttonSmall: {
    width: '27%',
    margin: theme.spacing(1),
    border: '1px solid #000000',
    textTransform: 'none',
  },
  buttonSmallActive: {
    width: '27%',
    margin: theme.spacing(1),
    border: '1px solid #000000',
    textTransform: 'none',
    background: '#46484b',
    color: '#fff',
    '&:hover': {
      color: '#fff',
      background: '#3e3f42',
    },
  },
  toggleText: {
    width: '85%',
    textAlign: 'left',
  },
  formControl: {
    width: '100%',
  },
  formGroup: {
    marginTop: '0',
  },
  subtitle: {
    textTransform: 'none',
  },
  iconActive: {
    fill: '#fff',
    width: '40px',
    height: '40px',
    marginRight: theme.spacing(1),
  },
  icon: {
    fill: '#000',
    width: '40px',
    height: '40px',
    marginRight: theme.spacing(1),
  },
  paragraph: {
    textAlign: 'left',
    padding: theme.spacing(1.5),
  },
  border: {
    borderBottom: '1px solid #6f7276',
  },
  margin: {
    marginLeft: theme.spacing(4),
  },
  marginSm: {
    marginLeft: theme.spacing(0.7),
  },
  buttonList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'left',
  },
  listItem: {
    padding: 0,
    minHeight: theme.spacing(7),
  },
  checkBoxContainer: {
    width: '100%',
    borderBottom: '1px solid #6f7276',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
  },
  checkBoxItem: {
    width: '100%',
    backgroundColor: 'rgb(250, 250, 250)',
  },
  flexBox: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(1),
  },
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '1.5rem',
    height: '1.5rem',
  },
  black: {
    backgroundColor: 'rgba(0, 0, 0,255)',
  },
  green: {
    backgroundColor: 'rgba(15, 115, 6, 255)',
  },
  blue: {
    backgroundColor: 'rgba(7, 44, 115, 255)',
  },
  purple: {
    backgroundColor: 'rgba(202, 15, 212, 255)',
  },
  burgundy: {
    backgroundColor: 'rgba(128, 0, 32, 255)',
  },
  white: {
    width: '50%',
    height: '50%',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 255)',
  },
});

export default styles;
