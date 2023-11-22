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
  buttonText: {
    fontSize: '0.75rem',
  },
});

export default styles;
