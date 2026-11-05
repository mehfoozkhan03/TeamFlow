
import { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! I'm your TeamFlow AI assistant. How can I help you today?",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  // Send message
  const handleSend = async (text = message) => {
    const userMessage = text.trim();

    if (!userMessage || isLoading) return;

    const newUserMessage = {
      id: Date.now(),
      sender: "user",
      text: userMessage,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setMessage("");
    setIsLoading(true);

    // AI connection will be added in Step 2
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: "Your message has been received! I'll be connected to TeamFlow AI in the next development step.",
        },
      ]);

      setIsLoading(false);
    }, 800);
  };

  // Suggested questions
  const suggestions = [
    "Show my pending tasks",
    "What projects am I working on?",
    "Who are my team members?",
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-purple-600 text-white shadow-xl transition hover:scale-105 hover:bg-purple-700"
          aria-label="Open TeamFlow assistant"
        >
          <FaRegCommentDots size={23} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[550px] w-[calc(100%-32px)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:right-6">

          {/* Header */}
          <div className="flex items-center justify-between bg-purple-600 px-4 py-4 text-white ">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <FaRobot size={21} />
              </div>

              <div>
                <h2 className="font-semibold">
                  TeamFlow Assistant
                </h2>

                <p className="text-xs text-purple-100">
                  Your workspace helper
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 transition hover:bg-white/20"
              aria-label="Close chatbot"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">

            <div className="rounded-xl bg-purple-50 p-3 text-sm text-gray-700">
              You can ask me about your tasks, projects, and team members.
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "rounded-br-sm bg-purple-600 text-white"
                      : "rounded-bl-sm border border-gray-100 bg-white text-gray-700 shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-xl bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
                  Assistant is typing...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="space-y-2 border-t border-gray-100 bg-white px-4 py-3">
              <p className="text-xs font-semibold text-gray-500">
                TRY ASKING
              </p>

              {suggestions.map((item) => (
                <button
                  key={item}
                  onClick={() => handleSend(item)}
                  className="block w-full rounded-lg border border-purple-100 px-3 py-2 text-left text-xs text-purple-700 transition hover:bg-purple-50"
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          {/* Message Input */}
          <div className="border-t border-gray-200 bg-white p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask TeamFlow anything..."
                className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                <FaPaperPlane size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
