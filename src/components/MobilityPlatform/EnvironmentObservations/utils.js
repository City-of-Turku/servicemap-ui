const renderFixedDecimals = (measurementVal) => {
  if (!Number.isInteger(measurementVal)) {
    return measurementVal.toFixed(2);
  }
  return measurementVal;
};

export default renderFixedDecimals;
