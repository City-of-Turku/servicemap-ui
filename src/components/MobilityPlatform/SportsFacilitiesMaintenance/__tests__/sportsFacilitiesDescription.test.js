import {
  displayableConditionNote,
  getTranslatedUnitName,
  hasPopupDisplayValue,
  hideBrFromScreenReader,
  parseIceUnitDescription,
  parseSkiUnitDescription,
  sanitizeIceMaintenanceHtml,
} from '../sportsFacilitiesDescription';

describe('sportsFacilitiesDescription', () => {
  describe('getTranslatedUnitName', () => {
    it('returns locale-specific name when present', () => {
      expect(
        getTranslatedUnitName({
          name: 'X',
          name_fi: 'Fi',
          name_sv: 'Sv',
          name_en: 'En',
        }, 'sv'),
      ).toBe('Sv');
    });

    it('falls back to name', () => {
      expect(getTranslatedUnitName({ name: 'Only' }, 'fi')).toBe('Only');
    });
  });

  describe('parseSkiUnitDescription', () => {
    it('parses ski JSON', () => {
      const raw = JSON.stringify({
        length: '1,4',
        lights: '6-22',
        condition_note: 'Ok',
      });
      expect(parseSkiUnitDescription(raw)).toEqual({
        length: '1,4',
        lights: '6-22',
        condition_note: 'Ok',
      });
    });
  });

  describe('parseIceUnitDescription', () => {
    it('parses ice JSON with condition_note', () => {
      const raw = JSON.stringify({
        condition_note: 'Hyvä',
        description: '<p>Hi</p>',
      });
      expect(parseIceUnitDescription(raw).condition_note).toBe('Hyvä');
      expect(parseIceUnitDescription(raw).description).toBe('<p>Hi</p>');
    });

    it('accepts conditioned_note alias', () => {
      const raw = JSON.stringify({
        conditioned_note: 'Alias note',
        description: '',
      });
      expect(parseIceUnitDescription(raw).condition_note).toBe('Alias note');
    });

    it('treats non-JSON as legacy HTML description', () => {
      const out = parseIceUnitDescription('<p>Legacy</p>');
      expect(out.condition_note).toBeNull();
      expect(out.description).toBe('<p>Legacy</p>');
    });
  });

  describe('displayableConditionNote', () => {
    it('hides null string', () => {
      expect(displayableConditionNote('null')).toBeNull();
    });

    it('keeps real notes', () => {
      expect(displayableConditionNote('Latu ok')).toBe('Latu ok');
    });
  });

  describe('sanitizeIceMaintenanceHtml', () => {
    it('removes script tags', () => {
      expect(sanitizeIceMaintenanceHtml('<p>a</p><script>x</script>')).toBe('<p>a</p>');
    });

    it('strips inline handlers', () => {
      expect(sanitizeIceMaintenanceHtml('<p onclick="evil()">x</p>')).toBe('<p>x</p>');
    });
  });

  describe('hideBrFromScreenReader', () => {
    it('adds aria-hidden to br', () => {
      expect(hideBrFromScreenReader('a<br>b')).toContain('aria-hidden="true"');
    });
  });

  describe('hasPopupDisplayValue', () => {
    it('rejects blank strings', () => {
      expect(hasPopupDisplayValue('  ')).toBe(false);
    });

    it('accepts zero as text', () => {
      expect(hasPopupDisplayValue('0')).toBe(true);
    });
  });
});
