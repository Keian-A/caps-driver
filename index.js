'use strict';

require('dotenv').config();
const io = require('socket.io-client');
const PORT = process.env.PORT;
const client = io.connect(PORT);

client.emit('connection');
client.on('success', () => {
  console.log('Connected!');
});

// Subscribes to 'pickup' here
client.on('pickup', ({ payload }) => {

  // Waits 1.5 seconds to simulate time till in-transit.
  setTimeout(function () {

    // Need to generate a new dateTime for when order is in-transit.
    let today = new Date();
    let date = `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDate()}`;
    let time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    let dateTime = `${date} ${time}`;

    // Changing payload information to be up to date.
    payload.time = dateTime;
    payload.event = 'in-transit';

    console.log(`picking up ${payload.payload.orderID}`);
    client.emit('in-transit', { payload: payload });
  }, 1500);

  // Waits another 1.5 seconds to simulate delivery time
  setTimeout(function () {

    // Need to generate a new dateTime for when order is delivered.
    let today = new Date();
    let date = `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDate()}`;
    let time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    let dateTime = `${date} ${time}`;

    // Changing payload information to be up to date.
    payload.time = dateTime;
    payload.event = 'delivered';

    client.emit('delivered', { payload: payload });
  }, 3000);
});