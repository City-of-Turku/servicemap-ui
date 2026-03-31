/**
 * Parse services_unit.description JSON for sports maintenance popups.
 * Ski: {"length":"","lights":"","condition_note":string|null}
 * Ice: {"condition_note"|"conditioned_note":string|null,"description":"..."} or legacy plain HTML.
 */

export function getTranslatedUnitName(unit, locale) {
  if (!unit) return '';
  const lang = (locale || 'fi').toString().split(/[-_]/)[0].toLowerCase();
  const byLang = {
    fi: unit.name_fi,
    sv: unit.name_sv,
    en: unit.name_en,
  };
  const preferred = byLang[lang];
  if (preferred != null && String(preferred).trim()) {
    return String(preferred).trim();
  }
  if (unit.name != null && String(unit.name).trim()) {
    return String(unit.name).trim();
  }
  return '';
}

export function hasPopupDisplayValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
}

/** Human-readable note; hides API junk like the literal string "null". */
export function displayableConditionNote(value) {
  if (!hasPopupDisplayValue(value)) return null;
  const t = String(value).trim();
  if (/^null$/i.test(t)) return null;
  return t;
}

function isSkiDescriptionShape(obj) {
  return (
    obj
    && typeof obj === 'object'
    && 'length' in obj
    && 'lights' in obj
    && 'condition_note' in obj
    && !('description' in obj)
  );
}

function isIceDescriptionShape(obj) {
  if (!obj || typeof obj !== 'object' || !('description' in obj)) {
    return false;
  }
  return 'condition_note' in obj || 'conditioned_note' in obj;
}

function iceConditionNoteFromObject(o) {
  const raw = o.condition_note ?? o.conditioned_note;
  if (raw === undefined || raw === null) {
    return null;
  }
  return String(raw);
}

export function parseSkiUnitDescription(descriptionStr) {
  const empty = { length: '', lights: '', condition_note: null };
  if (!descriptionStr || !String(descriptionStr).trim()) {
    return empty;
  }
  try {
    const o = JSON.parse(descriptionStr);
    if (isSkiDescriptionShape(o)) {
      return {
        length: o.length != null ? String(o.length) : '',
        lights: o.lights != null ? String(o.lights) : '',
        condition_note:
          o.condition_note === undefined || o.condition_note === null
            ? null
            : String(o.condition_note),
      };
    }
  } catch (e) {
    /* legacy or invalid */
  }
  return empty;
}

export function parseIceUnitDescription(descriptionStr) {
  const empty = { condition_note: null, description: '' };
  if (!descriptionStr || !String(descriptionStr).trim()) {
    return empty;
  }
  const raw = String(descriptionStr).trim();
  try {
    const o = JSON.parse(raw);
    if (isIceDescriptionShape(o)) {
      return {
        condition_note: iceConditionNoteFromObject(o),
        description: o.description != null ? String(o.description) : '',
      };
    }
  } catch (e) {
    /* legacy HTML stored as plain text */
  }
  return { condition_note: null, description: raw };
}

/**
 * Strip risky markup from maintenance API HTML (no DOMPurify in project).
 */
export function sanitizeIceMaintenanceHtml(html) {
  if (!html || typeof html !== 'string') return '';
  let s = html;
  s = s.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  s = s.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  s = s.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  return s;
}

export function hideBrFromScreenReader(html) {
  return html.replaceAll('<br>', '<br aria-hidden="true" />');
}
