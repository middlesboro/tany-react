import React, { useContext } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CookieConsentProvider, useCookieConsent } from './CookieConsentContext';
import * as analyticsUtils from '../utils/analytics';

// Mock analytics utils
vi.mock('../utils/analytics', () => ({
    initGA: vi.fn(),
    initGoogleAds: vi.fn(),
}));

// Test component to access context
const TestComponent = () => {
    const { showBanner, consent, acceptAll, acceptRequired, updateConsent } = useCookieConsent();
    return (
        <div>
            {showBanner && <div data-testid="banner">Banner Visible</div>}
            <div data-testid="consent-state">{JSON.stringify(consent)}</div>
            <button onClick={acceptAll}>Accept All</button>
            <button onClick={acceptRequired}>Accept Required</button>
            <button onClick={() => updateConsent({ analytics: true, marketing: false })}>Accept Custom</button>
        </div>
    );
};

describe('CookieConsentContext', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    test('shows banner on first visit (no localStorage)', () => {
        render(
            <CookieConsentProvider>
                <TestComponent />
            </CookieConsentProvider>
        );
        expect(screen.getByTestId('banner')).toBeInTheDocument();
        expect(screen.getByTestId('consent-state')).toHaveTextContent('null');
    });

    test('acceptAll sets all consents and initializes scripts', () => {
        render(
            <CookieConsentProvider>
                <TestComponent />
            </CookieConsentProvider>
        );

        fireEvent.click(screen.getByText('Accept All'));

        expect(screen.queryByTestId('banner')).not.toBeInTheDocument();

        const consent = JSON.parse(screen.getByTestId('consent-state').textContent);
        expect(consent.necessary).toBe(true);
        expect(consent.analytics).toBe(true);
        expect(consent.marketing).toBe(true);

        expect(analyticsUtils.initGA).toHaveBeenCalled();
        expect(analyticsUtils.initGoogleAds).toHaveBeenCalled();

        expect(JSON.parse(localStorage.getItem('cookie_consent'))).toEqual(consent);
    });

    test('acceptRequired sets only necessary consent', () => {
        render(
            <CookieConsentProvider>
                <TestComponent />
            </CookieConsentProvider>
        );

        fireEvent.click(screen.getByText('Accept Required'));

        const consent = JSON.parse(screen.getByTestId('consent-state').textContent);
        expect(consent.necessary).toBe(true);
        expect(consent.analytics).toBe(false);
        expect(consent.marketing).toBe(false);

        expect(analyticsUtils.initGA).not.toHaveBeenCalled();
        expect(analyticsUtils.initGoogleAds).not.toHaveBeenCalled();
    });

    test('loads consent from localStorage on mount', () => {
        const storedConsent = { necessary: true, analytics: true, marketing: false };
        localStorage.setItem('cookie_consent', JSON.stringify(storedConsent));

        render(
            <CookieConsentProvider>
                <TestComponent />
            </CookieConsentProvider>
        );

        expect(screen.queryByTestId('banner')).not.toBeInTheDocument();
        expect(screen.getByTestId('consent-state')).toHaveTextContent(JSON.stringify(storedConsent));

        // Check if initGA is called because analytics is true
        expect(analyticsUtils.initGA).toHaveBeenCalled();
        expect(analyticsUtils.initGoogleAds).not.toHaveBeenCalled();
    });
});
