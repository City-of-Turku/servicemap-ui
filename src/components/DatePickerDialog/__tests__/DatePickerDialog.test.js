/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  fireEvent, screen, waitFor, within,
} from '@testing-library/react';
import { getRenderWithProviders } from '../../../../jestUtils';
import DatePickerDialog from '../index';

const renderWithProviders = getRenderWithProviders({ user: { locale: 'fi' } });

const defaultProps = {
  value: new Date(2024, 2, 15),
  minDate: new Date(2020, 0, 1),
  maxDate: new Date(2024, 11, 31),
  buttonLabel: 'Valitse graafin päivämäärä, nykyinen:',
  dialogTitle: 'Valitse graafin päivämäärä',
};

const renderPicker = (props) => {
  const onChange = jest.fn();
  renderWithProviders(<DatePickerDialog onChange={onChange} {...defaultProps} {...props} />);
  return { onChange };
};

const openDialog = () => {
  fireEvent.click(screen.getByRole('button', { name: /Valitse graafin päivämäärä, nykyinen/ }));
  return screen.getByRole('dialog', { name: 'Valitse graafin päivämäärä' });
};

describe('<DatePickerDialog />', () => {
  it('names the open button with its purpose and the current date', () => {
    renderPicker();
    const button = screen.getByRole('button', {
      name: 'Valitse graafin päivämäärä, nykyinen: 15.3.2024',
    });
    expect(button).toHaveAttribute('aria-haspopup', 'dialog');
  });

  it('opens a modal dialog and moves focus to the selected day', async () => {
    renderPicker();
    const dialog = openDialog();

    expect(within(dialog).getByRole('grid')).toBeInTheDocument();
    const selectedDay = within(dialog).getByRole('gridcell', { selected: true });
    expect(selectedDay).toHaveTextContent('15');
    await waitFor(() => expect(selectedDay).toHaveFocus());
  });

  it('uses Finnish names for the calendar controls', () => {
    renderPicker();
    const dialog = openDialog();

    expect(within(dialog).getByRole('button', { name: 'Edellinen kuukausi' })).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Seuraava kuukausi' })).toBeInTheDocument();
    expect(within(dialog).getByRole('columnheader', { name: 'maanantai' })).toBeInTheDocument();
  });

  it('closes from the close button and returns focus to the open button', async () => {
    const focusSpy = jest.spyOn(HTMLElement.prototype, 'focus');
    renderPicker();
    const dialog = openDialog();

    fireEvent.click(within(dialog).getByRole('button', { name: 'Sulje' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    const openButton = screen.getByRole('button', { name: /nykyinen/ });
    await waitFor(() => expect(openButton).toHaveFocus());
    expect(focusSpy).toHaveBeenLastCalledWith({ preventScroll: true });
    focusSpy.mockRestore();
  });

  it('closes with the Escape key', async () => {
    renderPicker();
    const dialog = openDialog();

    fireEvent.keyDown(dialog, { key: 'Escape' });

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('calls onChange with the chosen day and closes', async () => {
    const { onChange } = renderPicker();
    const dialog = openDialog();

    fireEvent.click(within(dialog).getByRole('gridcell', { name: '20' }));

    expect(onChange).toHaveBeenCalledWith(new Date(2024, 2, 20));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('moves to the chosen year without selecting a day in it', async () => {
    const { onChange } = renderPicker();
    const dialog = openDialog();

    fireEvent.click(within(dialog).getByRole('button', { name: /kalenterinäkymä on auki/ }));
    fireEvent.click(within(dialog).getByRole('radio', { name: '2022' }));

    await waitFor(() => {
      const grids = within(dialog).getAllByRole('grid');
      expect(grids).toHaveLength(1);
      expect(within(grids[0]).getByRole('gridcell', { name: '1' }))
        .toHaveAttribute('data-timestamp', String(new Date(2022, 2, 1).getTime()));
    });
    expect(within(dialog).queryByRole('gridcell', { selected: true })).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('hides the year view when year selection is disabled', () => {
    renderPicker({ showYearSelection: false });
    const dialog = openDialog();

    expect(within(dialog).queryByRole('button', { name: /kalenterinäkymä on auki/ })).not.toBeInTheDocument();
  });

  it('follows a value changed from outside while open', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { rerender } = renderWithProviders(
      <DatePickerDialog onChange={() => {}} {...defaultProps} />,
    );
    const dialog = openDialog();

    rerender(<DatePickerDialog onChange={() => {}} {...defaultProps} value={new Date(2024, 4, 8)} />);

    const grid = await within(dialog).findByRole('grid', { name: 'toukokuu 2024' });
    expect(within(grid).getByRole('gridcell', { selected: true })).toHaveTextContent('8');
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('renders without a date when the value is invalid', () => {
    renderPicker({ value: new Date(''), minDate: new Date(''), maxDate: new Date('') });

    expect(screen.getByRole('button', { name: 'Valitse graafin päivämäärä, nykyinen:' })).toBeInTheDocument();
  });
});
