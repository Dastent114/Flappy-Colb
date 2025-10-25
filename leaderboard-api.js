// GitHub Token-based Leaderboard API
class LeaderboardAPI {
    constructor() {
        // GitHub репозиторий для хранения данных
        this.githubRepo = 'Flappy-Colb';
        this.githubOwner = 'Dastent114';
        this.dataFile = 'leaderboard.json';
        this.localStorageKey = 'flappyColbLeaderboard';
        this.maxEntries = 10;
        
        // GitHub API URL
        this.apiUrl = `https://api.github.com/repos/${this.githubOwner}/${this.githubRepo}/contents/${this.dataFile}`;
        
        // GitHub токен (будет установлен через setToken)
        this.githubToken = null;
        this.isConfigured = false;
    }
    
    // Установить GitHub токен
    setToken(token) {
        this.githubToken = token;
        this.isConfigured = true;
        console.log('GitHub token set, API configured');
    }

    // Получить лидерборд
    async getLeaderboard() {
        // Если токен не настроен, используем только localStorage
        if (!this.isConfigured) {
            const localData = localStorage.getItem(this.localStorageKey);
            const leaderboard = localData ? JSON.parse(localData) : [];
            console.log('Using localStorage (GitHub not configured):', leaderboard);
            return leaderboard;
        }

        try {
            // Попытка получить с GitHub
            const response = await fetch(this.apiUrl, {
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const content = JSON.parse(atob(data.content));
                console.log('Loaded leaderboard from GitHub:', content);
                
                // Синхронизируем с localStorage
                localStorage.setItem(this.localStorageKey, JSON.stringify(content.leaderboard || []));
                
                return content.leaderboard || [];
            }
        } catch (error) {
            console.log('GitHub API unavailable, using local storage');
        }

        // Fallback на localStorage
        const localData = localStorage.getItem(this.localStorageKey);
        const leaderboard = localData ? JSON.parse(localData) : [];
        
        console.log('Loading leaderboard from localStorage:', leaderboard);
        return leaderboard;
    }

    // Сохранить результат
    async saveScore(playerName, score) {
        const newEntry = {
            name: playerName,
            score: score,
            date: new Date().toISOString(),
            id: Date.now() + Math.random()
        };

        console.log('Saving score:', newEntry);

        // Получаем текущий лидерборд
        const leaderboard = await this.getLeaderboard();
        
        // Проверяем, есть ли уже запись с таким именем
        const existingIndex = leaderboard.findIndex(entry => 
            entry.name.toLowerCase() === playerName.toLowerCase()
        );
        
        if (existingIndex !== -1) {
            // Обновляем существующую запись, если новый результат лучше
            if (score > leaderboard[existingIndex].score) {
                leaderboard[existingIndex] = newEntry;
                console.log('Updated existing player record');
            } else {
                console.log('New score is not better, keeping old record');
                return true;
            }
        } else {
            // Добавляем новую запись
            leaderboard.push(newEntry);
            console.log('Added new player record');
        }
        
        // Сортировка по очкам (убывание)
        leaderboard.sort((a, b) => b.score - a.score);
        
        // Оставляем только топ-10
        const topScores = leaderboard.slice(0, this.maxEntries);
        
        // Сохраняем в localStorage как fallback
        localStorage.setItem(this.localStorageKey, JSON.stringify(topScores));
        console.log('Leaderboard saved to localStorage:', topScores);
        
        // Попытка сохранить на GitHub
        if (this.isConfigured) {
            try {
                await this.saveToGitHub(topScores);
            } catch (error) {
                console.log('Could not save to GitHub:', error);
            }
        }
        
        return true;
    }

    // Сохранить на GitHub
    async saveToGitHub(leaderboard) {
        const data = {
            leaderboard: leaderboard,
            lastUpdated: new Date().toISOString()
        };
        
        const content = btoa(JSON.stringify(data, null, 2));
        
        try {
            // Сначала получаем текущий файл для получения SHA
            const getResponse = await fetch(this.apiUrl, {
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            let sha = null;
            if (getResponse.ok) {
                const fileData = await getResponse.json();
                sha = fileData.sha;
            }
            
            // Обновляем файл
            const updateResponse = await fetch(this.apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Update leaderboard - ${new Date().toISOString()}`,
                    content: content,
                    sha: sha
                })
            });
            
            if (updateResponse.ok) {
                console.log('Successfully saved to GitHub');
                return true;
            } else {
                throw new Error('Failed to save to GitHub');
            }
        } catch (error) {
            console.error('Error saving to GitHub:', error);
            throw error;
        }
    }

    // Получить топ игроков
    async getTopPlayers(limit = 10) {
        const leaderboard = await this.getLeaderboard();
        return leaderboard.slice(0, limit);
    }

    // Проверить, является ли результат рекордом
    async isHighScore(score) {
        const leaderboard = await this.getLeaderboard();
        if (leaderboard.length < this.maxEntries) {
            return true;
        }
        return score > leaderboard[leaderboard.length - 1].score;
    }

    // Очистить дубликаты
    async cleanDuplicates() {
        const leaderboard = await this.getLeaderboard();
        const uniquePlayers = new Map();
        
        leaderboard.forEach(entry => {
            const key = entry.name.toLowerCase();
            if (!uniquePlayers.has(key) || entry.score > uniquePlayers.get(key).score) {
                uniquePlayers.set(key, entry);
            }
        });
        
        const cleaned = Array.from(uniquePlayers.values())
            .sort((a, b) => b.score - a.score)
            .slice(0, this.maxEntries);
        
        localStorage.setItem(this.localStorageKey, JSON.stringify(cleaned));
        console.log('Cleaned duplicates, new leaderboard:', cleaned);
        
        return cleaned;
    }
}

// Экспорт для использования в игре
window.LeaderboardAPI = LeaderboardAPI;