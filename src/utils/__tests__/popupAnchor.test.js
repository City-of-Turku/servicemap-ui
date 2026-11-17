import getPopupAnchor from '../popupAnchor';

describe('getPopupAnchor', () => {
  it('places the popup above a center-anchored icon', () => {
    expect(getPopupAnchor([45, 45])).toEqual([0, -29]);
    expect(getPopupAnchor([50, 56])).toEqual([0, -34]);
  });

  it('uses the given icon anchor', () => {
    expect(getPopupAnchor([36, 36], [14, 19])).toEqual([0, -25]);
  });
});
