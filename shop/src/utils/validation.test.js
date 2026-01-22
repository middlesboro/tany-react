import { isValidName, isValidSlovakPhone, isValidSlovakZip, isValidEmail, checkEmailTypos } from './validation';

describe('Validation Utils', () => {
    describe('isValidName', () => {
        it('should validate correct names', () => {
            expect(isValidName('Ján')).toBe(true);
            expect(isValidName('Jozef')).toBe(true);
            expect(isValidName('Anna-Mária')).toBe(true);
            expect(isValidName('O\'Connor')).toBe(false); // Current regex doesn't support apostrophe, should it? User said "just characters". Regex has hyphen.
            // Let's stick to what I implemented: characters, spaces, hyphens.
            expect(isValidName('Jean Luc')).toBe(true);
        });

        it('should invalidate numbers and special chars', () => {
            expect(isValidName('Jan123')).toBe(false);
            expect(isValidName('Jan!')).toBe(false);
        });
    });

    describe('isValidSlovakPhone', () => {
        it('should validate +421 mobile', () => {
            expect(isValidSlovakPhone('+421901123456')).toBe(true);
            expect(isValidSlovakPhone('+421 901 123 456')).toBe(true);
        });
        it('should validate 09 mobile', () => {
            expect(isValidSlovakPhone('0901123456')).toBe(true);
            expect(isValidSlovakPhone('0901 123 456')).toBe(true);
        });
        it('should invalidate foreign or incorrect', () => {
            expect(isValidSlovakPhone('+420123456789')).toBe(false);
            expect(isValidSlovakPhone('0800123')).toBe(false); // Too short
            expect(isValidSlovakPhone('abc')).toBe(false);
        });
    });

    describe('isValidSlovakZip', () => {
        it('should validate 5 digits', () => {
            expect(isValidSlovakZip('12345')).toBe(true);
        });
        it('should invalidate non-5 digits', () => {
            expect(isValidSlovakZip('1234')).toBe(false);
            expect(isValidSlovakZip('123456')).toBe(false);
            expect(isValidSlovakZip('abc')).toBe(false);
        });
    });

    describe('isValidEmail', () => {
        it('should validate correct email', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
        });
        it('should invalidate incorrect email', () => {
            expect(isValidEmail('test')).toBe(false);
            expect(isValidEmail('test@')).toBe(false);
            expect(isValidEmail('@example.com')).toBe(false);
        });
    });

    describe('checkEmailTypos', () => {
        it('should return null for common domains', () => {
            expect(checkEmailTypos('user@gmail.com')).toBeNull();
            expect(checkEmailTypos('user@azet.sk')).toBeNull();
        });
        it('should suggest correction for typos', () => {
            expect(checkEmailTypos('user@gail.com')).toContain('gmail.com');
            expect(checkEmailTypos('user@gnail.com')).toContain('gmail.com');
            expect(checkEmailTypos('user@yaho.com')).toContain('yahoo.com');
        });
    });
});
