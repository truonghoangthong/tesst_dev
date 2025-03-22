import React, { useState } from "react";
import "./chatbot.css"; 

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false); 
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputValue, sender: "user" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputValue }),
      });

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.reply, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setInputValue("");
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen); 
  };

  return (
    <>
      <div className="chatbot-toggle" onClick={toggleChatbot}>
        <img src="/logo.png" alt="Chatbot Logo" className="chatbot-logo" />
      </div>

      <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
        <div className="chatbot-header">
          <img src="/logo.png" alt="Bot Logo" className="chatbot-header-logo" />
          <span className="chatbot-header-title">Bot</span>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="chatbot-input">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;