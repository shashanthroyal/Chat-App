import { useState, useEffect, useRef } from "react";
import axios from "axios";
import socket from "../socket.js";
import "./Auth.css"; 
import "./chat.css";

export default function Chat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user) {
      socket.connect();
      socket.emit("join", user._id);

      const handleReceiveMessage = (msg) => {
        if (
          msg.senderId === selectedUser?._id ||
          msg.receiverId === selectedUser?._id
        ) {
          setMessages((prev) => [...prev, msg]);
        }
      };

      socket.on("receive_message", handleReceiveMessage);

      return () => {
        socket.off("receive_message", handleReceiveMessage);
        socket.disconnect();
      };
    }
  }, [user, selectedUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      setError(null);
      try {
        const res = await axios.get("http://localhost:5000/api/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.filter((u) => u._id !== user._id));
      } catch (err) {
        setError("Failed to fetch users.");
        console.error("Error fetching users:", err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async (receiverId) => {
    setLoadingMessages(true);
    setError(null);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/messages/${user._id}/${receiverId}`
      );
      setMessages(res.data);
    } catch (err) {
      setError("Failed to fetch messages.");
      console.error("Error fetching messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = () => {
    if (text.trim() && selectedUser) {
      const msg = {
        senderId: user._id,
        receiverId: selectedUser._id,
        text,
      };
      socket.emit("send_message", msg);
      setText("");
    }
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        <h3>Users</h3>
        {loadingUsers ? (
          <p>Loading users...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          users.map((u) => (
            <p
              key={u._id}
              onClick={() => {
                setSelectedUser(u);
                fetchMessages(u._id);
              }}
              className={`user-item ${selectedUser?._id === u._id ? "selected" : ""}`}
            >
              {u.username}
            </p>
          ))
        )}
      </div>

      <div className="chat-window">
        <div className="messages-display">
          {loadingMessages ? (
            <p>Loading messages...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : selectedUser ? (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`message-bubble ${msg.senderId === user._id ? "sent" : "received"}`}
              >
                <span>{msg.text}</span>
              </div>
            ))
          ) : (
            <p>Select a user to start chatting</p>
          )}
          <div ref={messagesEndRef} />
        </div>

        {selectedUser && (
          <div className="message-input">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
}
