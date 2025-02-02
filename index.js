// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const redis = require('redis');
const { translate } = require('@vitalets/google-translate-api');
const cors = require('cors');

// Initialize Express and middleware
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Initialize Redis client
const redisClient = redis.createClient({
    host: 'localhost',
    port: 8080
});

redisClient.on('error', (err) => {
    console.error('❌ Redis Error:', err);
});

(async () => {
    try {
        await redisClient.connect();
        console.log('✅ Connected to Redis');
    } catch (err) {
        console.error('❌ Redis Connection Failed:', err);
    }
})();

module.exports = redisClient;


// connecting to mongodb
mongoose.connect('mongodb://localhost:27017/faqdb');

// Define FAQ Schema and Model
const faqSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    translations: {
        hi: { question: String, answer: String },
        bn: { question: String, answer: String },
    },
});
const FAQ = mongoose.model('FAQ', faqSchema);

// Middleware for caching
const cacheMiddleware = (req, res, next) => {
    const lang = req.query.lang || 'en';
    redisClient.get(`faqs_${lang}`, (err, data) => {
        if (err) throw err;
        if (data) return res.json(JSON.parse(data));
        next();
    });
};

// API Endpoint to Get FAQs
app.get('/api/faqs', cacheMiddleware, async (req, res) => {
    try {
        const lang = req.query.lang || 'en';
        const faqs = await FAQ.find();

        const translatedFaqs = faqs.map(faq => ({
            question: faq.translations[lang]?.question || faq.question,
            answer: faq.translations[lang]?.answer || faq.answer,
        }));

        redisClient.setex(`faqs_${lang}`, 3600, JSON.stringify(translatedFaqs));
        res.json(translatedFaqs);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// API Endpoint to Add a FAQ with Translations
app.post('/api/faqs', async (req, res) => {
    try {
        const { question, answer } = req.body;

        // Auto-translate the FAQ
        const hiTranslation = await translate(question, { to: 'hi' });
        const hiAnswer = await translate(answer, { to: 'hi' });
        const bnTranslation = await translate(question, { to: 'bn' });
        const bnAnswer = await translate(answer, { to: 'bn' });

        const faq = new FAQ({
            question,
            answer,
            translations: {
                hi: { question: hiTranslation.text, answer: hiAnswer.text },
                bn: { question: bnTranslation.text, answer: bnAnswer.text },
            },
        });
        await faq.save();

        res.status(201).json(faq);
    } catch (error) {
        res.status(500).json({ error: 'Error saving FAQ' });
    }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export for testing
module.exports = app;
