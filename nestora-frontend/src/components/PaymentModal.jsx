import React, { useState } from 'react';
import { 
  X, CheckCircle, ShieldCheck, CreditCard, Smartphone, Building, 
  Receipt, ArrowRight, Lock, AlertCircle, RefreshCw, Copy, Check, Printer
} from 'lucide-react';

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  property, 
  user, 
  defaultAmount, 
  paymentType = 'BOOKING_ADVANCE', // 'BOOKING_ADVANCE', 'FULL_PAYMENT', 'MONTHLY_RENT'
  onPaymentSuccess,
  triggerNotification
}) {
  if (!isOpen || !property) return null;

  // Selected Payment Method: 'BKASH' | 'NAGAD' | 'ROCKET' | 'CARD' | 'BANK'
  const [method, setMethod] = useState('BKASH');
  const [step, setStep] = useState(1); // 1: Method & Amount, 2: Gateway / Form, 3: Processing, 4: Receipt
  
  // Suggested amounts or custom
  const suggestedAmount = defaultAmount || (property.propertyType === 'RENTAL' ? property.pricing : 50000);
  const [amount, setAmount] = useState(suggestedAmount);
  
  // Gateway Inputs
  const [senderPhone, setSenderPhone] = useState(user?.phoneNumber || '');
  const [transactionId, setTransactionId] = useState('');
  const [pinOrOtp, setPinOrOtp] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(user?.fullName || '');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [bankName, setBankName] = useState('City Bank Ltd');
  const [bankBranch, setBankBranch] = useState('Gulshan Branch');
  const [bankTxnRef, setBankTxnRef] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);

  const [error, setError] = useState('');
  const [completedPayment, setCompletedPayment] = useState(null);

  // Format currency in BDT
  const formatBDT = (val) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const getMethodMeta = () => {
    switch (method) {
      case 'BKASH':
        return {
          name: 'bKash',
          tagline: 'Instant Mobile Banking',
          color: '#e2136e',
          bgColor: 'rgba(226, 19, 110, 0.12)',
          borderColor: '#e2136e',
          account: '01711-234567',
          accountType: 'Merchant Account'
        };
      case 'NAGAD':
        return {
          name: 'Nagad',
          tagline: 'Dak Bibhag Mobile Financial Service',
          color: '#f7941d',
          bgColor: 'rgba(247, 148, 29, 0.12)',
          borderColor: '#f7941d',
          account: '01822-345678',
          accountType: 'Merchant Account'
        };
      case 'ROCKET':
        return {
          name: 'Rocket',
          tagline: 'Dutch-Bangla Bank Mobile Banking',
          color: '#8b278a',
          bgColor: 'rgba(139, 39, 138, 0.12)',
          borderColor: '#8b278a',
          account: '01933-456789-0',
          accountType: 'Corporate Wallet'
        };
      case 'CARD':
        return {
          name: 'Visa / MasterCard / Amex',
          tagline: 'Credit or Debit Card Gateway',
          color: '#3b82f6',
          bgColor: 'rgba(59, 130, 246, 0.12)',
          borderColor: '#3b82f6',
          account: 'Nestora SSLCommerz Secure',
          accountType: '256-bit Encrypted'
        };
      case 'BANK':
        return {
          name: 'Direct Bank Transfer (EFT/NPSB)',
          tagline: 'Bangladeshi Commercial Banks',
          color: '#10b981',
          bgColor: 'rgba(16, 185, 129, 0.12)',
          borderColor: '#10b981',
          account: '1102938475001 (City Bank Ltd)',
          accountType: 'Corporate Current Account'
        };
      default:
        return { name: 'Payment', color: 'var(--primary)', bgColor: 'transparent', borderColor: 'var(--border-color)' };
    }
  };

  const currentMeta = getMethodMeta();

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText(currentMeta.account.replace(/[^0-9]/g, ''));
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const handleProcessPayment = (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!amount || amount <= 0) {
      setError('Please enter a valid payment amount.');
      return;
    }

    if (method === 'BKASH' || method === 'NAGAD' || method === 'ROCKET') {
      if (!senderPhone || senderPhone.length < 10) {
        setError('Please enter your valid Bangladeshi mobile number.');
        return;
      }
    } else if (method === 'CARD') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 15) {
        setError('Please enter a valid 16-digit card number.');
        return;
      }
      if (!cardExpiry || !cardCvv) {
        setError('Please complete the expiry date and CVV code.');
        return;
      }
    } else if (method === 'BANK') {
      if (!bankTxnRef) {
        setError('Please enter the Bank Deposit/Transfer Reference or Transaction ID.');
        return;
      }
    }

    // Step 3: Simulate processing animation
    setStep(3);

    setTimeout(() => {
      // Auto-generate realistic transaction ID if user didn't enter one
      const generatedTxnId = transactionId || (
        method === 'BKASH' ? 'BKX' + Math.random().toString(36).substring(2, 9).toUpperCase() :
        method === 'NAGAD' ? 'NGD' + Math.random().toString(36).substring(2, 9).toUpperCase() :
        method === 'ROCKET' ? 'RKT' + Math.random().toString(36).substring(2, 9).toUpperCase() :
        method === 'CARD' ? 'CRD' + Math.random().toString(36).substring(2, 9).toUpperCase() :
        'BNK' + Math.random().toString(36).substring(2, 9).toUpperCase()
      );

      const newPayment = {
        id: Date.now(),
        transactionId: generatedTxnId,
        propertyId: property.id,
        propertyTitle: property.title,
        propertyCity: property.city,
        propertyAddress: property.address,
        propertyType: property.propertyType,
        buyerId: user?.id || 4,
        buyerName: user?.fullName || 'Anonymous Buyer',
        buyerEmail: user?.email || 'buyer@example.com',
        buyerPhone: senderPhone || user?.phoneNumber || '+8801700000000',
        ownerId: property.ownerId || 2,
        paymentType: paymentType,
        paymentMethod: method,
        amount: parseFloat(amount),
        currency: 'BDT',
        status: method === 'BANK' ? 'PENDING' : 'COMPLETED',
        note: paymentNote || `${paymentType.replace('_', ' ')} for ${property.title}`,
        createdAt: new Date().toISOString(),
        paymentMeta: {
          methodName: currentMeta.name,
          senderPhone: senderPhone || 'N/A',
          cardLast4: cardNumber ? cardNumber.slice(-4) : null,
          bankName: method === 'BANK' ? bankName : null,
          bankBranch: method === 'BANK' ? bankBranch : null,
          bankTxnRef: bankTxnRef || null
        }
      };

      setCompletedPayment(newPayment);
      setStep(4);

      if (onPaymentSuccess) {
        onPaymentSuccess(newPayment);
      }

      // 1. Notify Admin (User ID 1)
      if (triggerNotification) {
        triggerNotification(
          1,
          `💰 New Payment Received: ${formatBDT(amount)}`,
          `${user?.fullName || 'Buyer'} paid ${formatBDT(amount)} via ${currentMeta.name} for "${property.title}" (TxnID: ${generatedTxnId}).`
        );

        // 2. Notify Property Owner
        if (property.ownerId) {
          triggerNotification(
            property.ownerId,
            `💰 Payment Received for Your Property: ${formatBDT(amount)}`,
            `Buyer ${user?.fullName || 'A Buyer'} made a ${paymentType.replace('_', ' ').toLowerCase()} payment of ${formatBDT(amount)} for "${property.title}".`
          );
        }

        // 3. Notify Buyer
        if (user?.id) {
          triggerNotification(
            user.id,
            `✅ Payment Successful: ${formatBDT(amount)}`,
            `Your payment of ${formatBDT(amount)} for "${property.title}" was successfully processed via ${currentMeta.name}. Transaction ID: ${generatedTxnId}.`
          );
        }
      }
    }, 1600);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(5, 8, 16, 0.85)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 99999,
      overflow: 'hidden'
    }}>
      <div className="glass animate-fade-in" style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'calc(100% - 32px)',
        maxWidth: step === 4 ? '580px' : '500px',
        maxHeight: '90vh',
        background: '#0e1526',
        borderRadius: '24px',
        border: '1.5px solid rgba(204, 163, 83, 0.4)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(204, 163, 83, 0.15)',
        overflowY: 'auto'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255,255,255,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0b0f19'
            }}>
              <Receipt size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                {step === 4 ? 'Payment Receipt' : 'Nestora Secure Checkout'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                {step === 4 ? 'Official payment voucher' : '256-bit SSL Encrypted Payment Portal'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              borderRadius: '10px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Property Brief Summary */}
        <div style={{
          padding: '14px 24px',
          background: 'rgba(204, 163, 83, 0.05)',
          borderBottom: '1px solid rgba(204, 163, 83, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ overflow: 'hidden', paddingRight: '12px' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.5px' }}>
              {paymentType === 'BOOKING_ADVANCE' ? '🔒 Booking Advance / Token' : paymentType === 'MONTHLY_RENT' ? '🏢 Monthly Rent' : '🏡 Property Purchase'}
            </span>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '2px 0 0 0', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {property.title}
            </h4>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Total Price</span>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {formatBDT(property.pricing)}
            </span>
          </div>
        </div>

        {/* Modal Body based on steps */}
        <div style={{ padding: '24px' }}>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* STEP 1 & 2: SELECT METHOD & FILL DETAILS */}
          {(step === 1 || step === 2) && (
            <form onSubmit={handleProcessPayment}>
              {/* Payment Amount */}
              <div style={{ marginBottom: '20px' }}>
                <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Payment Amount (BDT)</span>
                  <span style={{ color: 'var(--primary)', textTransform: 'none' }}>
                    Payable Now: {formatBDT(amount)}
                  </span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '13px', fontWeight: 800, color: 'var(--primary)' }}>৳</span>
                  <input
                    type="number"
                    min="100"
                    className="input-field"
                    style={{ paddingLeft: '38px', fontSize: '1.1rem', fontWeight: 700 }}
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                  {[
                    { label: '৳25k Advance', val: 25000 },
                    { label: '৳50k Advance', val: 50000 },
                    { label: '৳100k Token', val: 100000 },
                    { label: 'Full Rent/Price', val: property.pricing }
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => setAmount(chip.val)}
                      style={{
                        background: amount === chip.val ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        color: amount === chip.val ? '#0b0f19' : 'var(--text-muted)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Methods Selection Tabs */}
              <div style={{ marginBottom: '20px' }}>
                <label className="input-label">Select Payment Channel</label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '8px'
                }}>
                  {[
                    { id: 'BKASH', name: 'bKash', icon: Smartphone, color: '#e2136e' },
                    { id: 'NAGAD', name: 'Nagad', icon: Smartphone, color: '#f7941d' },
                    { id: 'ROCKET', name: 'Rocket', icon: Smartphone, color: '#8b278a' },
                    { id: 'CARD', name: 'Card', icon: CreditCard, color: '#3b82f6' },
                    { id: 'BANK', name: 'Bank', icon: Building, color: '#10b981' }
                  ].map((m) => {
                    const IconComponent = m.icon;
                    const isSelected = method === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => { setMethod(m.id); setError(''); }}
                        style={{
                          background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                          border: isSelected ? `2px solid ${m.color}` : '1px solid var(--border-color)',
                          borderRadius: '12px',
                          padding: '12px 6px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: isSelected ? `0 0 15px ${m.color}33` : 'none'
                        }}
                      >
                        <div style={{
                          color: m.color,
                          display: 'flex',
                          justifyContent: 'center',
                          marginBottom: '4px'
                        }}>
                          <IconComponent size={20} />
                        </div>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: isSelected ? '#ffffff' : 'var(--text-muted)'
                        }}>
                          {m.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Payment Method UI */}
              <div style={{
                background: currentMeta.bgColor,
                border: `1px solid ${currentMeta.borderColor}44`,
                borderRadius: '16px',
                padding: '18px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: currentMeta.color, margin: 0 }}>
                      {currentMeta.name} Payment
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {currentMeta.tagline}
                    </span>
                  </div>
                  {/* Account Copy box */}
                  {(method === 'BKASH' || method === 'NAGAD' || method === 'ROCKET' || method === 'BANK') && (
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      style={{
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-main)',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      {copiedNumber ? <Check size={12} style={{ color: '#10b981' }} /> : <Copy size={12} />}
                      <span>{copiedNumber ? 'Copied!' : currentMeta.account}</span>
                    </button>
                  )}
                </div>

                {/* Specific Fields for Mobile Banking */}
                {(method === 'BKASH' || method === 'NAGAD' || method === 'ROCKET') && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      Send money or make payment of <strong>{formatBDT(amount)}</strong> to Nestora Official Merchant Account: <span style={{ color: '#ffffff', fontWeight: 700 }}>{currentMeta.account}</span>.
                    </div>
                    <div>
                      <label className="input-label" style={{ fontSize: '0.75rem' }}>Your {currentMeta.name} Mobile Number</label>
                      <input
                        type="tel"
                        className="input-field"
                        placeholder="01XXXXXXXXX"
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="input-label" style={{ fontSize: '0.75rem' }}>
                        Transaction ID (TrxID) / Simulation Code
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. BKX9284920 (or leave empty for auto-simulation)"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Specific Fields for Card */}
                {method === 'CARD' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label className="input-label" style={{ fontSize: '0.75rem' }}>Card Number</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="4111 2222 3333 4444"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px' }}>
                      <div>
                        <label className="input-label" style={{ fontSize: '0.75rem' }}>Cardholder Name</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Name on card"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="input-label" style={{ fontSize: '0.75rem' }}>MM/YY</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="12/28"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="input-label" style={{ fontSize: '0.75rem' }}>CVV</label>
                        <input
                          type="password"
                          className="input-field"
                          placeholder="123"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Specific Fields for Bank Transfer */}
                {method === 'BANK' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      Deposit or transfer to <strong>Nestora Real Estate Ltd</strong>. Account: <code>1102938475001</code> (The City Bank Ltd, Gulshan Branch, Routing: 225272938).
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label className="input-label" style={{ fontSize: '0.75rem' }}>Your Bank Name</label>
                        <input
                          type="text"
                          className="input-field"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="input-label" style={{ fontSize: '0.75rem' }}>Branch Name</label>
                        <input
                          type="text"
                          className="input-field"
                          value={bankBranch}
                          onChange={(e) => setBankBranch(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="input-label" style={{ fontSize: '0.75rem' }}>Deposit / Transfer Ref No / Txn ID</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. DEP-2026-94829 or NPSB Ref"
                        value={bankTxnRef}
                        onChange={(e) => setBankTxnRef(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Submit Button */}
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  height: '52px',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <Lock size={18} />
                <span>Confirm & Pay {formatBDT(amount)}</span>
                <ArrowRight size={18} />
              </button>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '16px',
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}>
                <ShieldCheck size={14} style={{ color: '#10b981' }} />
                <span>End-to-End Encrypted & Admin Notified in Real-Time</span>
              </div>
            </form>
          )}

          {/* STEP 3: PROCESSING STATE */}
          {step === 3 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: currentMeta.bgColor,
                border: `2px solid ${currentMeta.borderColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                color: currentMeta.color
              }}>
                <RefreshCw size={32} className="spinner" style={{ animation: 'spin 1.2s linear infinite' }} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
                Connecting to {currentMeta.name} Gateway...
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '380px', lineHeight: '1.5' }}>
                Verifying transaction credentials and notifying the Nestora property manager and admin desk. Please do not close or refresh.
              </p>
            </div>
          )}

          {/* STEP 4: PAYMENT SUCCESS RECEIPT VOUCHER */}
          {step === 4 && completedPayment && (
            <div className="animate-fade-in" id="printable-receipt">
              <div style={{
                textAlign: 'center',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px dashed var(--border-color)'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '2px solid #10b981',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981',
                  marginBottom: '12px'
                }}>
                  <CheckCircle size={32} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
                  Payment Successful!
                </h3>
                <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>
                  Transaction Verified & Logged
                </span>
              </div>

              {/* Digital Receipt Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid var(--border-color)',
                marginBottom: '24px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  fontSize: '0.85rem'
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>Transaction ID</span>
                  <span style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'monospace' }}>
                    {completedPayment.transactionId}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  fontSize: '0.85rem'
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>Payment Channel</span>
                  <span style={{ fontWeight: 700, color: '#ffffff' }}>
                    {completedPayment.paymentMeta?.methodName || completedPayment.paymentMethod}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  fontSize: '0.85rem'
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>Property Title</span>
                  <span style={{ fontWeight: 600, color: '#ffffff', textAlign: 'right', maxWidth: '240px' }}>
                    {completedPayment.propertyTitle}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  fontSize: '0.85rem'
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>Payer Name</span>
                  <span style={{ fontWeight: 600, color: '#ffffff' }}>
                    {completedPayment.buyerName}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  fontSize: '0.85rem'
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>Date & Time</span>
                  <span style={{ color: 'var(--text-main)' }}>
                    {new Date(completedPayment.createdAt).toLocaleString('en-BD')}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-color)',
                  fontSize: '1.1rem'
                }}>
                  <span style={{ fontWeight: 700 }}>Total Paid Amount</span>
                  <span style={{ fontWeight: 800, color: 'var(--primary)' }}>
                    {formatBDT(completedPayment.amount)}
                  </span>
                </div>
              </div>

              {/* Notification confirmation banner */}
              <div style={{
                background: 'rgba(204, 163, 83, 0.08)',
                border: '1px solid rgba(204, 163, 83, 0.2)',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <ShieldCheck size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span>
                  Admin & Property Owner have been automatically notified with this payment voucher.
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="btn btn-secondary"
                  style={{
                    flex: 1,
                    height: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Printer size={16} /> Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-primary"
                  style={{
                    flex: 1,
                    height: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
