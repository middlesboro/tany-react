import React, { useState } from 'react';
import { useCookieConsent } from '../context/CookieConsentContext';
import { useNavigate } from 'react-router-dom';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { openBanner } = useCookieConsent();
    const navigate = useNavigate();

    const handleOption = (option) => {
        if (option === 'consent') {
            openBanner();
            setIsOpen(false);
        } else if (option === 'status') {
            navigate('/account/orders');
            setIsOpen(false);
        }
    };

    return (
        <div className="fixed bottom-4 left-4 z-40 font-sans">
            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-16 left-0 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-[#1f7a4d] p-4 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C13.1046 2 14 2.89543 14 4V6H16C17.1046 6 18 6.89543 18 8V11H19C19.5523 11 20 11.4477 20 12V16C20 16.5523 19.5523 17 19 17H18V19C18 20.1046 17.1046 21 16 21H8C6.89543 21 6 20.1046 6 19V17H5C4.44772 17 4 16.5523 4 16V12C4 11.4477 4.44772 11 5 11H6V8C6 6.89543 6.89543 6 8 6H10V4C10 2.89543 10.8954 2 12 2ZM9 11C8.44772 11 8 11.4477 8 12C8 12.5523 8.44772 13 9 13C9.55228 13 10 12.5523 10 12C10 11.4477 9.55228 11 9 11ZM15 11C14.4477 11 14 11.4477 14 12C14 12.5523 14.4477 13 15 13C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11Z" fill="currentColor"/>
                                </svg>
                            </div>
                            <span className="font-bold">Tany</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 bg-gray-50">
                        <div className="bg-white p-3 rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl-none shadow-sm text-sm text-gray-700 mb-4 inline-block">
                            Ahoj, som Tany a môžem ti pomôcť s:
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={() => handleOption('consent')}
                                className="w-full text-left px-4 py-2.5 bg-white hover:bg-green-50 text-[#1f7a4d] border border-green-100 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-between group"
                            >
                                <span>Nastavenie cookies</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            <button
                                onClick={() => handleOption('status')}
                                className="w-full text-left px-4 py-2.5 bg-white hover:bg-green-50 text-[#1f7a4d] border border-green-100 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-between group"
                            >
                                <span>Stav objednávky</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
                    isOpen
                    ? 'bg-gray-100 text-gray-600 rotate-90'
                    : 'bg-[#1f7a4d] text-white hover:bg-[#16633d] hover:scale-105'
                }`}
                aria-label="Chatbot"
            >
                {isOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                ) : (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M12 2C13.1046 2 14 2.89543 14 4V6H16C17.1046 6 18 6.89543 18 8V11H19C19.5523 11 20 11.4477 20 12V16C20 16.5523 19.5523 17 19 17H18V19C18 20.1046 17.1046 21 16 21H8C6.89543 21 6 20.1046 6 19V17H5C4.44772 17 4 16.5523 4 16V12C4 11.4477 4.44772 11 5 11H6V8C6 6.89543 6.89543 6 8 6H10V4C10 2.89543 10.8954 2 12 2ZM9 11C8.44772 11 8 11.4477 8 12C8 12.5523 8.44772 13 9 13C9.55228 13 10 12.5523 10 12C10 11.4477 9.55228 11 9 11ZM15 11C14.4477 11 14 11.4477 14 12C14 12.5523 14.4477 13 15 13C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11Z" fill="currentColor"/>
                    </svg>
                )}
            </button>
        </div>
    );
};

export default ChatBot;
