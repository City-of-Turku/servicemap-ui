import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { makeStyles } from '@mui/styles';
import ThemeWrapper from '../ThemeWrapper';

const mockStore = configureStore([]);
const store = mockStore({ user: { theme: 'default' } });

const useStyles = makeStyles({ map: { height: '100%' } });

const StyledChild = () => {
  const classes = useStyles();
  return <div data-testid="styled" className={classes.map} />;
};

const renderApp = label => (
  <Provider store={store}>
    <ThemeWrapper>
      <span>{label}</span>
      <StyledChild />
    </ThemeWrapper>
  </Provider>
);

describe('<ThemeWrapper />', () => {
  it('keeps @mui/styles class names when the app re-renders', () => {
    const { getByTestId, rerender } = render(renderApp('first'));
    const classBefore = getByTestId('styled').className;

    rerender(renderApp('second'));

    expect(getByTestId('styled').className).toBe(classBefore);
  });
});
