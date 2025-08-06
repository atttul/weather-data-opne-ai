import * as services from './service.js'
import dotenv from 'dotenv';
dotenv.config();

export const getWeatherData = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(200).json({
                success: false,
                message: 'Prompt is required',
                data: `Prompt is required. Please enter a valid input.`
            });
        }

        // Step 1: Use GEMINI to extract city name
        const city = await services.extractCityName(prompt);

        if (city === "NO_CITY_FOUND") {
            const geminiResponse = await services.getGeminiResponse(prompt);
            return res.status(200).json({
                success: true,
                message: 'Gemini Response Generate',
                data: geminiResponse
            });
        }

        // Step 2: Get weather from OpenWeatherMap
        const weatherData = await services.fetchWeatherData(city);

        // Step 3: Save weather data to MongoDB
        await services.createWeatherEntry(prompt, city, weatherData.temperature);

        return res.json({
            success: true,
            message: 'Weather data fetched successfully',
            data: weatherData,
        })
    } catch (error) {
        return res.status(200).json({
            success: true,
            message: `Error Catch Block: ${error.message}`,
            data: `Today's Quota Exceeded. Please try again tomorrow. ${error.message}`
        });
    }
}