const styles = (theme) => ({
  popupInner: {
    borderRadius: '3px',
    marginBottom: '0.4rem',
    marginLeft: '0.6rem',
    lineHeight: 1.2,
    overflowX: 'hidden',
  },
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
  contentHeader: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(1.5),
    alignItems: 'flex-end',
    borderBottom: '2px solid gray',
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
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  parameterTypes: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: theme.spacing(0.75),
  },
  parameterTypeText: {
    fontWeight: 'bold',
    fontSize: '0.8rem',
    paddingTop: theme.spacing(0.5),
    paddingRight: theme.spacing(1),
  },
  buttonText: {
    fontSize: '0.75rem',
  },
  chartContainer: {
    margin: 0,
  },
  iconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 44, 115, 255)',
    color: '#fff',
    border: '1px solid gray',
    borderRadius: '5px',
    padding: theme.spacing(0.5),
    width: '30px',
    height: '30px',
  },
  dateStepsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: '1rem 0',
  },
});

export default styles;
