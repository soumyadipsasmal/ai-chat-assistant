export default function ChatPanel({
  activeChatTitle,
  chatError,
  draft,
  isChatLoading,
  isSending,
  messages,
  messagesEndRef,
  onDraftChange,
  onSend,
  user,
  variantLabel,
}) {
  const handleComposerKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <main className="chat-panel">
      <header className="chat-header">
        <div>
          <div className="eyebrow">Interview-ready build</div>
          <h1>{activeChatTitle || 'Start a new conversation'}</h1>
        </div>

        <div className="status-pill">{variantLabel}</div>
      </header>

      <section className="chat-history">
        {chatError ? <div className="inline-alert">{chatError}</div> : null}

        {isChatLoading ? <div className="muted-copy">Loading messages...</div> : null}

        {!isChatLoading && messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-card">
              <h2>Hi {user.username}</h2>
              <p>
                This chat assistant saves conversations, supports authentication,
                and can run in free demo mode or with Claude configured.
              </p>
              <p className="muted-copy">
                Type a message below. If there is no active chat yet, sending your
                first message will create one automatically.
              </p>
            </div>
          </div>
        ) : null}

        {messages.map((message, index) => (
          <article
            className={`message-bubble ${
              message.role === 'user' ? 'message-user' : 'message-assistant'
            }`}
            key={`${message.role}-${index}`}
          >
            <div className="message-role">
              {message.role === 'user' ? 'You' : 'Assistant'}
            </div>
            <p>{message.content}</p>
          </article>
        ))}

        {isSending ? (
          <article className="message-bubble message-assistant message-pending">
            <div className="message-role">Assistant</div>
            <p>Thinking through your message...</p>
          </article>
        ) : null}

        <div ref={messagesEndRef} />
      </section>

      <footer className="composer">
        <textarea
          className="composer-input"
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={handleComposerKeyDown}
          placeholder="Ask something, explain your idea, or test the AI flow..."
          rows={3}
          value={draft}
        />

        <div className="composer-actions">
          <div className="muted-copy">
            Press Enter to send. Use Shift + Enter for a new line.
          </div>

          <button className="primary-button" disabled={isSending} onClick={onSend} type="button">
            {isSending ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </footer>
    </main>
  );
}
