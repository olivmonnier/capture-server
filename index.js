const ejs = require('ejs');
const http = require('http');
const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, clientTracking: true });

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

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', function (ws) {
  if (wss.clients.size > 2) {
    ws.terminate();
    return;
  }

  if (wss.clients.size <= 2) {
    ws.on('message', function (data) {
      wss.clients.forEach(function (client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data)
        }
      })
    })
  }
})

server.listen(process.env.PORT || 8080, function () {
  console.log(`Server run on port ${process.env.PORT || 8080}`)
});