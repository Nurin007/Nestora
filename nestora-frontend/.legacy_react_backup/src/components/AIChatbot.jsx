import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello! I am Nestora AI, your smart real estate assistant. Ask me anything about property prices, inspection bookings, or location yields in Bangladesh.' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: messages.length + 1, sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const query = input.toLowerCase();
    setInput('');

    // Generate intelligent AI response mock
    setTimeout(() => {
      let botResponse = "I'm analyzing that request. For premium locations like Gulshan and Banani, square feet rates currently range between BDT 14,000 to BDT 22,000. For agriculture/land near Gazipur, expectation is around BDT 4-6 Million per decimal. How else can I assist you?";
      
      if (query.includes('gulshan') || query.includes('penthouse')) {
        botResponse = 'Gulshan 2 holds the highest residential demand. A typical premium penthouse (3000+ sq ft) is valued between BDT 32M to BDT 45M. We recommend scheduling an inspection on our platform to verify Rajas and structural clearances.';
      } else if (query.includes('booking') || query.includes('visit') || query.includes('inspect')) {
        botResponse = 'You can schedule a visit by opening any property details page, choosing an available date/time slot, and submitting the request. Once approved by the owner, it will appear in your Buyer Dashboard.';
      } else if (query.includes('kyc') || query.includes('verify')) {
        botResponse = 'To verify your profile, go to your Buyer Dashboard -> KYC Verification, submit your National ID (NID) or Passport details. Admin reviews are processed in under 24 hours.';
      } else if (query.includes('uttara') || query.includes('plot')) {
        botResponse = 'Uttara residential sectors (Sector 11-14) are experiencing steady capital appreciation of 8.5% annually. Residential plots are priced around BDT 15M to BDT 30M depending on road width and lake facing views.';
      } else if (query.includes('bashundhara') || query.includes('rental') || query.includes('duplex')) {
        botResponse = 'Bashundhara R/A offers premium family duplex rentals ranging from BDT 70,000 to BDT 120,000 per month. Perfect security with gate passes and security checkpoints.';
      }

      setMessages(prev => [...prev, { id: prev.length + 1, sender: 'bot', text: botResponse }]);
    }, 800);
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 10000 }}>
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
            color: '#0b0f19',
            border: 'none',
            boxShadow: '0 4px 20px var(--primary-glow)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(10deg)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
        >
          <MessageSquare size={28} />
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="glass" style={{
          width: '360px',
          height: '480px',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          animation: 'fade-in 0.25s ease-out'
        }}>
          {/* Header */}
          <div style={{
            background: 'rgba(204, 163, 83, 0.1)',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bot size={20} style={{ color: 'var(--primary)' }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', margin: 0 }}>Nestora AI Agent</h4>
                <span style={{ fontSize: '0.7rem', color: 'var(--secondary)' }}>● Online</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{
            flexGrow: 1,
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}
              >
                {msg.sender === 'bot' && (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(204, 163, 83, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Bot size={14} style={{ color: 'var(--primary)' }} />
                  </div>
                )}
                
                <div style={{
                  maxWidth: '75%',
                  background: msg.sender === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                  color: msg.sender === 'user' ? '#0b0f19' : 'var(--text-main)',
                  padding: '10px 14px',
                  borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  fontSize: '0.85rem',
                  lineHeight: '1.4',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Form Input */}
          <form onSubmit={handleSend} style={{
            padding: '16px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            gap: '10px',
            background: 'rgba(0,0,0,0.1)'
          }}>
            <input
              type="text"
              placeholder="Ask Nestora AI..."
              className="input-field"
              style={{ height: '40px', fontSize: '0.85rem', padding: '0 12px' }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0 16px', height: '40px' }}>
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
