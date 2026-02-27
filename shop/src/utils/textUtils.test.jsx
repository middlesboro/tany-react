import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { linkify } from './textUtils';
import React from 'react';

describe('linkify utility', () => {
    it('should return empty array for empty input', () => {
        expect(linkify('')).toEqual([]);
        expect(linkify(null)).toEqual([]);
    });

    it('should return plain text array for text without URLs', () => {
        const text = 'Hello world';
        const result = linkify(text);
        expect(result).toHaveLength(1);
        expect(result[0]).toBe('Hello world');
    });

    it('should linkify a simple URL', () => {
        const text = 'Check this https://test.sk link';
        const result = linkify(text);

        // "Check this ", "https://test.sk", " link"
        // But the split regex keeps the separator, so it splits by the URL.
        // It should result in ["Check this ", Element(a), " link"]

        expect(result).toHaveLength(3);
        expect(result[0]).toBe('Check this ');
        expect(result[2]).toBe(' link');

        const { container } = render(<div>{result}</div>);
        const anchor = container.querySelector('a');
        expect(anchor).toBeInTheDocument();
        expect(anchor).toHaveAttribute('href', 'https://test.sk');
        expect(anchor).toHaveAttribute('target', '_blank');
        expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
        expect(anchor.textContent).toBe('https://test.sk');
    });

    it('should linkify multiple URLs', () => {
        const text = 'Visit https://google.com and http://example.org';
        const result = linkify(text);

        // "Visit ", "https://google.com", " and ", "http://example.org", "" (empty string at end maybe? or just nothing)

        const { container } = render(<div>{result}</div>);
        const anchors = container.querySelectorAll('a');
        expect(anchors).toHaveLength(2);
        expect(anchors[0]).toHaveAttribute('href', 'https://google.com');
        expect(anchors[1]).toHaveAttribute('href', 'http://example.org');
    });

    it('should apply custom className', () => {
        const text = 'https://test.sk';
        const customClass = 'my-custom-class';
        const result = linkify(text, customClass);

        const { container } = render(<div>{result}</div>);
        const anchor = container.querySelector('a');
        expect(anchor).toHaveClass('my-custom-class');
    });

    it('should handle URL at the beginning', () => {
        const text = 'https://start.com is here';
        const result = linkify(text);
        expect(result[0].type).toBe('a');
    });
});
