import React, { createContext, useContext, useState, useEffect } from 'react';
import { initGA, initGoogleAds } from '../utils/analytics';

const CookieConsentContext = createContext();

export const useCookieConsent = () => {
    return useContext(CookieConsentContext);
};

export const CookieConsentProvider = ({ children }) => {
    const [consent, setConsent] = useState(null); // null = not yet decided
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const storedConsent = localStorage.getItem('cookie_consent');
        if (storedConsent) {
            const parsedConsent = JSON.parse(storedConsent);
            setConsent(parsedConsent);

            // Apply consents on load
            if (parsedConsent.analytics) {
                initGA();
            }
            if (parsedConsent.marketing) {
                initGoogleAds();
            }
        } else {
            // First visit
            setShowBanner(true);
        }
    }, []);

    const updateConsent = (newConsent) => {
        const finalConsent = {
            necessary: true, // Always true
            analytics: newConsent.analytics || false,
            marketing: newConsent.marketing || false
        };

        setConsent(finalConsent);
        localStorage.setItem('cookie_consent', JSON.stringify(finalConsent));
        setShowBanner(false);

        // Initialize scripts based on new consent
        if (finalConsent.analytics) {
            initGA();
        }
        if (finalConsent.marketing) {
            initGoogleAds();
        }
    };

    const acceptAll = () => {
        updateConsent({ analytics: true, marketing: true });
    };

    const acceptRequired = () => {
        updateConsent({ analytics: false, marketing: false });
    };

    const declineAll = () => {
        updateConsent({ analytics: false, marketing: false });
    };

    const openBanner = () => {
        setShowBanner(true);
    };

    return (
        <CookieConsentContext.Provider value={{
            consent,
            showBanner,
            updateConsent,
            acceptAll,
            acceptRequired,
            declineAll,
            openBanner,
            setShowBanner
        }}>
            {children}
        </CookieConsentContext.Provider>
    );
};
