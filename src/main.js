require("dotenv").config();
const { Board, Thermometer, Led } = require("johnny-five");
const { isBetween } = require("./utils");

// initialize the arduino board
const board = new Board();
// constants
const analogPin = process.env.ANALOG_PIN;
const sensor = process.env.SENSOR;
const temperatureRefreshRate = parseInt(process.env.TEMPERATURE_REFRESH_RATE); // in ms
const temperatureBreakPoints = {
  cold: process.env.COLD_TEMPERATURE_BREAKPOINT,
  hot: process.env.HOT_TEMPERATURE_BREAKPOINT,
};

board.on("ready", () => {
  console.log("Board ready");

  // initialize the leds and the thermometer sensor
  const hotLed = new Led(13);
  const coldLed = new Led(12);
  const mildLed = new Led(7);
  const thermometer = new Thermometer({
    controller: sensor,
    pin: analogPin,
    freq: temperatureRefreshRate,
  });

  // invoke a callback when the temperature captured by the sensor changes
  thermometer.on("change", () => {
    const currentTemperature = thermometer.celsius;

    // if the temperature is below or equal to the cold breakpoint
    if (currentTemperature <= temperatureBreakPoints.cold) {
      hotLed.off();
      mildLed.off();
      coldLed.on();
      console.log(`${currentTemperature}°C ... 🥶`);
    }

    // if the temperature is between the cold and hot breakpoints
    if (
      isBetween(
        temperatureBreakPoints.cold,
        temperatureBreakPoints.hot,
        currentTemperature
      )
    ) {
      hotLed.off();
      coldLed.off();
      mildLed.on();
      console.log(`${currentTemperature}°C ... ✅`);
    }

    // if the temperature is above or equal to the hot breakpoint
    if (currentTemperature)
      if (currentTemperature >= temperatureBreakPoints.hot) {
        mildLed.off();
        coldLed.off();
        hotLed.on();
        console.log(`${currentTemperature}°C ... 🥵`);
      }
  });

  // shutdown the leds on exit
  board.on("exit", () => {
    mildLed.off();
    hotLed.off();
    coldLed.off();
  });
});
