import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './Chat.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io("http://localhost:5000"));
  }, []);

  useEffect(() => {
    if (socket === null) return;

    socket.emit("addUser", currentUserId);
    socket.on("getOnlineUsers", (onlineUsers) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          onlineUsers.includes(user._id) ? { ...user, online: true } : { ...user, online: false }
        )
      );
    });

    return () => {
      socket.off("getOnlineUsers");
      socket.disconnect();
    };
  }, [socket, currentUserId]);

  useEffect(() => {
    const id = localStorage.getItem("id"); // Assuming you store current user's ID
    if (id) {
      setCurrentUserId(id);
    }

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Filter out the current user from the list of users
        setUsers(res.data.filter(user => user._id !== id).map(user => ({ ...user, name: user.username })));
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Fetch messages when a user is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUser && currentUserId) {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(
            `http://localhost:5000/api/messages/${currentUserId}/${selectedUser._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setMessages(res.data);
        } catch (err) {
          console.error("Error fetching messages:", err);
          setMessages([]);
        }
      }
    };
    fetchMessages();
  }, [selectedUser, currentUserId]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setMessages([]); // Clear messages when a new user is selected
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || !selectedUser) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/messages/", 
        {
          senderId: currentUserId,
          receiverId: selectedUser._id,
          text: inputMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages([...messages, res.data]);
      setInputMessage('');
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <h3>Users</h3>
        <div className="user-list">
          {users.map(user => (
            <div
              key={user._id}
              className={`user-item ${selectedUser && selectedUser._id === user._id ? 'selected' : ''} ${user.online ? 'online' : 'offline'}`}
              onClick={() => handleUserSelect(user)}
            >
              {user.name} {user.online && <span className="online-indicator"></span>}
            </div>
          ))}
        </div>
      </div>
      <div className="chat-main">
        <div className="chat-header">
          <h3>{selectedUser ? selectedUser.name : 'Select a user to chat'}</h3>
        </div>
        <div className="message-list">
          {messages.map(message => (
            <div key={message._id} className={`message-item ${message.senderId === currentUserId ? 'my-message' : 'other-message'}`}>
              <div className="message-content">
                <span className="sender-name">{message.senderId === currentUserId ? 'You' : selectedUser ? selectedUser.name : ''}:</span> {message.text}
                <span className="message-timestamp">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="message-input-area">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
