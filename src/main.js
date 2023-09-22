const { Board, Thermometer, Led } = require("johnny-five");
const { isBetween } = require("./utils");

// initialize the arduino board
const board = new Board();
// constants
const analogPin = "A0";
const sensor = "TMP36";
const temperatureRefreshRate = 1000; // in ms
const temperatureBreakPoints = {
  cold: 18,
  hot: 22,
};

board.on("ready", () => {
  // initialize the leds and the thermometer sensor
  const hotLed = new Led(13);
  const coldLed = new Led(12);
  const midlLed = new Led(7);
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
      midlLed.off();
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
      midlLed.on();
      console.log(`${currentTemperature}°C ... ✅`);
    }

    // if the temperature is above or equal to the hot breakpoint
    if (currentTemperature)
      if (currentTemperature >= temperatureBreakPoints.hot) {
        midlLed.off();
        coldLed.off();
        hotLed.on();
        console.log(`${currentTemperature}°C ... 🥵`);
      }
  });

  // shutdown the leds on exit
  board.on("exit", () => {
    midlLed.off();
    hotLed.off();
    coldLed.off();
  });
});
