/* Irc bot, express server, socket.io.*/

// Includes
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const irc = require('irc');

//
// IRC bot
//
/* const defaultConfig = {
  server: 'irc.bsnet.se',
  port: 6667,
  channels: ['#db-o-webb-student'],
  userName: 'putte',
  realName: 'just a bot listener',
};*/
const putte = new irc.Client('irc.bsnet.se', 'putte', {
  debug: true,
  channels: ['#db-o-webb-student'],
  port: 6667,
  realName: 'just a little bot listner',
  retryDelay: 7000,
});

putte.addListener('error', (message) => {
  console.log(`Bot error: ${message.command}: ${message.args.join(' ')}`);
});

putte.addListener('message', (from, to, message) => {
  console.log(`From: ${from}\nTo: ${to}\n${message}`);
  if (to.match(/^[#&]/)) {
    // channel message
    if (message.match(/hej\s+putte/i)) {
      putte.say(to, 'Hej, jag heter putte och är en bot');
    } else if (message.match(/putte\s+hjälp/i)) {
      putte.say(to, 'Äh, jag kan ingenting. Be någon annan.');
    }
    // Send message on websocket
    io.emit('message', {
      from,
      to,
      message,
    });
  } else {
      // private message ??
    console.log('No match on channel. Private message??');
  }
});

// Server and socket stuff


// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

// Socket
io.on('connection', (socket) => {
  console.log('incomming connection');

  socket.on('disconnect', () => {
    console.log('connection closed');
  });
});

// Start listening
http.listen(1337, () => {
  console.log('listening on *:1337');
});
