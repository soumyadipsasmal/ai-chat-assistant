import { useEffect, useRef, useState } from 'react';

import apiClient, { setAuthToken } from './api';
import AuthForm from './components/AuthForm';
import ChatPanel from './components/ChatPanel';
import Sidebar from './components/Sidebar';
import { validateMessageDraft } from './utils/validation';

const SESSION_STORAGE_KEY = 'ai-chat-session';
const defaultApiMeta = { aiMode: 'mock', isDemoMode: true };

const readStoredSession = () => {
  try {
    const rawSession = localStorage.getItem(SESSION_STORAGE_KEY);
    return rawSession ? JSON.parse(rawSession) : null;
  } catch (error) {
    return null;
  }
};

export default function AppShell() {
  const [session, setSession] = useState(readStoredSession);
  const [apiMeta, setApiMeta] = useState(defaultApiMeta);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [authError, setAuthError] = useState('');
  const [sidebarError, setSidebarError] = useState('');
  const [chatError, setChatError] = useState('');
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [isChatsLoading, setIsChatsLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const activeChat = chats.find((chat) => chat._id === activeChatId) || null;

  useEffect(() => {
    setAuthToken(session?.token || null);
  }, [session]);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const { data } = await apiClient.get('/meta');
        setApiMeta(data);
      } catch (error) {
        setApiMeta(defaultApiMeta);
      }
    };

    loadMeta();
  }, []);

  useEffect(() => {
    if (session) {
      loadChats();
    } else {
      setChats([]);
      setMessages([]);
      setActiveChatId(null);
    }
  }, [session]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const persistSession = (nextSession) => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  };

  const clearSession = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setSession(null);
    setAuthToken(null);
  };

  const loadChats = async () => {
    setIsChatsLoading(true);
    setSidebarError('');

    try {
      const { data } = await apiClient.get('/chat');
      setChats(data);
    } catch (error) {
      setSidebarError(
        error.response?.data?.message || 'Unable to load chats right now.'
      );
    } finally {
      setIsChatsLoading(false);
    }
  };

  const syncChatFromServer = async (chatId) => {
    if (!chatId) {
      return;
    }

    try {
      const { data } = await apiClient.get(`/chat/${chatId}`);
      setMessages(data.messages || []);
    } catch (error) {
      setMessages([]);
    }
  };

  const createChat = async () => {
    setSidebarError('');

    try {
      const { data } = await apiClient.post('/chat/new');
      setActiveChatId(data._id);
      setMessages([]);
      await loadChats();
      return data;
    } catch (error) {
      setSidebarError(
        error.response?.data?.message || 'Unable to create a new chat right now.'
      );
      return null;
    }
  };

  const handleAuthSubmit = async (mode, values) => {
    setIsAuthSubmitting(true);
    setAuthError('');

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const { data } = await apiClient.post(endpoint, values);
      persistSession({ token: data.token, user: data.user });
      return true;
    } catch (error) {
      setAuthError(error.response?.data?.message || 'Authentication failed.');
      return false;
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleSelectChat = async (chatId) => {
    setActiveChatId(chatId);
    setChatError('');
    setIsChatLoading(true);

    try {
      const { data } = await apiClient.get(`/chat/${chatId}`);
      setMessages(data.messages || []);
    } catch (error) {
      setChatError(error.response?.data?.message || 'Unable to open this chat.');
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleDeleteChat = async (chatId) => {
    setSidebarError('');

    try {
      await apiClient.delete(`/chat/${chatId}`);

      if (activeChatId === chatId) {
        setActiveChatId(null);
        setMessages([]);
      }

      await loadChats();
    } catch (error) {
      setSidebarError(error.response?.data?.message || 'Unable to delete this chat.');
    }
  };

  const handleLogout = () => {
    clearSession();
  };

  const handleSendMessage = async () => {
    const validationMessage = validateMessageDraft(draft);

    if (validationMessage) {
      setChatError(validationMessage);
      return;
    }

    const trimmedDraft = draft.trim();
    let chatId = activeChatId;

    if (!chatId) {
      const newChat = await createChat();
      if (!newChat) {
        return;
      }

      chatId = newChat._id;
    }

    setDraft('');
    setChatError('');
    setIsSending(true);
    setMessages((previousMessages) => [
      ...previousMessages,
      { content: trimmedDraft, role: 'user' },
    ]);

    try {
      const { data } = await apiClient.post(`/chat/${chatId}/message`, {
        message: trimmedDraft,
      });

      setActiveChatId(chatId);
      setMessages(data.chat.messages || []);
      await loadChats();
    } catch (error) {
      setChatError(
        error.response?.data?.message || 'Unable to send the message right now.'
      );
      await syncChatFromServer(chatId);
    } finally {
      setIsSending(false);
    }
  };

  if (!session) {
    return (
      <AuthForm
        isSubmitting={isAuthSubmitting}
        serverError={authError}
        onSubmit={handleAuthSubmit}
      />
    );
  }

  return (
    <div className="app-shell">
      <Sidebar
        activeChatId={activeChatId}
        chats={chats}
        error={sidebarError}
        isLoading={isChatsLoading}
        onCreateChat={createChat}
        onDeleteChat={handleDeleteChat}
        onLogout={handleLogout}
        onSelectChat={handleSelectChat}
        user={session.user}
      />

      <ChatPanel
        activeChatTitle={activeChat?.title}
        chatError={chatError}
        draft={draft}
        isChatLoading={isChatLoading}
        isSending={isSending}
        messages={messages}
        messagesEndRef={messagesEndRef}
        onDraftChange={setDraft}
        onSend={handleSendMessage}
        user={session.user}
        variantLabel={apiMeta.isDemoMode ? 'Demo AI Mode' : 'Claude Connected'}
      />
    </div>
  );
}
