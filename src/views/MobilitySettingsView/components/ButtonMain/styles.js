const styles = theme => ({
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
});

export default styles;
