const styles = theme => ({
  topBarColor: {
    background: theme.palette.backgroundTurku.main,
  },
  button: {
    width: '100%',
    height: '50px',
    background: 'rgba(245, 245, 245, 255)',
    textTransform: 'none',
    justifyContent: 'flex-start',
    borderRadius: '0',
    borderTop: 'none',
    borderBottom: '1px solid #000000',
    '&:hover': {
      background: 'rgba(230, 230, 230, 255)',
    },
  },
  buttonActive: {
    width: '100%',
    height: '50px',
    textTransform: 'none',
    justifyContent: 'flex-start',
    borderRadius: '0',
    borderTop: '1px solid #6f7276',
    borderBottom: '1px solid #6f7276',
    background: '#46484b',
    color: '#fff',
    '&:hover': {
      color: '#fff',
      background: '#3e3f42',
      borderBottom: '1px solid #6f7276',
      borderTop: '1px solid #6f7276',
    },
  },
  buttonSmall: {
    width: '100%',
    height: '40px',
    background: 'rgba(230, 230, 230, 255)',
    textTransform: 'none',
    justifyContent: 'center',
    borderRadius: '0',
    borderTop: 'none',
    borderBottom: '1px solid #000000',
    '&:hover': {
      background: 'rgba(222, 222, 222, 255)',
    },
  },
  buttonSmallActive: {
    width: '100%',
    height: '40px',
    textTransform: 'none',
    justifyContent: 'center',
    borderRadius: '0',
    borderBottom: '1px solid #6f7276',
    borderTop: '1px solid #6f7276',
    background: '#46484b',
    color: '#fff',
    '&:hover': {
      color: '#fff',
      background: '#3e3f42',
      borderBottom: '1px solid #6f7276',
      borderTop: '1px solid #6f7276',
    },
  },
  buttonContainer: {
    '&:first-child': {
      borderTop: 'none',
    },
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
    textTransform: 'capitalize',
  },
  iconActive: {
    fill: '#fff',
    width: '40px',
    height: '40px',
    marginRight: '0.8rem',
  },
  icon: {
    fill: '#000',
    width: '40px',
    height: '40px',
    marginRight: '0.8rem',
  },
  paragraph: {
    padding: theme.spacing(2),
  },
  border: {
    borderTop: '1px solid #6f7276',
    borderBottom: '1px solid #6f7276',
  },
});

export default styles;
