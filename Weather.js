
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const weatherSchema = new Schema({
    prompt: { type: String, required: true },
    city: { type: String, required: false, default: null },
    temprature: { type: String, required: false, default: null },
})

export const Weather = mongoose.model("weather", weatherSchema);
