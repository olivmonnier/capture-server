import Peer from 'simple-peer';
import io from 'socket.io-client';
import { queryParameters } from './utils';

const socket = io(window.location.origin, {
  query: {
    token: getRoom()
  }
});
let peer;

socket.on('connect', onConnect)
socket.on('message', onMessage)

function onConnect() {
  const parameters = getParameters();

  peer = new Peer();
  handlerPeer(peer, socket);
  socket.emit('message', JSON.stringify(parameters));
}

function onMessage(data) {
  const { state, signal, sources } = JSON.parse(data)

  if (state === 'connect') {
    if (peer && peer.destroyed) {
      peer = new Peer()
      handlerPeer(peer, socket)
    }
    peer.signal(signal)
  } else if (state === 'sources') {
    console.log(sources)
  }
}

function getRoom() {
  let room = localStorage.getItem('channel');

  if (!room) {
    room = prompt('Enter a room');
    localStorage.setItem('channel', room);
  }

  return room;
}

function handlerPeer(peer, socket) {
  peer.on('signal', signal => {
    socket.emit('message', JSON.stringify({
      state: 'connect',
      signal
    }))
  })
  peer.on('stream', function (stream) {
    const video = document.querySelector('#remoteVideos')
    video.src = window.URL.createObjectURL(stream)
    video.play()
  })
  peer.on('close', () => {
    peer.destroy()
  })
}

function getParameters() {
  let parameters;
  const source = window.SOURCE || null;
  const params = queryParameters();

  parameters = {
    state: 'ready',
    params
  }

  if (source) parameters = Object.assign(parameters, { source });

  return parameters;
}