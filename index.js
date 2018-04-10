const ejs = require('ejs');
const http = require('http');
const express = require('express');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 8080;

app.engine('html', ejs.renderFile);
app.use(express.static(__dirname + '/public/dest'));

app.get('/', function (req, res) {
  res.render(path.join(__dirname + '/views/index.html'), { source: '' })
});

app.get('/ar', function (req, res) {
  res.render(path.join(__dirname + '/views/ar.html'), { source: '' })
})

app.get('/ar/:source', function (req, res) {
  res.render(path.join(__dirname + '/views/ar.html'), {
    source: req.params.source
  })
})

app.get('/vr', function (req, res) {
  res.render(path.join(__dirname + '/views/vr.html'), { source: '' })
})

app.get('/vr/:source', function (req, res) {
  res.render(path.join(__dirname + '/views/vr.html'), {
    source: req.params.source
  })
})

app.get('/:source', function (req, res) {
  res.render(path.join(__dirname + '/views/index.html'), {
    source: req.params.source
  })
});


io.on('connection', function (socket) {
  const room = socket.handshake.query.token || socket.id;

  socket.join(room);

  socket.on('message', (data) => {
    socket.broadcast.to(room).emit('message', data)
  })

  socket.on('disconnect', () => {
    socket.leave(room)
  })
})

server.listen(PORT, function () {
  console.log(`Server run on port ${PORT}`)
});