export default function Sidebar({
  activeChatId,
  chats,
  error,
  isLoading,
  onCreateChat,
  onDeleteChat,
  onLogout,
  onSelectChat,
  user,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div>
          <div className="brand-chip">Full-Stack Demo</div>
          <h2>Chats</h2>
        </div>

        <button className="primary-button sidebar-button" onClick={onCreateChat} type="button">
          New Chat
        </button>
      </div>

      {error ? <div className="inline-alert">{error}</div> : null}

      <div className="chat-list">
        {isLoading ? <div className="muted-copy">Loading conversations...</div> : null}

        {!isLoading && chats.length === 0 ? (
          <div className="muted-copy">
            No chats yet. Start one to create your first saved conversation.
          </div>
        ) : null}

        {chats.map((chat) => (
          <div
            className={`chat-list-item ${chat._id === activeChatId ? 'chat-list-item-active' : ''}`}
            key={chat._id}
          >
            <button className="chat-select" onClick={() => onSelectChat(chat._id)} type="button">
              <strong>{chat.title}</strong>
              <div className="chat-meta">
                Updated {new Date(chat.updatedAt).toLocaleDateString()}
              </div>
            </button>

            <button
              aria-label={`Delete ${chat.title}`}
              className="chat-delete"
              onClick={() => onDeleteChat(chat._id)}
              type="button"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-name">{user.username}</div>
          <div className="user-email">{user.email}</div>
        </div>

        <button className="ghost-button ghost-button-danger" onClick={onLogout} type="button">
          Log Out
        </button>
      </div>
    </aside>
  );
}
