// Contact Manager Utility
// Handles contact form submissions and data management

export const validateEmail = (email) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
};

export const validateName = (name) => {
    // Name must contain only letters and spaces, 2-50 characters
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    return nameRegex.test(name.trim());
};

export const validateMessage = (message) => {
    // Message must be at least 10 characters and max 1000 characters
    const trimmedMessage = message.trim();
    return trimmedMessage.length >= 10 && trimmedMessage.length <= 1000;
};

class ContactManager {
    constructor() {
        this.storageKey = 'semiconspace_contact_messages';
    }

    // Get all contact messages from localStorage
    getAllMessages() {
        try {
            const messages = localStorage.getItem(this.storageKey);
            return messages ? JSON.parse(messages) : [];
        } catch (error) {
            console.error('Error reading contact messages:', error);
            return [];
        }
    }

    // Save a new contact message
    saveContactMessage(name, email, message) {
        try {
            const messages = this.getAllMessages();

            const newMessage = {
                id: Date.now().toString(),
                name: name.trim(),
                email: email.trim().toLowerCase(),
                message: message.trim(),
                timestamp: new Date().toISOString(),
                status: 'pending' // Could be used for future functionality
            };

            messages.push(newMessage);

            // Keep only the last 100 messages to prevent localStorage overflow
            if (messages.length > 100) {
                messages.splice(0, messages.length - 100);
            }

            localStorage.setItem(this.storageKey, JSON.stringify(messages));

            console.log('Contact message saved successfully:', {
                id: newMessage.id,
                name: newMessage.name,
                email: newMessage.email,
                timestamp: newMessage.timestamp
            });

            return true;
        } catch (error) {
            console.error('Error saving contact message:', error);
            return false;
        }
    }

    // Check if email has sent a message recently (within last 24 hours)
    hasRecentMessage(email) {
        try {
            const messages = this.getAllMessages();
            const normalizedEmail = email.trim().toLowerCase();
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

            return messages.some(msg =>
                msg.email === normalizedEmail &&
                new Date(msg.timestamp) > twentyFourHoursAgo
            );
        } catch (error) {
            console.error('Error checking recent messages:', error);
            return false;
        }
    }

    // Get message count for email
    getMessageCount(email) {
        try {
            const messages = this.getAllMessages();
            const normalizedEmail = email.trim().toLowerCase();
            return messages.filter(msg => msg.email === normalizedEmail).length;
        } catch (error) {
            console.error('Error getting message count:', error);
            return 0;
        }
    }

    // Clear all messages (for admin use)
    clearAllMessages() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('All contact messages cleared');
            return true;
        } catch (error) {
            console.error('Error clearing messages:', error);
            return false;
        }
    }
}

// Export singleton instance
export default new ContactManager();