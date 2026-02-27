import React, { useState, useRef, useEffect } from 'react';
import { useCookieConsent } from '../context/CookieConsentContext';
import { useNavigate } from 'react-router-dom';
import { sendAssistantMessage, sendSupportMessage } from '../services/chatService';
import { linkify } from '../utils/textUtils';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState('MENU'); // 'MENU', 'ORDER_STATUS', 'CONTACT_SUPPORT'
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // New state for support flow
    const [supportStep, setSupportStep] = useState('INIT'); // 'INIT', 'MESSAGE', 'EMAIL'
    const [supportData, setSupportData] = useState({ message: '', email: '' });

    const messagesEndRef = useRef(null);
    const { openBanner } = useCookieConsent();
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, view]);

    const handleOption = (option) => {
        if (option === 'consent') {
            openBanner();
            setIsOpen(false);
        } else if (option === 'status') {
            setView('ORDER_STATUS');
            setMessages([
                { type: 'bot', text: 'Prosím zadajte identifikátor objednávky a email alebo telefónne číslo.' }
            ]);
        } else if (option === 'support') {
            setView('CONTACT_SUPPORT');
            setSupportStep('MESSAGE');
            setMessages([
                { type: 'bot', text: 'Napíšte nám správu a budeme Vás čím skôr kontaktovať.' }
            ]);
        }
    };

    const handleBack = () => {
        setView('MENU');
        setMessages([]);
        setInputValue('');
        setSupportStep('INIT');
        setSupportData({ message: '', email: '' });
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage = inputValue;
        setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
        setInputValue('');

        if (view === 'CONTACT_SUPPORT') {
            if (supportStep === 'MESSAGE') {
                setSupportData(prev => ({ ...prev, message: userMessage }));
                setMessages(prev => [...prev, { type: 'bot', text: 'Ďakujeme. Prosím, zadajte váš email, aby sme vás mohli kontaktovať.' }]);
                setSupportStep('EMAIL');
                return;
            } else if (supportStep === 'EMAIL') {
                setSupportData(prev => ({ ...prev, email: userMessage }));
                // Proceed to send with both message and email
            }
        }

        setIsLoading(true);

        try {
            let response;
            if (view === 'ORDER_STATUS') {
                response = await sendAssistantMessage(userMessage);

                if (response && response.response) {
                    setMessages(prev => [...prev, { type: 'bot', text: response.response }]);
                    if (view === 'CONTACT_SUPPORT') {
                        // Reset support flow after successful submission or keep conversation open?
                        // For now, let's reset the step to allow new messages or end conversation
                        setSupportStep('DONE');
                    }
                } else {
                    setMessages(prev => [...prev, { type: 'bot', text: 'Prepáčte, nerozumel som.' }]);
                }

            } else if (view === 'CONTACT_SUPPORT' && supportStep === 'EMAIL') {
                response = await sendSupportMessage({
                    message: supportData.message,
                    email: userMessage
                });

                if (response) {
                    setMessages(prev => [...prev, { type: 'bot', text: 'Ďakujeme za kontaktovanie podpory. Odpovieme vám čo najskôr.' }]);
                } else {
                    setMessages(prev => [...prev, {
                        type: 'bot',
                        text: 'Nastala chyba pri odosielaní správy. Skúste to prosím znovu alebo neskôr.'
                    }]);
                }
            }


        } catch (error) {
            setMessages(prev => [...prev, { type: 'bot', text: 'Nastala chyba pri komunikácii.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-4 left-4 z-[9999] font-sans">
            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-16 left-0 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up flex flex-col max-h-[600px] h-[500px]">
                    {/* Header */}
                    <div className="bg-[#1f7a4d] p-4 text-white flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                             {view !== 'MENU' && (
                                <button
                                    onClick={handleBack}
                                    className="mr-2 hover:bg-white/20 p-1 rounded-full transition-colors"
                                    aria-label="Späť"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                                    </svg>
                                </button>
                            )}
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
                            aria-label="Zavrieť"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col">
                        {view === 'MENU' ? (
                            <>
                                <div className="bg-white p-3 rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl-none shadow-sm text-sm text-gray-700 mb-4 inline-block self-start max-w-[85%]">
                                    Ahoj, som Tany a môžem Vám pomôcť s Vašimi objednávkami, nastavením cookies alebo kontaktovaním podpory. Vyberte si, s čím Vám môžem pomôcť:
                                </div>
                                <div className="space-y-2 mt-auto">
                                    <button
                                        onClick={() => handleOption('consent')}
                                        className="w-full text-left px-4 py-3 bg-white hover:bg-green-50 text-[#1f7a4d] border border-green-100 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-between group"
                                    >
                                        <span>Nastavenie cookies</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleOption('status')}
                                        className="w-full text-left px-4 py-3 bg-white hover:bg-green-50 text-[#1f7a4d] border border-green-100 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-between group"
                                    >
                                        <span>Stav objednávky</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleOption('support')}
                                        className="w-full text-left px-4 py-3 bg-white hover:bg-green-50 text-[#1f7a4d] border border-green-100 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-between group"
                                    >
                                        <span>Kontaktovať podporu</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col gap-3 min-h-0">
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`max-w-[85%] p-3 text-sm shadow-sm ${
                                            msg.type === 'user'
                                            ? 'bg-[#1f7a4d] text-white self-end rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-none'
                                            : 'bg-white text-gray-700 self-start rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl-none'
                                        }`}
                                    >
                                        {linkify(msg.text, msg.type === 'user' ? "text-white underline hover:text-gray-200" : "text-blue-600 underline hover:text-blue-800")}
                                    </div>
                                ))}
                                {isLoading && (
                                     <div className="bg-white p-3 rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl-none shadow-sm text-sm text-gray-500 self-start w-16 flex justify-center">
                                        <span className="animate-pulse">...</span>
                                     </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Input Area (Only for chat views) */}
                    {view !== 'MENU' && (
                        <div className="p-3 bg-white border-t border-gray-100 shrink-0">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={
                                        view === 'ORDER_STATUS' ? "Číslo objednávky..." :
                                        view === 'CONTACT_SUPPORT' && supportStep === 'EMAIL' ? "Váš email..." :
                                        "Napíšte správu..."
                                    }
                                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1f7a4d]/20 focus:border-[#1f7a4d]"
                                    autoFocus
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || isLoading}
                                    className="w-10 h-10 bg-[#1f7a4d] text-white rounded-full flex items-center justify-center hover:bg-[#16633d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Odoslať"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
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
