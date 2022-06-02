const styles = theme => ({
  topBarColor: {
    background: theme.palette.background.main,
  },
  button: {
    width: '100%',
    height: '3.125rem',
    background: 'rgba(245, 245, 245, 255)',
    textTransform: 'capitalize',
    justifyContent: 'flex-start',
    borderRadius: '0',
    borderTop: 'none',
    borderBottom: '1px solid #000000',
    '&:hover': {
      background: 'rgba(230, 230, 230, 255)',
    },
  },
  active: {
    borderBottom: '1px solid #6f7276',
    borderTop: '1px solid #6f7276',
    background: 'rgba(70, 72, 75, 255)',
    color: '#fff',
    '&:hover': {
      color: '#fff',
      background: '#3e3f42',
      borderBottom: '1px solid #6f7276',
      borderTop: '1px solid #6f7276',
    },
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
  formLabel: {
    padding: '0.4rem 3.5rem',
    backgroundColor: 'rgba(70,72,75,255)',
    margin: '0',
    color: '#fff',
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
  buttonList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'left',
  },
  checkBoxContainer: {
    width: '100%',
    borderBottom: '1px solid #6f7276',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
  },
});

export default styles;
