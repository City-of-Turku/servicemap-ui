const styles = theme => ({
  button: {
    display: 'block',
    width: 'auto',
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    border: '1px solid #000000',
    textTransform: 'none',
    background: 'rgba(70, 72, 75, 255)',
    color: 'rgba(255, 255, 255, 255)',
    '&:hover': {
      color: 'rgba(255, 255, 255, 255)',
      background: 'rgba(62, 63, 66, 255)',
      cursor: 'pointer',
    },
  },
});

export default styles;
