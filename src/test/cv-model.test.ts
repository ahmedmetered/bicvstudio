import { describe, expect, it } from 'vitest';
import { accents, createSample, formatDate, moveEntry, restoreStudio } from '@/lib/cv-model';

describe('CV builder rules', () => {
  it('starts with fictional content in both languages', () => {
    const sample = createSample();
    expect(sample.documents.en.name).toBe('Alex Morgan');
    expect(sample.documents.ar.name).toBe('أليكس مورغان');
    expect(sample.documents.en.experience).toHaveLength(2);
    expect(sample.documents.ar.experience).toHaveLength(2);
  });
  it('offers exactly the six requested accent choices', () => {
    expect(accents).toEqual(['indigo', 'teal', 'coral', 'emerald', 'amber', 'rose']);
  });
  it('restores all CV fields, photos, language, accent and template from browser storage', () => {
    const sample = createSample(); sample.language = 'ar'; sample.template = 'creative'; sample.accent = 'teal';
    sample.documents.ar.photo = 'data:image/png;base64,cGhvdG8=';
    sample.documents.ar.name = 'ليلى';
    expect(restoreStudio(JSON.stringify(sample))).toEqual(sample);
  });
  it('reorders work entries without losing data', () => {
    const entries = createSample().documents.en.experience;
    expect(moveEntry(entries, 1, -1).map(e => e.id)).toEqual(['e2', 'e1']);
    expect(moveEntry(entries, 0, -1)).toEqual(entries);
  });
  it('localizes dates and current employment', () => {
    expect(formatDate('2022-03', 'en')).toBe('Mar 2022');
    expect(formatDate('2022-03', 'ar')).toMatch(/مارس/);
    expect(formatDate('', 'en')).toBe('Present');
    expect(formatDate('', 'ar')).toBe('حتى الآن');
  });
  it('recovers from invalid browser data', () => {
    expect(restoreStudio('{bad')).toEqual(createSample());
    expect(restoreStudio('{}')).toEqual(createSample());
  });
});