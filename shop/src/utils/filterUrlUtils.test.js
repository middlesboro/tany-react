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
    ],
  },
  {
    id: '3',
    name: 'Brand/Type',
    values: [
      { id: '301', name: 'A/B' },
      { id: '302', name: 'C-D' },
    ],
  },
];

describe('filterUrlUtils', () => {
  describe('serializeFilters', () => {
    it('should return empty string if no filters selected', () => {
      expect(serializeFilters({}, mockFilterParams)).toBe('');
    });

    it('should serialize single filter with single value', () => {
      const selected = { '1': ['101'] };
      const result = serializeFilters(selected, mockFilterParams);
      // "Dostupnosť" -> "Dostupnos%C5%A5"
      // "Na sklade" -> "Na+sklade"
      expect(result).toBe('Dostupnos%C5%A5-Na+sklade');
    });

    it('should serialize single filter with multiple values', () => {
      const selected = { '2': ['201', '202'] };
      const result = serializeFilters(selected, mockFilterParams);
      // "Odtieň" -> "Odtie%C5%88"
      // "Hnedá" -> "Hned%C3%A1"
      expect(result).toBe('Odtie%C5%88-Blond,Hned%C3%A1');
    });

    it('should serialize multiple filters', () => {
      const selected = {
        '1': ['101'],
        '2': ['201', '202'],
      };
      const result = serializeFilters(selected, mockFilterParams);
      // Order depends on Object.keys iteration, usually insertion order or numeric.
      // IDs are '1' and '2', likely '1' comes first.
      expect(result).toContain('Dostupnos%C5%A5-Na+sklade');
      expect(result).toContain('Odtie%C5%88-Blond,Hned%C3%A1');
      expect(result).toContain('/');
    });

    it('should handle special characters correctly', () => {
      const selected = { '3': ['301', '302'] };
      const result = serializeFilters(selected, mockFilterParams);
      // Brand/Type -> Brand%2FType
      // A/B -> A%2FB
      // C-D -> C-D (minus is not encoded by encodeURIComponent usually, but checked)
      expect(result).toBe('Brand%2FType-A%2FB,C-D');
    });
  });

  describe('parseFilters', () => {
    it('should return empty object for empty string', () => {
      expect(parseFilters('', mockFilterParams)).toEqual({});
    });

    it('should parse single filter single value', () => {
      const q = 'Dostupnosť-Na+sklade';
      const result = parseFilters(q, mockFilterParams);
      expect(result).toEqual({ '1': ['101'] });
    });

    it('should parse single filter multiple values', () => {
      const q = 'Odtieň-Blond,Hnedá';
      const result = parseFilters(q, mockFilterParams);
      expect(result).toEqual({ '2': ['201', '202'] });
    });

    it('should parse multiple filters', () => {
      const q = 'Dostupnosť-Na+sklade/Odtieň-Blond,Hnedá';
      const result = parseFilters(q, mockFilterParams);
      expect(result).toEqual({
        '1': ['101'],
        '2': ['201', '202'],
      });
    });

    it('should handle special characters', () => {
      const q = 'Brand%2FType-A%2FB,C-D';
      const result = parseFilters(q, mockFilterParams);
      expect(result).toEqual({ '3': ['301', '302'] });
    });

    it('should ignore invalid parameters or values', () => {
      const q = 'Invalid-Val/Dostupnosť-InvalidVal';
      const result = parseFilters(q, mockFilterParams);
      expect(result).toEqual({});
    });

    it('should be case insensitive for names', () => {
        const q = 'dostupnosť-na+sklade';
        const result = parseFilters(q, mockFilterParams);
        expect(result).toEqual({ '1': ['101'] });
    });
  });
});
