import React from 'react'
import { useState } from "react";

const Mychat = () => {
     const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
  setAnswer("");
  setLoading(true);

  const response = await fetch("http://localhost:3000/api/chat-stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let tokenQueue = [];
  let typing = false;

  const typeToken = () => {
    if (tokenQueue.length === 0) {
      typing = false;
      return;
    }

    typing = true;
    setAnswer(prev => prev + tokenQueue.shift());

    setTimeout(typeToken, 50); // 👈 CONTROL SPEED (ms)
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });

    chunk.split("\n\n").forEach(line => {
      if (line.startsWith("data: ")) {
        const token = line.replace("data: ", "");

        if (token !== "[DONE]") {
          tokenQueue.push(token);

          if (!typing) {
            typeToken();
          }
        }
      }
    });
  }

  setLoading(false);
};
  return (
    <div className="chat-container">
      <h2>Personal Digital Assistant</h2>

      {/* Answer box */}
      <div className="chat-answer">
        {answer}
        {loading && <span className="cursor">▌</span>}
      </div>

      {/* Input */}
      <div className="chat-input">
        <input
          type="text"
          value={query}
          placeholder="Ask something..."
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  )
}

export default Mychat