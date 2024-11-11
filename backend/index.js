const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let currentPage = 1;
let adminSocketId = null;

io.on('connection', (socket) => {
    if (!adminSocketId) adminSocketId = socket.id;
    socket.emit('page-change', currentPage);

    socket.on('change-page', (page) => {
        if (socket.id === adminSocketId) {
            currentPage = page;
            io.emit('page-change', currentPage);
        }
    });

    socket.on('disconnect', () => {
        if (socket.id === adminSocketId) adminSocketId = null;
    });
});

server.listen(5000, () => console.log('Server running on port 5000'));
