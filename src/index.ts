import { Board, Thermometer } from 'johnny-five';

const board = new Board();
const thermometer = new Thermometer({ pin: '' });

board.on('ready', () => {
  console.log('board is ready!');

  // listen for data changes on the thermometer object
  thermometer.on('data', () => {
    const temperature = thermometer.celsius;
    console.log(`The current ambiant temperature is: ${temperature}°C`);
  });
});

board.on('error', (err) => {
  console.log(JSON.stringify(err, null, 2));
});

board.on('fail', (err) => {
  console.log(JSON.stringify(err, null, 2));
});
