import React from 'react';

/**
 * Converts URLs in a text string into clickable React Link components.
 *
 * @param {string} text The text to process.
 * @param {string} className Optional className for the anchor tags.
 * @returns {React.ReactNode[]} An array of strings and JSX elements.
 */
export const linkify = (text, className = "text-blue-600 underline hover:text-blue-800") => {
    if (!text) return [];

    // URL regex pattern to match http and https links
    // This is a simple pattern and might need adjustment for complex URLs,
    // but works for standard http/https links.
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
        if (part.match(urlRegex)) {
            return (
                <a
                    key={index}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                    onClick={(e) => e.stopPropagation()} // Prevent bubbling if necessary
                >
                    {part}
                </a>
            );
        }
        return part;
    }).filter(part => part !== ""); // Filter out empty strings
};
