/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { getRenderWithProviders } from '../../../../../jestUtils';
import ChoiceGroup from '../index';

const renderWithProviders = getRenderWithProviders({});

const options = [{ value: 'hour', label: 'Tunnit' }, { value: 'day', label: 'Päivät' }];

const renderGroup = props => renderWithProviders(
  <ChoiceGroup
    type="radio"
    name="test-steps"
    legend="Valitse graafissa näytettävä aika"
    options={options}
    isSelected={value => value === 'hour'}
    onChange={() => {}}
    renderOption={option => <span className="choice-face">{option.label}</span>}
    {...props}
  />,
);

describe('<ChoiceGroup />', () => {
  it('groups the options in a fieldset named by its legend', () => {
    renderGroup();
    expect(screen.getByRole('group', { name: 'Valitse graafissa näytettävä aika' })).toBeInTheDocument();
  });

  it('renders native inputs named by their visible label and reflects the selection', () => {
    renderGroup();
    expect(screen.getByRole('radio', { name: 'Tunnit' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Päivät' })).not.toBeChecked();
  });

  it('associates each label with its input through for and id', () => {
    const { container } = renderGroup();
    const radio = screen.getByRole('radio', { name: 'Tunnit' });
    expect(radio).toHaveAttribute('id', 'test-steps-hour');
    expect(container.querySelector('label[for="test-steps-hour"]')).toContainElement(radio);
  });

  it('reports the chosen value', () => {
    const onChange = jest.fn();
    renderGroup({ onChange });
    fireEvent.click(screen.getByText('Päivät'));
    expect(onChange).toHaveBeenCalledWith('day');
  });

  it('renders checkboxes when type is checkbox', () => {
    renderGroup({ type: 'checkbox' });
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
  });
});
