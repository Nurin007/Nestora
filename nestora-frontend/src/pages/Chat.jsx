import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, CheckCircle, ArrowLeft, MessageSquare, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Chat({ user }) {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // Initial mock active chat threads
  const [threads, setThreads] = useState([
    {
      id: 1,
      name: 'Alhaz Properties Ltd.',
      role: 'OWNER',
      propertyTitle: 'Luxury Gold-Accent Penthouse',
      unread: 1,
      messages: [
        { id: 1, sender: 'other', text: 'Hi, thank you for showing interest in our Gulshan penthouse. We can arrange a visit this weekend.' },
        { id: 2, sender: 'user', text: 'Awesome! Is 11:00 AM on Saturday fine for inspection?' },
        { id: 3, sender: 'other', text: 'Yes, that works. Please submit the slot request on the platform so our managers can approve it.' }
      ]
    },
    {
      id: 2,
      name: 'Bproperty Agent Rafiq',
      role: 'AGENT',
      propertyTitle: 'Modern Duplex in Bashundhara',
      unread: 0,
      messages: [
        { id: 1, sender: 'other', text: 'Hello! I am Rafiq, the listing agent for the Bashundhara duplex. Let me know if you have questions.' },
        { id: 2, sender: 'user', text: 'Does the rental include maintenance fees and gas connection bills?' },
        { id: 3, sender: 'other', text: 'Gas is included, but there is a monthly service charge of BDT 8,000 for elevator and security.' }
      ]
    }
  ]);

  const [activeThreadId, setActiveThreadId] = useState(1);
  const [input, setInput] = useState('');

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages]);

  // Handle message sending
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      id: activeThread.messages.length + 1,
      sender: 'user',
      text: input
    };

    const updatedThreads = threads.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    });

    setThreads(updatedThreads);
    const sentText = input;
    setInput('');

    // Trigger mock responder from owner/agent
    setTimeout(() => {
      let replyText = "I will check the details and get back to you shortly. Feel free to submit an inspection request in the meantime!";
      if (sentText.toLowerCase().includes('hello') || sentText.toLowerCase().includes('hi')) {
        replyText = "Hello! Yes, how can I help you regarding the property listing?";
      } else if (sentText.toLowerCase().includes('price') || sentText.toLowerCase().includes('cost') || sentText.toLowerCase().includes('discount')) {
        replyText = "The asking price is slightly negotiable for genuine buyers who complete the KYC verification process.";
      }

      setThreads(prevThreads => prevThreads.map(t => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            messages: [...t.messages, { id: t.messages.length + 1, sender: 'other', text: replyText }]
          };
        }
        return t;
      }));
    }, 1200);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 0 80px 0' }}>
      
      {/* Back button */}
      <div style={{ marginBottom: '24px' }}>
        <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Inboxes & Inquiries</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Communicate securely with property owners, verification agents, and managers.</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        height: '600px',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)'
      }}>
        
        {/* SIDEBAR: ACTIVE CHAT THREADS */}
        <div style={{
          background: 'rgba(22, 28, 45, 0.4)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} style={{ color: 'var(--primary)' }} /> Chats
            </h3>
          </div>
          <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {threads.map(t => (
              <div
                key={t.id}
                onClick={() => {
                  setActiveThreadId(t.id);
                  // Clear unread
                  setThreads(threads.map(thread => thread.id === t.id ? { ...thread, unread: 0 } : thread));
                }}
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  cursor: 'pointer',
                  background: t.id === activeThreadId ? 'rgba(255,255,255,0.05)' : 'transparent',
                  transition: 'background 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{t.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '2px' }}>{t.propertyTitle}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '200px' }}>
                    {t.messages[t.messages.length - 1]?.text}
                  </p>
                </div>
                {t.unread > 0 && (
                  <span style={{
                    background: 'var(--primary)',
                    color: '#0b0f19',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>{t.unread}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVE CHAT MAIN VIEWPORT */}
        <div className="glass" style={{ borderRadius: '0', display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {/* Thread Header */}
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.15)'
          }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>{activeThread.name}</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {activeThread.role} | Subject: {activeThread.propertyTitle}
              </span>
            </div>
          </div>

          {/* Messages List */}
          <div style={{
            flexGrow: 1,
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {activeThread.messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}
              >
                {msg.sender !== 'user' && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <User size={16} style={{ color: 'var(--primary)' }} />
                  </div>
                )}
                <div style={{
                  maxWidth: '65%',
                  background: msg.sender === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.02)',
                  color: msg.sender === 'user' ? '#0b0f19' : 'var(--text-main)',
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{
            padding: '20px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            gap: '12px',
            background: 'rgba(0,0,0,0.1)'
          }}>
            <input
              type="text"
              placeholder={`Send message to ${activeThread.name}...`}
              className="input-field"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0 24px', height: '46px' }}>
              <Send size={16} /> Send
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
