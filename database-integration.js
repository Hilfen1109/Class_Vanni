// Database Integration Module for Class Vanni
// This module prepares the app for future database integration

class DatabaseIntegration {
    constructor() {
        this.apiBaseUrl = 'https://api.classvanni.com'; // Replace with actual API URL
        this.isOnline = navigator.onLine;
        this.syncQueue = [];

        this.init();
    }

    init() {
        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncPendingData();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
        });

        // Check if user is registered and sync data
        this.syncUserData();
    }

    // User Management
    async createUser(userData) {
        if (!this.isOnline) {
            this.queueForSync('createUser', userData);
            return this.saveToLocalStorage(userData);
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const user = await response.json();
                this.saveToLocalStorage(user);
                return user;
            }
        } catch (error) {
            console.error('Error creating user:', error);
            this.queueForSync('createUser', userData);
            return this.saveToLocalStorage(userData);
        }
    }

    async updateUser(userId, userData) {
        if (!this.isOnline) {
            this.queueForSync('updateUser', {userId, userData});
            return this.saveToLocalStorage(userData);
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const user = await response.json();
                this.saveToLocalStorage(user);
                return user;
            }
        } catch (error) {
            console.error('Error updating user:', error);
            this.queueForSync('updateUser', {userId, userData});
            return this.saveToLocalStorage(userData);
        }
    }

    async getUser(userId) {
        if (!this.isOnline) {
            return this.getFromLocalStorage('userData');
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/users/${userId}`);
            if (response.ok) {
                const user = await response.json();
                this.saveToLocalStorage(user);
                return user;
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            return this.getFromLocalStorage('userData');
        }
    }

    // Progress Management
    async saveProgress(progressData) {
        if (!this.isOnline) {
            this.queueForSync('saveProgress', progressData);
            return this.saveToLocalStorage(progressData, 'userProgress');
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(progressData)
            });

            if (response.ok) {
                const progress = await response.json();
                this.saveToLocalStorage(progress, 'userProgress');
                return progress;
            }
        } catch (error) {
            console.error('Error saving progress:', error);
            this.queueForSync('saveProgress', progressData);
            return this.saveToLocalStorage(progressData, 'userProgress');
        }
    }

    async getProgress(userId) {
        if (!this.isOnline) {
            return this.getFromLocalStorage('userProgress');
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/progress/${userId}`);
            if (response.ok) {
                const progress = await response.json();
                this.saveToLocalStorage(progress, 'userProgress');
                return progress;
            }
        } catch (error) {
            console.error('Error fetching progress:', error);
            return this.getFromLocalStorage('userProgress');
        }
    }

    // Ranking Management
    async getRanking() {
        if (!this.isOnline) {
            return this.getFromLocalStorage('userRanking') || [];
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/ranking`);
            if (response.ok) {
                const ranking = await response.json();
                this.saveToLocalStorage(ranking, 'userRanking');
                return ranking;
            }
        } catch (error) {
            console.error('Error fetching ranking:', error);
            return this.getFromLocalStorage('userRanking') || [];
        }
    }

    async updateRanking(userData) {
        if (!this.isOnline) {
            this.queueForSync('updateRanking', userData);
            return this.updateLocalRanking(userData);
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/ranking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const ranking = await response.json();
                this.saveToLocalStorage(ranking, 'userRanking');
                return ranking;
            }
        } catch (error) {
            console.error('Error updating ranking:', error);
            this.queueForSync('updateRanking', userData);
            return this.updateLocalRanking(userData);
        }
    }

    // Analytics and Statistics
    async trackEvent(eventType, eventData) {
        const event = {
            type: eventType,
            data: eventData,
            timestamp: new Date().toISOString(),
            userId: this.getCurrentUserId()
        };

        if (!this.isOnline) {
            this.queueForSync('trackEvent', event);
            return;
        }

        try {
            await fetch(`${this.apiBaseUrl}/analytics`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event)
            });
        } catch (error) {
            console.error('Error tracking event:', error);
            this.queueForSync('trackEvent', event);
        }
    }

    // Sync Management
    queueForSync(operation, data) {
        this.syncQueue.push({
            operation,
            data,
            timestamp: new Date().toISOString()
        });

        // Save queue to localStorage
        localStorage.setItem('syncQueue', JSON.stringify(this.syncQueue));
    }

    async syncPendingData() {
        if (!this.isOnline || this.syncQueue.length === 0) return;

        const queue = [...this.syncQueue];
        this.syncQueue = [];

        for (const item of queue) {
            try {
                await this.processSyncItem(item);
            } catch (error) {
                console.error('Error syncing item:', error);
                // Re-queue failed items
                this.syncQueue.push(item);
            }
        }

        // Save updated queue
        localStorage.setItem('syncQueue', JSON.stringify(this.syncQueue));
    }

    async processSyncItem(item) {
        switch (item.operation) {
            case 'createUser':
                return this.createUser(item.data);
            case 'updateUser':
                return this.updateUser(item.data.userId, item.data.userData);
            case 'saveProgress':
                return this.saveProgress(item.data);
            case 'updateRanking':
                return this.updateRanking(item.data);
            case 'trackEvent':
                return this.trackEvent(item.data.type, item.data.data);
        }
    }

    // Local Storage Helpers
    saveToLocalStorage(data, key = 'userData') {
        localStorage.setItem(key, JSON.stringify(data));
        return data;
    }

    getFromLocalStorage(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    updateLocalRanking(userData) {
        const ranking = this.getFromLocalStorage('userRanking') || [];
        const userIndex = ranking.findIndex(user => user.id === userData.id);

        if (userIndex !== -1) {
            ranking[userIndex] = {...ranking[userIndex], ...userData};
        } else {
            ranking.push(userData);
        }

        // Sort by XP
        ranking.sort((a, b) => b.xp - a.xp);

        this.saveToLocalStorage(ranking, 'userRanking');
        return ranking;
    }

    getCurrentUserId() {
        const userData = this.getFromLocalStorage('userData');
        return userData ? userData.id : null;
    }

    // Sync user data on app start
    async syncUserData() {
        const userId = this.getCurrentUserId();
        if (userId) {
            await this.getUser(userId);
            await this.getProgress(userId);
            await this.getRanking();
        }
    }
}

// Initialize database integration
window.databaseIntegration = new DatabaseIntegration();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DatabaseIntegration;
}
