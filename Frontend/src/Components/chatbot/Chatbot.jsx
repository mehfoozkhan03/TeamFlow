
import { useState, useRef, useEffect } from "react";
import {
  Bot,
  X,
  Send,
  User,
  LoaderCircle,
  Trash2,
} from "lucide-react";

import "../../Style/Chatbot.css";

import chatbotServices from "../../Services/chatbotServices";

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hello! Welcome to TeamFlow. How can I help you?",
    },
  ]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Send message to backend
  const handleSend = async (e) => {
    e.preventDefault();

    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setMessage("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setLoading(true);

    try {
      const response =
        await chatbotServices.sendMessage(userMessage);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            response.answer ||
            response.reply ||
            "No response received.",
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Unable to connect to the server. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Clear chat
  const handleClearChat = () => {
    if (loading) return;

    setMessages([
      {
        role: "bot",
        text: "Hello! Welcome to TeamFlow. How can I help you?",
      },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-f[999]">

      {/* Chatbot Toggle Button */}
      {!isOpen && (
  <button
    onClick={() => setIsOpen(true)}
      className="chatbot-launcher "
    aria-label="Open chatbot"
  >
    <Bot size={32} />
  </button>
)}

      {/* Chat Window */}
      {isOpen && (
        <div className="flex h-[500px] w-[350px] max-w-[calc(100vw-40px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl duration-[800ms]">

          {/* Header */}
          <div className="flex items-center justify-between bg-blue-600 p-4 text-white">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Bot size={24} />
              </div>

              <div>
                <h3 className="font-semibold">
                  TeamFlow Assistant
                </h3>

                <p className="text-xs text-blue-100">
                  {loading ? "Typing..." : "Online | Ready to help"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={handleClearChat}
                disabled={loading}
                className="transition hover:text-blue-200 disabled:opacity-40"
                title="Clear chat"
                aria-label="Clear chat"
              >
                <Trash2 size={19} />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chatbot"
                className="transition hover:text-blue-200"
              >
                <X size={22} />
              </button>

            </div>
          </div>

          {/* Messages */}
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto bg-gray-50 p-4">

            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex gap-2 ${
                  item.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                {item.role === "bot" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Bot size={18} />
                  </div>
                )}

                <div
                  className={`max-w-[80%] whitespace-pre-wrap break-words rounded-xl px-3 py-2 text-sm ${
                    item.role === "user"
                      ? "rounded-br-none bg-blue-600 text-white"
                      : "rounded-bl-none bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  {item.text}
                </div>

                {item.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                    <User size={18} />
                  </div>
                )}

              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Bot size={18} />
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm">
                  <LoaderCircle
                    size={16}
                    className="animate-spin"
                  />
                  TeamFlow Assistant is typing...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />

          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 border-t border-gray-200 bg-white p-3"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask something..."
              disabled={loading}
              className="min-w-0 flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none transition focus:border-blue-500 disabled:bg-gray-100"
            />

            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send message"
            >
              {loading ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
