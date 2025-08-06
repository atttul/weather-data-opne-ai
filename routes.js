import express from "express"
import * as controller from './controller.js'
const router = express.Router();

router.post('/get/weather/data', controller.getWeatherData)

export default router;