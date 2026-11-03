
import { useState } from "react";
import {
  BrainCircuit,
  Send,
  User,
  LoaderCircle,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import { askAI } from "../services/api";

const suggestedQuestions = [
  "Give me an overview of shipment status",
  "Which destinations have delayed shipments?",
  "How many shipments are delayed?",
  "Show me the shipment records",
];

function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm LogiPulse AI. I can help you understand shipment performance, delivery delays and logistics analytics. What would you like to know?",
      source: "LogiPulse Assistant",
    },
  ]);

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSend(customQuestion) {
    const userQuestion = (
      customQuestion ?? question
    ).trim();

    if (!userQuestion || loading) return;

    setError("");
    setQuestion("");

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: userQuestion,
      },
    ]);

    setLoading(true);

    try {
      const response = await askAI(userQuestion);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: response.answer,
          source: response.source,
          data: response.data,
        },
      ]);
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <section className="panel ai-panel">
      <div className="ai-header">
        <div className="ai-heading">
          <div className="ai-avatar">
            <BrainCircuit size={23} />
          </div>

          <div>
            <h3>LogiPulse AI Assistant</h3>
            <p>Ask questions about your logistics operations</p>
          </div>
        </div>

        <span className="ai-online">
          <span className="status-dot" />
          Online
        </span>
      </div>

      <div className="ai-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message-row ${
              message.role === "user"
                ? "user-row"
                : "assistant-row"
            }`}
          >
            <div className="message-avatar">
              {message.role === "user" ? (
                <User size={17} />
              ) : (
                <BrainCircuit size={17} />
              )}
            </div>

            <div className="message-content">
              <span className="message-sender">
                {message.role === "user"
                  ? "You"
                  : "LogiPulse AI"}
              </span>

              <div className="message-bubble">
                {message.content}
              </div>

              {message.source && (
                <span className="message-source">
                  Source: {message.source}
                </span>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="message-row assistant-row">
            <div className="message-avatar">
              <BrainCircuit size={17} />
            </div>

            <div className="message-content">
              <span className="message-sender">
                LogiPulse AI
              </span>

              <div className="message-bubble loading-message">
                <LoaderCircle size={16} className="spin" />
                Analysing shipment data...
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="ai-error">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="ai-suggestions">
        <div className="suggestion-heading">
          <Sparkles size={14} />
          Suggested questions
        </div>

        <div className="suggestion-list">
          {suggestedQuestions.map((item) => (
            <button
              key={item}
              className="suggestion-button"
              onClick={() => handleSend(item)}
              disabled={loading}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <form
        className="ai-input-area"
        onSubmit={(event) => {
          event.preventDefault();
          handleSend();
        }}
      >
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask something about your shipments..."
          rows={2}
          disabled={loading}
        />

        <button
          type="submit"
          className="ai-send-button"
          disabled={!question.trim() || loading}
          aria-label="Send question"
        >
          <Send size={18} />
        </button>
      </form>

      <p className="ai-disclaimer">
        Powered by the LogiPulse rule-based assistant.
        Responses use available logistics database records.
      </p>
    </section>
  );
}

export default AIAssistant;
