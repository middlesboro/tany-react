export const isValidName = (name) => {
    // Only characters, spaces, hyphens.
    // Supports Slovak characters.
    const regex = /^[a-zA-ZáäčďéíĺľňóôŕšťúýžÁÄČĎÉÍĹĽŇÓÔŔŠŤÚÝŽ\s-]+$/;
    return regex.test(name);
};

export const isValidSlovakPhone = (phone) => {
    // Expected format after stripping spaces:
    // +421XXXXXXXXX (13 chars)
    // 09XXXXXXXX (10 chars)
    // 02XXXXXXXX (landlines, 10 chars usually, but can vary? Standard is 10 for mobile/geo)
    // User requested "Valid slovak phone number".
    // Most common: +421 9xx xxx xxx or 09xx xxx xxx.
    const stripped = phone.replace(/\s+/g, '');

    // Starts with +421
    if (stripped.startsWith('+421')) {
        // +421 + 9 digits = 13 chars
        return /^\+421\d{9}$/.test(stripped);
    }
    // Starts with 0
    if (stripped.startsWith('0')) {
        // 0 + 9 digits = 10 chars
        return /^0\d{9}$/.test(stripped);
    }
    return false;
};

export const isValidSlovakZip = (zip) => {
    // Must be 5 digits.
    // The input sanitization handles stripping spaces.
    return /^\d{5}$/.test(zip);
};

export const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Simple list of common domains and typos
const COMMON_DOMAINS = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
    'icloud.com', 'azet.sk', 'centrum.sk', 'post.sk', 'seznam.cz'
];

export const checkEmailTypos = (email) => {
    const parts = email.split('@');
    if (parts.length !== 2) return null;

    const domain = parts[1].toLowerCase();

    // Direct match
    if (COMMON_DOMAINS.includes(domain)) return null;

    // Check for Levenshtein distance 1 (simple typos)
    for (const common of COMMON_DOMAINS) {
        if (getEditDistance(domain, common) === 1) {
            return `Mysleli ste ${parts[0]}@${common}?`;
        }
        // Specific check for missing letters like 'gail' instead of 'gmail' which is dist 1
        // 'gmai.com' -> 'gmail.com' (dist 1)
        // 'gnail.com' -> 'gmail.com' (dist 1)
    }

    return null;
};

// Levenshtein distance implementation
const getEditDistance = (a, b) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1 // deletion
                    )
                );
            }
        }
    }

    return matrix[b.length][a.length];
};
