import React, { useState, useEffect } from 'react';
   import io from 'socket.io-client';

   function App() {
     const [socket, setSocket] = useState(null);
     const [message, setMessage] = useState('');
     const [messages, setMessages] = useState([]);
     const [room, setRoom] = useState('general'); // Default room

     useEffect(() => {
       const newSocket = io('http://localhost:5000'); // Connect to your server
       setSocket(newSocket);

       newSocket.on('connect', () => {
         newSocket.emit('join', room); 
       });

       newSocket.on('chat message', (msg) => {
         setMessages(prevMessages => [...prevMessages, msg]);
       });

       return () => newSocket.disconnect(); 
     }, [room]); // Reconnect if room changes

     const sendMessage = () => {
       if (message.trim() !== '') {
         socket.emit('chat message', message, room); 
         setMessage('');
       }
     };

     return (
       <div className="App">
         <div>
           <input 
             type="text" 
             value={room} 
             onChange={(e) => setRoom(e.target.value)} 
             placeholder="Enter room name" 
           />
         </div>
         <div className="chat-window">
           <ul className="messages">
             {messages.map((msg, index) => (
               <li key={index}>{msg}</li> 
             ))}
           </ul>
         </div>
         <div className="input-area">
           <input 
             type="text" 
             value={message} 
             onChange={(e) => setMessage(e.target.value)} 
             placeholder="Type your message..." 
           />
           <button onClick={sendMessage}>Send</button>
         </div>
       </div>
     );
   }

   export default App;