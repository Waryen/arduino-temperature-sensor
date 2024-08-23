import 'dotenv/config';
import { Board, Led, Thermometer } from 'johnny-five';

import { isBetween } from './utils';

// initialize the arduino board
const board = new Board();
// constants
const analogPin = String(process.env.ANALOG_PIN);
const sensor = String(process.env.SENSOR);
const temperatureRefreshRate = Number(process.env.TEMPERATURE_REFRESH_RATE); // in ms
const temperatureBreakPoints = {
  cold: Number(process.env.COLD_TEMPERATURE_BREAKPOINT),
  hot: Number(process.env.HOT_TEMPERATURE_BREAKPOINT),
};

board.on('ready', () => {
  console.log('Board ready');

  // initialize the LED and the thermometer sensor
  const hotLed = new Led(13);
  const coldLed = new Led(12);
  const mildLed = new Led(7);
  const thermometer = new Thermometer({
    controller: sensor,
    pin: analogPin,
    freq: temperatureRefreshRate,
  });

  // invoke a callback when the temperature captured by the sensor changes
  thermometer.on('change', () => {
    const currentTemperature = thermometer.celsius;

    if (currentTemperature <= temperatureBreakPoints.cold) {
      hotLed.off();
      mildLed.off();
      coldLed.on();
      console.log(`${currentTemperature}°C ... 🥶`);
      return;
    }

    if (currentTemperature >= temperatureBreakPoints.hot) {
      mildLed.off();
      coldLed.off();
      hotLed.on();
      console.log(`${currentTemperature}°C ... 🥵`);
      return;
    }

    if (
      isBetween(
        temperatureBreakPoints.cold,
        temperatureBreakPoints.hot,
        currentTemperature,
      )
    ) {
      hotLed.off();
      coldLed.off();
      mildLed.on();
      console.log(`${currentTemperature}°C ... ✅`);
    }
  });

  // shutdown the LED on exit
  board.on('exit', () => {
    console.log('Board exiting');
    console.log('Shutting down the led');
    mildLed.off();
    hotLed.off();
    coldLed.off();
  });
});
