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

    it('should serialize single filter with single value (Unicode)', () => {
      const selected = { '1': ['101'] };
      const result = serializeFilters(selected, mockFilterParams);
      // "Dostupnosť" -> "Dostupnosť"
      // "Na sklade" -> "Na+sklade" (customEncode replaces space with +)
      // WAIT: In latest plan I REMOVED space->+ replacement from customEncode to let URLSearchParams handle it.
      // But URLSearchParams encodes space as +.
      // serializeFilters returns a string that IS PASSED to setSearchParams?
      // No, `serializeFilters` builds the value for `q`.
      // If `serializeFilters` returns "Na sklade" (with space),
      // `setSearchParams({ q: "Na sklade" })` -> URL `?q=Na+sklade`.

      // So `serializeFilters` output should contain SPACE if we removed replacement.
      expect(result).toBe('Dostupnosť-Na sklade');
    });

    it('should serialize single filter with multiple values', () => {
      const selected = { '2': ['201', '202'] };
      const result = serializeFilters(selected, mockFilterParams);
      // "Odtieň" -> "Odtieň"
      // "Hnedá" -> "Hnedá"
      expect(result).toBe('Odtieň-Blond,Hnedá');
    });

    it('should serialize multiple filters', () => {
      const selected = {
        '1': ['101'],
        '2': ['201', '202'],
      };
      const result = serializeFilters(selected, mockFilterParams);
      expect(result).toContain('Dostupnosť-Na sklade');
      expect(result).toContain('Odtieň-Blond,Hnedá');
      expect(result).toContain('/');
    });

    it('should handle special structural characters (escaped)', () => {
      // '3': 'Brand/Type' -> 'Brand%2FType'
      // Val: 'A/B' -> 'A%2FB'
      // Val: 'C,D' -> 'C%2CD'
      const selected = { '3': ['301', '302'] };
      const result = serializeFilters(selected, mockFilterParams);
      expect(result).toBe('Brand%2FType-A%2FB,C%2CD');
    });

    it('should handle hyphens in values', () => {
      // Val: 'Čierna-Matná' -> 'Čierna%2DMatná'
      const selected = { '2': ['203'] };
      const result = serializeFilters(selected, mockFilterParams);
      expect(result).toBe('Odtieň-Čierna%2DMatná');
    });

    it('should handle percentages', () => {
      // Val: '100% Cotton' -> '100%25 Cotton' (Space remains space)
      const selected = { '3': ['303'] };
      const result = serializeFilters(selected, mockFilterParams);
      expect(result).toBe('Brand%2FType-100%25 Cotton');
    });
  });

  describe('parseFilters', () => {
    it('should return empty object for empty string', () => {
      expect(parseFilters('', mockFilterParams)).toEqual({});
    });

    it('should parse Unicode names correctly', () => {
      // parseFilters receives the decoded string from searchParams (so space is space)
      const q = 'Dostupnosť-Na sklade';
      const result = parseFilters(q, mockFilterParams);
      expect(result).toEqual({ '1': ['101'] });
    });

    it('should parse single filter multiple values (Unicode)', () => {
      const q = 'Odtieň-Blond,Hnedá';
      const result = parseFilters(q, mockFilterParams);
      expect(result).toEqual({ '2': ['201', '202'] });
    });

    it('should parse multiple filters', () => {
      const q = 'Dostupnosť-Na sklade/Odtieň-Blond,Hnedá';
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
      const q = 'Odtieň-Čierna%2DMatná';
      const result = parseFilters(q, mockFilterParams);
      expect(result).toEqual({ '2': ['203'] });
    });

    it('should handle percentages', () => {
      const q = 'Brand%2FType-100%25 Cotton';
      const result = parseFilters(q, mockFilterParams);
      expect(result).toEqual({ '3': ['303'] });
    });

    it('should ignore invalid parameters or values', () => {
      const q = 'Invalid-Val/Dostupnosť-InvalidVal';
      const result = parseFilters(q, mockFilterParams);
      expect(result).toEqual({});
    });

    it('should be case insensitive for names', () => {
        const q = 'dostupnosť-na sklade';
        const result = parseFilters(q, mockFilterParams);
        expect(result).toEqual({ '1': ['101'] });
    });
  });
});
