export const sendAssistantMessage = async (message) => {
    try {
        const response = await fetch('/api/chat/assistant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error sending assistant message:', error);
        return { message: 'Sorry, something went wrong. Please try again later.' };
    }
};

export const sendSupportMessage = async (message) => {
    try {
        const response = await fetch('/api/chat/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error sending support message:', error);
        return { message: 'Sorry, something went wrong. Please try again later.' };
    }
};
