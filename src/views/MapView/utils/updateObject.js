/**
   * General function to update object values into state
   * @param {*string} key
   * @param {*Object} state
   * @param {*function} setState
   */
const toggleObjectValue = (key, state, setState) => {
  setState(prevState => ({
    ...prevState,
    [key]: !prevState[key],
  }));
};

export default toggleObjectValue;
