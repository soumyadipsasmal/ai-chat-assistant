import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ─── Styles ───────────────────────────────────────────────
const styles = {
  app: { display: 'flex', height: '100vh', fontFamily: 'Segoe UI, sans-serif', background: '#0d1117', color: '#e6edf3' },
  sidebar: { width: '260px', background: '#161b22', borderRight: '1px solid #30363d', display: 'flex', flexDirection: 'column', padding: '16px' },
  sidebarTitle: { fontSize: '20px', fontWeight: 'bold', color: '#58a6ff', marginBottom: '16px', textAlign: 'center' },
  newChatBtn: { background: '#238636', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', cursor: 'pointer', marginBottom: '16px', fontSize: '14px' },
  chatItem: { padding: '10px', borderRadius: '6px', cursor: 'pointer', marginBottom: '6px', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  main: { flex: 1, display: 'flex', flexDirection: 'column' },
  header: { background: '#161b22', padding: '16px 24px', borderBottom: '1px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  messages: { flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' },
  userMsg: { alignSelf: 'flex-end', background: '#1f6feb', padding: '12px 16px', borderRadius: '18px 18px 4px 18px', maxWidth: '70%', lineHeight: '1.5' },
  aiMsg: { alignSelf: 'flex-start', background: '#21262d', padding: '12px 16px', borderRadius: '18px 18px 18px 4px', maxWidth: '70%', lineHeight: '1.5', border: '1px solid #30363d' },
  inputArea: { padding: '16px 24px', background: '#161b22', borderTop: '1px solid #30363d', display: 'flex', gap: '12px' },
  input: { flex: 1, background: '#0d1117', border: '1px solid #30363d', borderRadius: '8px', padding: '12px 16px', color: '#e6edf3', fontSize: '15px', outline: 'none' },
  sendBtn: { background: '#1f6feb', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 24px', cursor: 'pointer', fontSize: '15px' },
  authContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0d1117' },
  authBox: { background: '#161b22', padding: '40px', borderRadius: '12px', border: '1px solid #30363d', width: '360px' },
  authTitle: { fontSize: '24px', fontWeight: 'bold', color: '#58a6ff', textAlign: 'center', marginBottom: '24px' },
  authInput: { width: '100%', background: '#0d1117', border: '1px solid #30363d', borderRadius: '8px', padding: '12px', color: '#e6edf3', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box', outline: 'none' },
  authBtn: { width: '100%', background: '#238636', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', cursor: 'pointer', fontSize: '15px', marginBottom: '12px' },
  authSwitch: { color: '#58a6ff', cursor: 'pointer', textAlign: 'center', fontSize: '14px' },
  typing: { alignSelf: 'flex-start', background: '#21262d', padding: '12px 16px', borderRadius: '18px', border: '1px solid #30363d', color: '#8b949e' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#8b949e' },
  emptyIcon: { fontSize: '64px', marginBottom: '16px' },
  deleteBtn: { background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: '16px', marginLeft: '8px' },
};

// ─── Auth Component ───────────────────────────────────────
function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setError('');
      const url = isLogin ? `${API}/auth/login` : `${API}/auth/register`;
      const { data } = await axios.post(url, form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={styles.authContainer}>
      <div style={styles.authBox}>
        <div style={styles.authTitle}>🤖 AI Chat Assistant</div>
        {!isLogin && (
          <input style={styles.authInput} placeholder="Username" value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })} />
        )}
        <input style={styles.authInput} placeholder="Email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <input style={styles.authInput} placeholder="Password" type="password" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        {error && <p style={{ color: '#f85149', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
        <button style={styles.authBtn} onClick={handleSubmit}>
          {isLogin ? 'Login' : 'Register'}
        </button>
        <div style={styles.authSwitch} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (user) loadChats();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChats = async () => {
    const { data } = await axios.get(`${API}/chat`, { headers });
    setChats(data);
  };

  const newChat = async () => {
    const { data } = await axios.post(`${API}/chat/new`, {}, { headers });
    setActiveChat(data._id);
    setMessages([]);
    loadChats();
  };

  const openChat = async (id) => {
    setActiveChat(id);
    const { data } = await axios.get(`${API}/chat/${id}`, { headers });
    setMessages(data.messages);
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeChat) return;
    const msg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/chat/${activeChat}/message`, { message: msg }, { headers });
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      loadChats();
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Error: ' + (err.response?.data?.message || 'Something went wrong') }]);
    }
    setLoading(false);
  };

  const deleteChat = async (e, id) => {
    e.stopPropagation();
    await axios.delete(`${API}/chat/${id}`, { headers });
    if (activeChat === id) { setActiveChat(null); setMessages([]); }
    loadChats();
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setChats([]);
    setActiveChat(null);
    setMessages([]);
  };

  if (!user) return <Auth onLogin={setUser} />;

  return (
    <div style={styles.app}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarTitle}>🤖 AI Chat</div>
        <button style={styles.newChatBtn} onClick={newChat}>+ New Chat</button>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {chats.map(chat => (
            <div key={chat._id}
              style={{ ...styles.chatItem, background: activeChat === chat._id ? '#1f6feb22' : 'transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              onClick={() => openChat(chat._id)}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>💬 {chat.title}</span>
              <button style={styles.deleteBtn} onClick={e => deleteChat(e, chat._id)}>🗑</button>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #30363d', paddingTop: '12px', fontSize: '13px', color: '#8b949e' }}>
          <div>👤 {user.username}</div>
          <div style={{ color: '#f85149', cursor: 'pointer', marginTop: '8px' }} onClick={logout}>🚪 Logout</div>
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        <div style={styles.header}>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>AI Chat Assistant</span>
          <span style={{ color: '#8b949e', fontSize: '13px' }}>Powered by Claude</span>
        </div>

        {!activeChat ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🤖</div>
            <div style={{ fontSize: '20px', marginBottom: '8px' }}>Welcome, {user.username}!</div>
            <div>Click "New Chat" to start talking with AI</div>
          </div>
        ) : (
          <>
            <div style={styles.messages}>
              {messages.map((msg, i) => (
                <div key={i} style={msg.role === 'user' ? styles.userMsg : styles.aiMsg}>
                  {msg.content}
                </div>
              ))}
              {loading && <div style={styles.typing}>🤖 AI is thinking...</div>}
              <div ref={messagesEndRef} />
            </div>
            <div style={styles.inputArea}>
              <input style={styles.input} value={input} placeholder="Type your message..."
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()} />
              <button style={styles.sendBtn} onClick={sendMessage} disabled={loading}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
