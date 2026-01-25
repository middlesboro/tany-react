import { serializeFilters, parseFilters } from './filterUrlUtils';

const mockFilterParams = [
  {
    id: '1',
    name: 'Dostupnosť',
    values: [
      { id: '101', name: 'Na sklade' },
      { id: '102', name: 'Vypredané' },
    ],
  },
  {
    id: '2',
    name: 'Odtieň',
    values: [
      { id: '201', name: 'Blond' },
      { id: '202', name: 'Hnedá' },
      { id: '203', name: 'Čierna-Matná' }, // Test hyphen inside value
      { id: '204', name: 'Špeciálny' }, // Test diacritics
    ],
  },
  {
    id: '3',
    name: 'Brand/Type',
    values: [
      { id: '301', name: 'A/B' },
      { id: '302', name: 'C,D' }, // Test comma inside value
      { id: '303', name: '100% Cotton' }, // Test percent
    ],
  },
];

describe('filterUrlUtils', () => {
  describe('serializeFilters', () => {
    it('should return empty string if no filters selected', () => {
      expect(serializeFilters({}, mockFilterParams)).toBe('');
    });

    it('should serialize single filter with single value (removing diacritics)', () => {
      const selected = { '1': ['101'] };
      const result = serializeFilters(selected, mockFilterParams);
      // "Dostupnosť" -> "Dostupnost"
      // "Na sklade" -> "Na sklade"
      expect(result).toBe('Dostupnost-Na sklade');
    });

    it('should serialize single filter with multiple values (removing diacritics)', () => {
      const selected = { '2': ['201', '202'] };
      const result = serializeFilters(selected, mockFilterParams);
      // "Odtieň" -> "Odtienc"
      // "Blond", "Hnedá" -> "Blond", "Hneda"
      expect(result).toBe('Odtien-Blond,Hneda');
    });

    it('should serialize values with strong diacritics', () => {
      const selected = { '2': ['204'] };
      const result = serializeFilters(selected, mockFilterParams);
      // "Špeciálny" -> "Specialny"
      expect(result).toBe('Odtien-Specialny');
    });

    it('should serialize multiple filters', () => {
      const selected = {
        '1': ['101'],
        '2': ['201', '202'],
      };
      const result = serializeFilters(selected, mockFilterParams);
      expect(result).toContain('Dostupnost-Na sklade');
      expect(result).toContain('Odtien-Blond,Hneda');
      expect(result).toContain('/');
    });

    it('should handle special structural characters (escaped)', () => {
      const selected = { '3': ['301', '302'] };
      const result = serializeFilters(selected, mockFilterParams);
      expect(result).toBe('Brand%2FType-A%2FB,C%2CD');
    });

    it('should handle hyphens in values', () => {
      // Val: 'Čierna-Matná' -> 'Cierna-Matna' -> 'Cierna%2DMatna'
      const selected = { '2': ['203'] };
      const result = serializeFilters(selected, mockFilterParams);
      expect(result).toBe('Odtien-Cierna%2DMatna');
    });
  });

  describe('parseFilters', () => {
    it('should return empty object for empty string', () => {
      expect(parseFilters('', mockFilterParams)).toEqual({});
    });

    it('should parse normalized names back to original IDs', () => {
      const q = 'Dostupnost-Na sklade';
      const result = parseFilters(q, mockFilterParams);
      expect(result).toEqual({ '1': ['101'] });
    });

    it('should parse single filter multiple values (normalized)', () => {
      const q = 'Odtien-Blond,Hneda';
      const result = parseFilters(q, mockFilterParams);
      expect(result).toEqual({ '2': ['201', '202'] });
    });

    it('should parse values with strong diacritics removed', () => {
      const q = 'Odtien-Specialny';
      const result = parseFilters(q, mockFilterParams);
      expect(result).toEqual({ '2': ['204'] });
    });

    it('should parse multiple filters', () => {
      const q = 'Dostupnost-Na sklade/Odtien-Blond,Hneda';
      const result = parseFilters(q, mockFilterParams);
      expect(result).toEqual({
        '1': ['101'],
        '2': ['201', '202'],
      });
    });

    it('should handle special structural characters', () => {
      const q = 'Brand%2FType-A%2FB,C%2CD';
      const result = parseFilters(q, mockFilterParams);
      expect(result).toEqual({ '3': ['301', '302'] });
    });

    it('should handle hyphens in values', () => {
      const q = 'Odtien-Cierna%2DMatna';
      const result = parseFilters(q, mockFilterParams);
      expect(result).toEqual({ '2': ['203'] });
    });

    it('should ignore invalid parameters or values', () => {
      const q = 'Invalid-Val/Dostupnost-InvalidVal';
      const result = parseFilters(q, mockFilterParams);
      expect(result).toEqual({});
    });

    it('should be case insensitive for names', () => {
        const q = 'dostupnost-na sklade';
        const result = parseFilters(q, mockFilterParams);
        expect(result).toEqual({ '1': ['101'] });
    });
  });
});
