import { Board, Thermometer } from 'johnny-five';

const board = new Board();
let thermometer;

board.on('ready', () => {
  console.log('board is ready!');
  thermometer = new Thermometer({ board });
});

board.on('error', (err) => {
  console.log(JSON.stringify(err, null, 2));
});

board.on('fail', (err) => {
  console.log(JSON.stringify(err, null, 2));
});
