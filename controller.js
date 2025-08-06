import * as services from './service.js'
import dotenv from 'dotenv';
dotenv.config();

export const getWeatherData = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: 'Prompt is required'
            });
        }

        // Step 1: Use GEMINI to extract city name
        const city = await services.extractCityName(prompt);

        if (city === "NO_CITY_FOUND") {
            const geminiResponse = await services.getGeminiResponse(prompt);
            return res.status(400).json({
                success: false,
                message: 'Gemini Response Generate',
                data: geminiResponse
            });
        }

        // Step 2: Get weather from OpenWeatherMap
        const weatherData = await services.fetchWeatherData(city);

        // Step 3: Save weather data to MongoDB
        const weatherDataCreated = await services.createWeatherEntry(prompt, city, weatherData.temperature);

        return res.json({
            success: true,
            message: 'Weather data fetched successfully',
            data: weatherData,
        })
    } catch (error) {
        if (error.response?.status === 429) {
            return res.status(429).json({
                success: false,
                message: 'Rate limit or quota exceeded. Please check OpenAI billing and usage.'
            });
        }

        return res.status(500).json({
            success: false,
            message: `Weather data did not fetch successfully. ${error.message}`
        });
    }
}