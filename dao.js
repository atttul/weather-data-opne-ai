import { Weather } from "./Weather.js";


export const createWeatherData = async (prompt, city, temprature) => {
    const savedWeatherData = await Weather.create({
        prompt,
        city,
        temprature
    })
    return savedWeatherData;
}