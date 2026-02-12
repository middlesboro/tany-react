import React from 'react';
import { useModal } from '../context/ModalContext';

const MessageModal = () => {
  const { isMessageModalOpen, messageModalContent, closeMessageModal } = useModal();

  if (!isMessageModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={closeMessageModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 text-center">
            {/* Warning Icon - optional, but user asked for "nice popup" */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>

            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                {messageModalContent.title}
            </h3>
            <div className="mt-2">
                <p className="text-sm text-gray-500">
                    {messageModalContent.message}
                </p>
            </div>

            <div className="mt-6">
                <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-tany-green text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tany-green sm:text-sm transition-colors"
                    onClick={closeMessageModal}
                >
                    Zavrieť
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
