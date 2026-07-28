import { useState } from 'react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Ask a mechanical engineering, manufacturing, CNC, PLC, hydraulics, or maintenance question.'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendQuestion = async (value) => {
    const trimmedQuestion = value.trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    setLoading(true);
    setError('');
    setMessages((currentMessages) => [
      ...currentMessages,
      { role: 'user', text: trimmedQuestion }
    ]);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: trimmedQuestion })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || 'Unable to get a response from the backend.');
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        { role: 'assistant', text: data.answer || 'No answer returned.' }
      ]);
      setQuestion('');
    } catch (requestError) {
      setError(requestError.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    void sendQuestion(question);
  };

  return (
    <div className="app-shell">
      <main className="chat-app">
        <section className="hero-panel">
          <p className="eyebrow"> <h2>Mechanical Engineering Assistant</h2></p>
          {/* <h1>Simple frontend for your backend chatbot</h1> */}
          <p className="hero-copy">
            Use the chat box below to ask about manufacturing, CNC, PLCs,
            hydraulics, pneumatics, bearings, gears, and maintenance.
          </p>
        </section>

        <section className="conversation-panel">
          <div className="message-list" aria-live="polite">
            {messages.map((message, index) => (
              <article key={`${message.role}-${index}`} className={`message ${message.role}`}>
                <span className="message-role">{message.role === 'user' ? 'You' : 'Bot'}</span>
                <p>{message.text}</p>
              </article>
            ))}
            {loading ? (
              <article className="message assistant">
                <span className="message-role">Bot</span>
                <p>Thinking...</p>
              </article>
            ) : null}
          </div>

          <form className="composer" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="question">
              Ask a question
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Type your mechanical engineering question..."
              rows="4"
            />
            {error ? <p className="error-message">{error}</p> : null}
            <div className="composer-actions">
              <button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Ask the assistant'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;
