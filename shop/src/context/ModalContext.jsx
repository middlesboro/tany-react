import React, { createContext, useContext, useState, useEffect } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginMessage, setLoginMessage] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({ title: '', message: '' });

  const openLoginModal = (message = null) => {
    if (typeof message !== 'string') {
      message = null;
    }
    setLoginMessage(message);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginMessage(null);
  };

  const openMessageModal = (title, message) => {
    setMessageModalContent({ title, message });
    setIsMessageModalOpen(true);
  };

  const closeMessageModal = () => {
    setIsMessageModalOpen(false);
    setMessageModalContent({ title: '', message: '' });
  };

  useEffect(() => {
    const handleAuthError = () => {
      openLoginModal("Pre túto akciu sa musíte prihlásiť.");
    };

    window.addEventListener('auth_error', handleAuthError);

    return () => {
      window.removeEventListener('auth_error', handleAuthError);
    };
  }, []);

  return (
    <ModalContext.Provider value={{
      isLoginModalOpen,
      loginMessage,
      openLoginModal,
      closeLoginModal,
      isMessageModalOpen,
      messageModalContent,
      openMessageModal,
      closeMessageModal
    }}>
      {children}
    </ModalContext.Provider>
  );
};
