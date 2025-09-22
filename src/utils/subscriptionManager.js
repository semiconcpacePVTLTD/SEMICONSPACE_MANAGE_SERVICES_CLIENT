/**
 * Subscription Manager Utility
 * Handles email subscription storage in browser localStorage
 */

export class SubscriptionManager {
    static STORAGE_KEY = 'newsletter_subscriptions';

    /**
     * Save email subscription to localStorage
     * @param {string} email - User email address
     * @returns {Promise<boolean>} - Success status
     */
    static async saveSubscription(email) {
        try {
            // Validate email first
            if (!validateEmail(email)) {
                throw new Error('Invalid email format');
            }

            const cleanEmail = email.trim().toLowerCase();

            // Check if email already exists
            const isAlreadySubscribed = await this.isEmailSubscribed(cleanEmail);
            if (isAlreadySubscribed) {
                return false; // Email already exists
            }

            const subscription = {
                email: cleanEmail,
                timestamp: new Date().toISOString(),
                id: this.generateId(),
                source: 'footer_newsletter'
            };

            // Save to localStorage
            this.saveToStorage(subscription);
            return true;

        } catch (error) {
            console.error('Error saving subscription:', error);
            return false;
        }
    }

    /**
     * Check if email already exists in localStorage
     * @param {string} email - Email to check
     * @returns {Promise<boolean>} - Whether email exists
     */
    static async isEmailSubscribed(email) {
        try {
            const subscriptions = this.getStoredSubscriptions();
            return subscriptions.some(sub => sub.email === email.trim().toLowerCase());
        } catch (error) {
            console.error('Error checking email subscription:', error);
            return false;
        }
    }

    /**
     * Save subscription to localStorage
     * @param {object} subscription - Subscription object
     */
    static saveToStorage(subscription) {
        try {
            const existingSubscriptions = this.getStoredSubscriptions();
            existingSubscriptions.push(subscription);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingSubscriptions));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            throw error;
        }
    }

    /**
     * Get stored subscriptions from localStorage
     * @returns {Array} - Array of subscription objects
     */
    static getStoredSubscriptions() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error reading stored subscriptions:', error);
            return [];
        }
    }

    /**
     * Get all subscriptions
     * @returns {Promise<Array>} - Array of subscription objects
     */
    static async getAllSubscriptions() {
        return this.getStoredSubscriptions();
    }

    /**
     * Generate unique ID for subscription
     * @returns {string} - Unique identifier
     */
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Get total subscription count
     * @returns {Promise<number>} - Total number of subscriptions
     */
    static async getSubscriptionCount() {
        return this.getStoredSubscriptions().length;
    }

    /**
     * Clear all subscriptions (admin function)
     * @returns {boolean} - Success status
     */
    static clearAllSubscriptions() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing subscriptions:', error);
            return false;
        }
    }

    /**
     * Export subscriptions as downloadable text file
     * @returns {boolean} - Success status
     */
    static exportSubscriptions() {
        try {
            const subscriptions = this.getStoredSubscriptions();

            if (subscriptions.length === 0) {
                alert('No subscriptions to export!');
                return false;
            }

            const content = [
                '--- Newsletter Subscriptions ---',
                `Generated: ${new Date().toISOString()}`,
                `Total Subscriptions: ${subscriptions.length}`,
                '---',
                ...subscriptions.map(sub =>
                    `${sub.timestamp} | ${sub.email} | ID: ${sub.id} | Source: ${sub.source || 'unknown'}`
                )
            ].join('\n');

            // Create and download file
            const blob = new Blob([content], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `newsletter_subscriptions_${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            return true;
        } catch (error) {
            console.error('Error exporting subscriptions:', error);
            return false;
        }
    }
}

// Email validation utility
export const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
};

export default SubscriptionManager;