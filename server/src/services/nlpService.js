const natural = require('natural');

const analyzeText = (text) => {
    if (!text) {
        throw new Error('Text input is required');
    }

    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(text);
    
    return { tokens, wordCount: tokens.length };
};

module.exports = { analyzeText };