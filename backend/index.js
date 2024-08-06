// **backend/index.js**
   const express = require('express');
   const app = express();
   const http = require('http').createServer(app);
   const io = require('socket.io')(http, {
       cors: {
           origin: "http://localhost:5173", // Replace with your React app's URL
           methods: ["GET", "POST"]
       }
   }); 

   const port = 5000;

   app.get('/', (req, res) => {
       res.send('Server is running!'); 
   });

   io.on('connection', (socket) => {
       console.log('A user connected');

       socket.on('join', (room) => {
           socket.join(room);
           console.log(`User joined room: ${room}`);
       });

       socket.on('chat message', (msg) => {
           io.to(msg.room).emit('chat message', msg);
           console.log(msg); // Log messages to the server console
       });

       socket.on('disconnect', () => {
           console.log('User disconnected');
       });
   });

   http.listen(port, () => {
       console.log(`Server listening on port ${port}`);
   });