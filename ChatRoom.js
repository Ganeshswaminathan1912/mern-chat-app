// **frontend/src/components/ChatRoom.js**
     import React, { useState, useEffect, useRef } from 'react';
     import io from 'socket.io-client';

     const ChatRoom = ({ room, username }) => {
         const [messages, setMessages] = useState([]);
         const [newMessage, setNewMessage] = useState('');
         const socketRef = useRef(); 

         useEffect(() => {
             socketRef.current = io('http://localhost:5000'); // Connect to the server

             socketRef.current.on('connect', () => {
                 socketRef.current.emit('join', room);
             });

             socketRef.current.on('chat message', (msg) => {
                 setMessages(prevMessages => [...prevMessages, msg]);
             });

             // Cleanup on component unmount
             return () => socketRef.current.disconnect();
         }, [room]); // Reconnect if room changes

         const sendMessage = () => {
             if (newMessage.trim() !== '') {
                 socketRef.current.emit('chat message', {
                     room: room, 
                     user: username, 
                     text: newMessage 
                 });
                 setNewMessage(''); 
             }
         };

         return (
             <div>
                 <h2>Chat Room: {room}</h2>
                 <ul>
                     {messages.map((msg, index) => (
                         <li key={index}>
                             <b>{msg.user}: </b> {msg.text}
                         </li>
                     ))}
                 </ul>
                 <input 
                     type="text" 
                     value={newMessage} 
                     onChange={e => setNewMessage(e.target.value)} 
                     placeholder="Type your message..." 
                 />
                 <button onClick={sendMessage}>Send</button>
             </div>
         );
     };

     export default ChatRoom;