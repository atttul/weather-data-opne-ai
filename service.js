import * as dao from './dao.js';
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const extractCityName = async (prompt) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
        `Extract only the city name from this prompt: "${prompt}"`,
        "If no city name found in the prompt then return NO_CITY_FOUND",
    ]);

    const response = await result.response.text();
    console.log("Gemini Response:", response);
    const city = response.trim();
    return city;
};

export const getGeminiResponse = async (prompt) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    return response.trim();
};

export const fetchWeatherData = async (city) => {
    const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.WEATHER_API_KEY}&units=metric`
      );
    const temperature = weatherRes.data.main.temp;
    const result = {
        city,
        temperature: `${temperature} °C`,
      }
    return result;
}

export const createWeatherEntry = async (prompt, city, temperature) => {
    const weatherDataCreated = await dao.createWeatherData(prompt, city, temperature);
    return weatherDataCreated;
}