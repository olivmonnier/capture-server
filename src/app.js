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
  const source = window.SOURCE || null;

  if (peer && !peer.destroyed) {
    peer.destroy();
  }
  peer = new Peer();
  handlerPeer(peer, socket);

  socket.emit('message', JSON.stringify({
    state: 'ready',
    peerId: peer._id,
    source
  }));
}

function onMessage(data) {
  const { state, signal, sources, peerId } = JSON.parse(data)

  if (state === 'connect' && !peer.connected) {
    peer.signal(signal);
    socket.emit('message', JSON.stringify({
      state: 'sources',
      peerId: peer._id
    }))
  } else if (state === 'sources' && peerId == peer._id) {
    console.log(sources)
  }
}

function getRoom() {
  let room = localStorage.getItem('channel');

  if (!room) {
    room = prompt('Enter a room');

    if (room !== '') {
      localStorage.setItem('channel', room);
    }
  }

  return room;
}

function handlerPeer(peer, socket) {
  peer.on('signal', signal => {
    socket.emit('message', JSON.stringify({
      state: 'connect',
      peerId: peer._id,
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