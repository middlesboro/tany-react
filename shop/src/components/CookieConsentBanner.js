import React, { useState, useEffect } from 'react';
import { useCookieConsent } from '../context/CookieConsentContext';

const CookieConsentBanner = () => {
    const { showBanner, consent, acceptAll, acceptRequired, declineAll, updateConsent, openBanner, setShowBanner } = useCookieConsent();
    const [isCustomizing, setIsCustomizing] = useState(false);
    const [preferences, setPreferences] = useState({
        analytics: false,
        marketing: false
    });

    // Sync preferences with current consent when customizing starts
    useEffect(() => {
        if (consent) {
            setPreferences({
                analytics: consent.analytics,
                marketing: consent.marketing
            });
        }
    }, [consent, isCustomizing]);

    if (!showBanner) {
        // Render the floating "manage cookies" button
        return (
            <button
                onClick={openBanner}
                className="fixed bottom-4 left-4 z-50 p-3 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors group"
                aria-label="Nastavenia cookies"
                title="Nastavenia cookies"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-600 group-hover:text-[#1f7a4d]">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 11.5373 21.3065 11.4608 21.0672 11.8519C20.5634 12.6752 19.6584 13.2353 18.625 13.2353C16.9676 13.2353 15.625 11.8926 15.625 10.2353C15.625 9.20194 16.1851 8.29694 17.0084 7.79308C17.3995 7.55383 17.323 6.86029 16.8603 6.86029C11.3374 6.86029 6.86029 11.3374 6.86029 16.8603C6.86029 17.323 7.55383 17.3995 7.79308 17.0084C8.29694 16.1851 9.20194 15.625 10.2353 15.625C11.8926 15.625 13.2353 16.9676 13.2353 18.625C13.2353 19.6584 12.6752 20.5634 11.8519 21.0672C11.4608 21.3065 11.5373 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
        );
    }

    const handleSavePreferences = () => {
        updateConsent(preferences);
        setIsCustomizing(false);
    };

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 p-4 md:p-6 bg-white border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.1)] animate-slide-up">
            <div className="max-w-7xl mx-auto">
                {!isCustomizing ? (
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Vaše súkromie je pre nás dôležité</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Používame súbory cookie na zlepšenie vášho zážitku z prehliadania, zobrazovanie prispôsobeného obsahu a reklám a na analýzu našej návštevnosti. Kliknutím na „Prijať všetko“ súhlasíte s používaním súborov cookie.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            <button
                                onClick={() => setIsCustomizing(true)}
                                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1f7a4d] transition-colors whitespace-nowrap"
                            >
                                Nastavenia
                            </button>
                            <button
                                onClick={declineAll}
                                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1f7a4d] transition-colors whitespace-nowrap"
                            >
                                Odmietnuť
                            </button>
                            <button
                                onClick={acceptAll}
                                className="px-6 py-2.5 text-sm font-bold text-white bg-[#1f7a4d] rounded-lg hover:bg-[#16633d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1f7a4d] transition-colors whitespace-nowrap shadow-sm"
                            >
                                Prijať všetko
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                            <h3 className="text-lg font-bold text-gray-900">Nastavenia súborov cookie</h3>
                            <button
                                onClick={() => setIsCustomizing(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4 mb-8">
                            {/* Necessary */}
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="necessary"
                                        type="checkbox"
                                        checked={true}
                                        disabled
                                        className="focus:ring-[#1f7a4d] h-4 w-4 text-[#1f7a4d] border-gray-300 rounded opacity-50 cursor-not-allowed"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="necessary" className="font-medium text-gray-700">Nevyhnutné</label>
                                    <p className="text-gray-500 text-xs mt-1">Tieto súbory cookie sú potrebné pre fungovanie webovej stránky a nemožno ich vypnúť.</p>
                                </div>
                            </div>

                            {/* Analytics */}
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="analytics"
                                        type="checkbox"
                                        checked={preferences.analytics}
                                        onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})}
                                        className="focus:ring-[#1f7a4d] h-4 w-4 text-[#1f7a4d] border-gray-300 rounded cursor-pointer"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="analytics" className="font-medium text-gray-700">Analytické</label>
                                    <p className="text-gray-500 text-xs mt-1">Pomáhajú nám pochopiť, ako návštevníci interagujú s webovou stránkou zbieraním a hlásením informácií anonymne.</p>
                                </div>
                            </div>

                            {/* Marketing */}
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="marketing"
                                        type="checkbox"
                                        checked={preferences.marketing}
                                        onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})}
                                        className="focus:ring-[#1f7a4d] h-4 w-4 text-[#1f7a4d] border-gray-300 rounded cursor-pointer"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="marketing" className="font-medium text-gray-700">Marketingové</label>
                                    <p className="text-gray-500 text-xs mt-1">Používajú sa na sledovanie návštevníkov naprieč webovými stránkami s cieľom zobrazovať relevantné reklamy.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                             <button
                                onClick={() => setIsCustomizing(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1f7a4d]"
                            >
                                Späť
                            </button>
                            <button
                                onClick={handleSavePreferences}
                                className="px-6 py-2 text-sm font-bold text-white bg-[#1f7a4d] rounded-lg hover:bg-[#16633d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1f7a4d]"
                            >
                                Uložiť nastavenia
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CookieConsentBanner;
