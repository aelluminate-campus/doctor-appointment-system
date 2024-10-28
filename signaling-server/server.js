const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', 
        methods: ['GET', 'POST'],
        credentials: false
    }
});

app.get('/', (req, res) => {
    res.send('Server is running');
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', (reason) => {
        console.log(`User ${socket.id} disconnected: ${reason}`);
    });

    socket.on('error', (error) => {
        console.error(`Socket error for user ${socket.id}:`, error);
    });

});


server.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
