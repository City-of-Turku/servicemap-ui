const styles = theme => ({
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
