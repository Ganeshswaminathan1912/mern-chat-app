const express = require('express');
    const http = require('http');
    const socketIo = require('socket.io');

    const app = express();
    const server = http.createServer(app);
    const io = socketIo(server, {
      cors: {
        origin: "http://localhost:3000", // Replace with your React app's URL
        methods: ["GET", "POST"]
      }
    }); 

    const PORT = process.env.PORT || 5000;

    io.on('connection', (socket) => {
      console.log('A user connected');

      socket.on('join', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
      });

      socket.on('chat message', (msg, room) => {
        io.to(room).emit('chat message', msg); 
      });

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });

    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));