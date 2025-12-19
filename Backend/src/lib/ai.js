import Sentiment from 'sentiment';
import axios from 'axios';

const sentiment = new Sentiment();

// Sentiment Analysis
export const analyzeSentiment = (text) => {
    const result = sentiment.analyze(text);
    let sentimentType = 'neutral';
    
    if (result.score > 0) {
        sentimentType = 'positive';
    } else if (result.score < 0) {
        sentimentType = 'negative';
    }
    
    return {
        sentiment: sentimentType,
        score: result.score,
        comparative: result.comparative
    };
};

// AI Message Suggestions (using free API)
export const getMessageSuggestions = async (context) => {
    try {
        // Free suggestion patterns based on context
        const suggestions = [];
        
        const contextLower = context.toLowerCase();
        
        if (contextLower.includes('hello') || contextLower.includes('hi')) {
            suggestions.push('Hey! How are you?', 'Hello! What\'s up?', 'Hi there! 😊');
        } else if (contextLower.includes('thank')) {
            suggestions.push('You\'re welcome!', 'No problem!', 'Anytime! 😊');
        } else if (contextLower.includes('sorry') || contextLower.includes('sorry')) {
            suggestions.push('It\'s okay', 'No worries!', 'Don\'t worry about it');
        } else if (contextLower.includes('how are you')) {
            suggestions.push('I\'m doing great, thanks for asking!', 'All good! You?', 'Doing well! 👍');
        } else if (contextLower.includes('bye') || contextLower.includes('goodbye')) {
            suggestions.push('See you later!', 'Take care!', 'Goodbye! 👋');
        } else if (contextLower.includes('?')) {
            suggestions.push('Great question!', 'Good point', 'Let me think about that');
        } else {
            // Generic suggestions
            suggestions.push('That sounds interesting', 'I agree', 'Tell me more');
        }
        
        return suggestions.slice(0, 3);
    } catch (error) {
        console.log("Error getting suggestions:", error.message);
        return [];
    }
};

// Auto Translate (using free Google Translate API)
export const translateMessage = async (text, targetLanguage) => {
    try {
        // Using Google Translate API (free tier limited)
        const response = await axios.get(`https://api.mymemory.translated.net/get`, {
            params: {
                q: text,
                langpair: `en|${targetLanguage}`
            }
        });
        
        if (response.data.responseStatus === 200) {
            return response.data.responseData.translatedText;
        }
        return text;
    } catch (error) {
        console.log("Translation error:", error.message);
        return text;
    }
};

// Detect Language
export const detectLanguage = async (text) => {
    try {
        const response = await axios.get(`https://api.mymemory.translated.net/get`, {
            params: {
                q: text,
                langpair: 'en|es' // Just for detection
            }
        });
        
        // Simple language detection based on characters
        if (/[^\x00-\x7F]/.test(text)) {
            if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';
            if (/[\u0600-\u06FF]/.test(text)) return 'ar';
            if (/[\u0E00-\u0E7F]/.test(text)) return 'th';
        }
        return 'en';
    } catch (error) {
        return 'en';
    }
};

export default {
    analyzeSentiment,
    getMessageSuggestions,
    translateMessage,
    detectLanguage
};
