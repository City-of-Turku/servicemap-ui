import withPopupAboveIcon from '../popupAnchor';

describe('withPopupAboveIcon', () => {
  it('places the popup above a center-anchored icon', () => {
    expect(withPopupAboveIcon({ iconSize: [45, 45] }).popupAnchor).toEqual([0, -29]);
    expect(withPopupAboveIcon({ iconSize: [50, 56] }).popupAnchor).toEqual([0, -34]);
  });

  it('uses the given icon anchor', () => {
    expect(withPopupAboveIcon({ iconSize: [36, 36], iconAnchor: [14, 19] }).popupAnchor).toEqual([0, -25]);
  });

  it('keeps the other icon options', () => {
    expect(withPopupAboveIcon({ iconUrl: 'icon.svg', iconSize: [40, 40] }))
      .toEqual({ iconUrl: 'icon.svg', iconSize: [40, 40], popupAnchor: [0, -26] });
  });
});
