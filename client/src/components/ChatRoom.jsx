import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatRoom = ({ contextId, contextType, user, isOwner }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'notice'
  const chatEndRef = useRef(null); // Auto-scroll to bottom

  // Poll for new messages every 2 seconds (Simple "Real-time")
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000); 
    return () => clearInterval(interval);
  }, [contextId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const fetchMessages = async () => {
    try {
      // Determine URL based on context (Space or Subspace)
      const url = contextType === 'space' 
        ? `https://nexus-io.onrender.com/api/messages/space/${contextId}`
        : `https://nexus-io.onrender.com/api/messages/subspace/${contextId}`;
      
      const res = await axios.get(url);
      setMessages(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post('https://nexus-io.onrender.com/api/messages/send', {
        senderId: user._id,
        username: user.username,
        content: newMessage,
        [contextType === 'space' ? 'spaceId' : 'subspaceId']: contextId,
        type: activeTab // 'chat' or 'notice'
      });
      setNewMessage('');
      fetchMessages();
    } catch (err) { console.error(err); }
  };

  // Filter messages based on active tab
  const filteredMessages = messages.filter(msg => msg.type === activeTab);

  return (
    <div className="card" style={{ height: '500px', display: 'flex', flexDirection: 'column', padding: 0 }}>
      {/* Header / Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #333' }}>
        <button 
          onClick={() => setActiveTab('chat')}
          style={{ 
            flex: 1, 
            background: activeTab === 'chat' ? '#2a2a35' : 'transparent', 
            color: activeTab === 'chat' ? 'var(--accent)' : '#666',
            borderRadius: 0 
          }}
        >
          💬 Chat
        </button>
        <button 
          onClick={() => setActiveTab('notice')}
          style={{ 
            flex: 1, 
            background: activeTab === 'notice' ? '#2a2a35' : 'transparent', 
            color: activeTab === 'notice' ? '#ff5252' : '#666',
            borderRadius: 0
          }}
        >
          📢 Notice Board
        </button>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredMessages.length === 0 && <p style={{textAlign: 'center', fontSize: '0.8rem'}}>No messages yet.</p>}
        
        {filteredMessages.map((msg) => (
          <div key={msg._id} style={{ 
            alignSelf: msg.sender === user._id ? 'flex-end' : 'flex-start',
            maxWidth: '80%',
            background: msg.type === 'notice' ? 'rgba(255, 82, 82, 0.1)' : (msg.sender === user._id ? 'var(--accent)' : '#333'),
            padding: '8px 12px',
            borderRadius: '12px',
            border: msg.type === 'notice' ? '1px solid #ff5252' : 'none'
          }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2px' }}>
              {msg.username} {msg.type === 'notice' && '🔴 OFFICIAL'}
            </div>
            <div>{msg.content}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      {/* Only Owners can post Notices, Everyone can Chat */}
      {(activeTab === 'chat' || isOwner) ? (
        <form onSubmit={handleSend} style={{ padding: '10px', borderTop: '1px solid #333', display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder={activeTab === 'notice' ? "Post an announcement..." : "Type a message..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{ marginBottom: 0 }}
          />
          <button type="submit" className={activeTab === 'notice' ? 'btn-danger' : 'btn-primary'} style={{ width: 'auto' }}>
            ➤
          </button>
        </form>
      ) : (
        <div style={{ padding: '10px', textAlign: 'center', color: '#666', fontSize: '0.8rem' }}>
          Only Admins can post notices.
        </div>
      )}
    </div>
  );
};

export default ChatRoom;