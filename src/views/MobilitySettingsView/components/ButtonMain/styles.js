const styles = theme => ({
  button: {
    color: 'rgba(0, 0, 0, 255)',
    width: '100%',
    height: '3.125rem',
    background: 'rgba(245, 245, 245, 255)',
    textTransform: 'none',
    justifyContent: 'flex-start',
    borderRadius: '0',
    borderTop: '1px solid rgba(0, 0, 0, 255)',
    borderBottom: 'none',
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
