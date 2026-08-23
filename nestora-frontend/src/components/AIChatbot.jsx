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

    // Generate intelligent AI response
    setTimeout(() => {
      let botResponse = "";

      if (query.includes('who are you') || query.includes('what are you') || query.includes('about you') || query.includes('tumi k') || query.includes('apni k')) {
        botResponse = "I am **Nestora AI**, your dedicated smart real estate assistant for Nestora platform! 🏢✨ I can help you search properties, check verified valuations in Bangladesh, guide you through visit scheduling & booking approvals, and answer questions about locations like Dhaka, Chittagong, Sylhet, and Cox's Bazar.";
      } else if (query.includes('who made') || query.includes('who created') || query.includes('developer') || query.includes('admin') || query.includes('owner') || query.includes('banayese')) {
        botResponse = "Nestora is an AI-powered Smart Real Estate & Transparent Property Management platform engineered for Bangladesh with microservices backend and modern React frontend.";
      } else if (query.includes('hi') || query.includes('hello') || query.includes('hey') || query.includes('salam') || query.includes('kemon')) {
        botResponse = "Hello! 👋 How can I assist you today with property search, price estimations, or scheduling visit inspections on Nestora?";
      } else if (query.includes('how to book') || query.includes('booking') || query.includes('visit') || query.includes('inspect') || query.includes('schedule')) {
        botResponse = "📅 **To book a property visit:**\n1. Go to any property details page.\n2. Pick your preferred date & time slot.\n3. Click **'Schedule Visit'**.\n4. Your booking stays '⏳ Admin Approval Pending' until the Admin/Owner reviews & confirms it!";
      } else if (query.includes('price') || query.includes('cost') || query.includes('dam') || query.includes('valuation') || query.includes('rate')) {
        botResponse = "📊 **Market Price Insights in BD:**\n• **Gulshan / Banani:** BDT 14,000 - 24,000 / sq ft\n• **Dhanmondi / Uttara:** BDT 9,000 - 15,000 / sq ft\n• **Bashundhara R/A:** BDT 7,500 - 12,000 / sq ft (Rent: 60k - 120k/mo)\n• **Sylhet & Chittagong:** BDT 6,000 - 11,000 / sq ft\n• **Gazipur Farmland:** BDT 3.5M - 6M / decimal.";
      } else if (query.includes('gulshan') || query.includes('penthouse')) {
        botResponse = "Gulshan 2 holds prime residential demand. A typical luxury penthouse (3,200+ sq ft) is valued at BDT 35M to 45M with Lake View and smart security systems.";
      } else if (query.includes('kyc') || query.includes('verify') || query.includes('nid')) {
        botResponse = "🔐 **KYC Verification:** Go to your Buyer Dashboard -> KYC Verification, submit your NID or Passport details. Admin reviews and approves it within 24 hours.";
      } else if (query.includes('bashundhara') || query.includes('rental') || query.includes('duplex')) {
        botResponse = "Bashundhara R/A offers premium family duplex rentals ranging from BDT 70,000 to BDT 140,000 per month with 24/7 security checkpoints and rooftop gardens.";
      } else if (query.includes('sylhet') || query.includes('tea estate') || query.includes('vacation')) {
        botResponse = "Sylhet & Sreemangal offer breathtaking vacation villas & tea garden bungalows ranging between BDT 18M to 25M with great passive holiday rental income potential!";
      } else if (query.includes('cox') || query.includes('beach') || query.includes('sea')) {
        botResponse = "Cox's Bazar beachfront apartments along Marine Drive provide high-yield vacation rental returns (approx. BDT 31M for sea-facing 3-bed suites).";
      } else {
        botResponse = "I can help you with property prices across Bangladesh, how to schedule visit inspections, KYC verification, or mortgage calculations. Feel free to ask about any specific location or feature!";
      }

      setMessages(prev => [...prev, { id: prev.length + 1, sender: 'bot', text: botResponse }]);
    }, 600);
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
