import React, { useState, useEffect, useRef } from "react";
import { sendChatMessage } from "../../services/apiClient";
import { format } from "timeago.js";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isError?: boolean;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: "1",
    text: "Hello! I'm your assistant. How can I help you today? 😊",
    sender: "bot",
    timestamp: new Date(),
  }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(input);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble processing your request. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white py-4 px-6 font-semibold text-lg flex items-center justify-between">
        <span>💬 AI Assistant</span>
        <span className="text-sm opacity-75">Online</span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-hide bg-gray-100 dark:bg-gray-800">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-end ${
              message.sender === "user" ? "justify-start" : "justify-end"
            }`}
          >
            {/* User Avatar */}
            {message.sender === "user" && (
              <div className="h-10 w-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center mr-2">
                😊
              </div>
            )}

            {/* Message Box */}
            <div className="max-w-xs md:max-w-sm lg:max-w-md">
              <div
                className={`p-3 rounded-lg shadow-md ${
                  message.sender === "user"
                    ? "bg-green-500 text-white text-left"
                    : "bg-blue-600 text-white text-right"
                }`}
              >
                {message.text}
              </div>
              <div
                className={`text-xs mt-1 ${
                  message.sender === "user" ? "text-left text-gray-400" : "text-right text-gray-300"
                }`}
              >
                {format(message.timestamp)}
              </div>
            </div>

            {/* AI Avatar */}
            {message.sender === "bot" && (
              <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center ml-2">
                🤖
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex items-center justify-end space-x-1">
            <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
              🤖
            </div>
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Chat Input */}
      <form
        onSubmit={handleSendMessage}
        className="border-t p-4 bg-gray-100 dark:bg-gray-800 flex"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={`ml-2 p-2 rounded-lg transition ${
            isLoading || !input.trim()
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <PaperAirplaneIcon className="h-6 w-6 transform rotate-45" />
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;