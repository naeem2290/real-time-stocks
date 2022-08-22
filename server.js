const express = require('express'),
      app = express(),
      server = require('http').createServer(app);
      io = require('socket.io')(server);

const axios = require("axios");

let timerId = null,
    sockets = new Set();

let payload = {
      'region': 'US',
      'lang': 'en-US',
      'includePrePost': false,
      'interval': '2m',
      'useYfid': true,
      'range': '1d',
      'corsDomain': 'finance.yahoo.com',
      '.tsrc': 'finance',
    };
    
let apiUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/';


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.static(__dirname + '/dist')); 

io.on('connection', socket => {

  sockets.add(socket);
  console.log(`Socket ${socket.id} added`);

  if (!timerId) {
    startTimer();
  }

  socket.on('clientdata', data => {
  });

  socket.on('disconnect', () => {
    console.log(`Deleting socket: ${socket.id}`);
    sockets.delete(socket);
  });

});

function startTimer() {
  //Simulate stock data received by the server that needs 
  //to be pushed to clients
  timerId = setInterval(async () => {
    if (!sockets.size) {
      clearInterval(timerId);
      timerId = null;
      console.log(`Timer stopped`);
    }

    let getData = [{key: 'Tesla', value: []}, {key: 'Mircosoft', value: []}, {key: 'Alphabet', value: []}, {key: 'Apple', value: []}]

    try{
      const {data} = await axios.get(`${apiUrl}TSLA`, {
      params: payload}
      );
      getData[0].value.push(data.chart.result)
    }catch(err){
      console.log('error',err)
    }

    try{
      const {data} = await axios.get(`${apiUrl}MSFT`, {
      params: payload}
      );
      getData[1].value.push(data.chart.result)
    }catch(err){
      console.log('error',err)
    }

    try{
      const {data} = await axios.get(`${apiUrl}GOOG`, {
      params: payload}
      );
      getData[2].value.push(data.chart.result)
    }catch(err){
      console.log('error',err)
    }

    try{
      const {data} = await axios.get(`${apiUrl}AAPL`, {
      params: payload}
      );
      getData[3].value.push(data.chart.result)

    }catch(err){
      console.log('error',err)
    }

    for (const s of sockets) {
      console.log(`Emitting value: ${getData}`);
      s.emit('data', { data: getData });
    }

  }, 2000);
}

server.listen(8080);
console.log('Visit http://localhost:8080 in your browser');
