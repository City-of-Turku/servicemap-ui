import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const List = ({ input }) => (
  <ul>
    {input.map(item => (
      <li key={item}>
        <Typography variant="body2">{item}</Typography>
      </li>
    ))}
  </ul>
);

List.propTypes = {
  input: PropTypes.arrayOf(PropTypes.any),
};

List.defaultProps = {
  input: null,
};

export default List;
