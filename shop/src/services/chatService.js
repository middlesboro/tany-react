export const sendAssistantMessage = async (message) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}${import.meta.env.VITE_API_URL}/chat/assistant`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            const error = new Error('Network response was not ok');
            error.status = response.status;
            throw error;
        }

        return await response.json();
    } catch (error) {
        console.error('Error sending assistant message:', error);
        return { message: 'Sorry, something went wrong. Please try again later.' };
    }
};

export const sendSupportMessage = async ({ message, email }) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}${import.meta.env.VITE_API_URL}/chat/message`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, email }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || 'Network response was not ok');
        error.status = response.status;
        throw error;
    }

    return await response.json();
};
