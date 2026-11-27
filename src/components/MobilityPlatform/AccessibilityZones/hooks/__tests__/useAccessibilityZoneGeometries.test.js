import React from 'react';
import { render, waitFor } from '@testing-library/react';
import useAccessibilityZoneGeometries from '../useAccessibilityZoneGeometries';
import { useMobilityPlatformContext } from '../../../../../context/MobilityPlatformContext';
import { fetchMobileUnitGeometries } from '../../../mobilityPlatformRequests/mobilityPlatformRequests';

jest.mock('../../../../../context/MobilityPlatformContext', () => ({
  useMobilityPlatformContext: jest.fn(),
}));
jest.mock('../../../mobilityPlatformRequests/mobilityPlatformRequests', () => ({
  fetchMobileUnitGeometries: jest.fn(),
}));

const coords = [[[60.1, 22.1], [60.2, 22.2], [60.3, 22.3]]];

const TestComponent = () => {
  useAccessibilityZoneGeometries();
  return null;
};

const renderWithSelections = selections => {
  const setSelections = jest.fn();
  useMobilityPlatformContext.mockReturnValue({
    accessibilityZoneSelections: selections,
    setAccessibilityZoneSelections: setSelections,
  });
  render(<TestComponent />);
  return setSelections;
};

describe('useAccessibilityZoneGeometries', () => {
  beforeEach(() => {
    fetchMobileUnitGeometries.mockReset();
  });

  it('adds the fetched geometries to the selected group and drops areas without geometry', async () => {
    fetchMobileUnitGeometries.mockResolvedValue([{ id: '1', geometry_coords: coords }]);
    const group = { id: 'busStopsWalking-Kauppatori', areas: [{ id: '1' }, { id: '2' }] };
    const other = { id: 'busStopsWalking-Kohmo', areas: [{ id: '3', geometry_coords: coords }] };
    const setSelections = renderWithSelections([group, other]);

    await waitFor(() => expect(setSelections).toHaveBeenCalledTimes(1));
    expect(fetchMobileUnitGeometries).toHaveBeenCalledTimes(1);
    expect(fetchMobileUnitGeometries.mock.calls[0][0]).toEqual(['1', '2']);

    const update = setSelections.mock.calls[0][0];
    expect(update([group, other])).toEqual([
      { ...group, areas: [{ id: '1', geometry_coords: coords }] },
      other,
    ]);
    // The group was deselected while fetching.
    expect(update([other])).toEqual([other]);
  });

  it('does not fetch groups that already have geometries', () => {
    renderWithSelections([{ id: 'a', areas: [{ id: '1', geometry_coords: coords }] }]);
    expect(fetchMobileUnitGeometries).not.toHaveBeenCalled();
  });
});
