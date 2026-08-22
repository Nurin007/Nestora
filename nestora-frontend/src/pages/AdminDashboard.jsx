import React, { useState } from 'react';
import { ShieldCheck, Home, AlertCircle, FileText, BarChart3, Database, CheckCircle, XCircle, Clock, Filter, CreditCard, DollarSign, Search, Check, Printer, Smartphone, Building } from 'lucide-react';

export default function AdminDashboard({ properties, setProperties, bookings, payments = [], setPayments, complaints, setComplaints, auditLogs, setAuditLogs, reviews = [], setReviews, triggerNotification }) {
  // Tabs: 'kyc', 'properties', 'payments', 'reviews', 'broadcast', 'complaints', 'logs', 'analytics'
  const [activeTab, setActiveTab] = useState('payments');
  const [complaintFilter, setComplaintFilter] = useState('ALL');
  
  // Payments tab state
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('ALL');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('ALL');
  const [paymentSearchQuery, setPaymentSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // We mock a list of users pending KYC reviews for testing
  const [pendingKycUsers, setPendingKycUsers] = useState([
    { id: 4, fullName: 'Nurin Chowdhury', email: 'nurin@example.com', docType: 'NID', docNum: '199594837584', docImage: 'nid_scan.jpg' },
    { id: 5, fullName: 'Rahat Islam', email: 'rahat@example.com', docType: 'TRADE_LICENSE', docNum: 'TL-2025-84920', docImage: 'trade_license.jpg' }
  ]);

  const pendingProperties = properties.filter(p => p.verificationStatus === 'PENDING');
  const pendingReviews = reviews.filter(r => r.moderationStatus === 'PENDING');
  const pendingPayments = payments.filter(p => p.status === 'PENDING');

  const formatBDT = (val) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const handleApprovePayment = (paymentId) => {
    const targetPayment = payments.find(p => p.id === paymentId);
    if (!targetPayment) return;

    setPayments(payments.map(p => p.id === paymentId ? { ...p, status: 'COMPLETED' } : p));

    // Audit log
    setAuditLogs([
      {
        id: Date.now(),
        adminId: 1,
        action: 'VERIFY_PAYMENT',
        targetType: 'PAYMENT',
        targetId: paymentId,
        remarks: `Verified & approved payment ${targetPayment.transactionId} of ${formatBDT(targetPayment.amount)} from ${targetPayment.buyerName}`,
        createdAt: new Date().toISOString()
      },
      ...auditLogs
    ]);

    // Notify Buyer
    if (targetPayment.buyerId) {
      triggerNotification(
        targetPayment.buyerId,
        '✅ Bank Transfer Payment Approved',
        `Your payment of ${formatBDT(targetPayment.amount)} for "${targetPayment.propertyTitle}" has been verified by the Admin team.`
      );
    }

    // Notify Owner
    if (targetPayment.ownerId) {
      triggerNotification(
        targetPayment.ownerId,
        '💰 Payment Deposited to Escrow',
        `Payment of ${formatBDT(targetPayment.amount)} from ${targetPayment.buyerName} for your property has been verified by Admin.`
      );
    }

    alert(`Payment ${targetPayment.transactionId} verified successfully.`);
  };

  const handleRefundPayment = (paymentId) => {
    const targetPayment = payments.find(p => p.id === paymentId);
    if (!targetPayment) return;

    if (!window.confirm(`Are you sure you want to refund ${formatBDT(targetPayment.amount)} to ${targetPayment.buyerName}?`)) {
      return;
    }

    setPayments(payments.map(p => p.id === paymentId ? { ...p, status: 'REFUNDED' } : p));

    // Audit log
    setAuditLogs([
      {
        id: Date.now(),
        adminId: 1,
        action: 'REFUND_PAYMENT',
        targetType: 'PAYMENT',
        targetId: paymentId,
        remarks: `Refunded payment ${targetPayment.transactionId} of ${formatBDT(targetPayment.amount)} to ${targetPayment.buyerName}`,
        createdAt: new Date().toISOString()
      },
      ...auditLogs
    ]);

    // Notify Buyer
    if (targetPayment.buyerId) {
      triggerNotification(
        targetPayment.buyerId,
        '💸 Payment Refund Initiated',
        `Your refund of ${formatBDT(targetPayment.amount)} for Transaction ${targetPayment.transactionId} has been initiated.`
      );
    }

    alert(`Refund processed for ${targetPayment.transactionId}.`);
  };

  const handleApproveKyc = (userId) => {
    const userToApprove = pendingKycUsers.find(u => u.id === userId);
    setPendingKycUsers(pendingKycUsers.filter(u => u.id !== userId));
    
    // Add audit log
    const log = {
      id: auditLogs.length + 1,
      adminId: 1,
      action: 'APPROVE_KYC',
      targetType: 'USER',
      targetId: userId,
      remarks: `Approved KYC for ${userToApprove?.fullName} (${userToApprove?.docType})`,
      createdAt: new Date().toISOString()
    };
    setAuditLogs([log, ...auditLogs]);
    
    // Notify User
    triggerNotification(userId, 'KYC Verification Approved', 'Congratulations! Your profile KYC has been approved by the Admin team.');
    alert(`KYC for ${userToApprove?.fullName} has been approved.`);
  };

  const handleApproveProperty = (propertyId) => {
    setProperties(properties.map(p => p.id === propertyId ? { ...p, verificationStatus: 'APPROVED' } : p));
    const targetProp = properties.find(p => p.id === propertyId);
    
    const log = {
      id: auditLogs.length + 1,
      adminId: 1,
      action: 'APPROVE_PROPERTY',
      targetType: 'PROPERTY',
      targetId: propertyId,
      remarks: `Approved property listing ID: ${propertyId}`,
      createdAt: new Date().toISOString()
    };
    setAuditLogs([log, ...auditLogs]);

    // Notify Owner
    if (targetProp?.ownerId) {
      triggerNotification(targetProp.ownerId, 'Property Approved', `Your property listing "${targetProp.title}" has been verified and published.`);
    }
    alert(`Property ID ${propertyId} has been successfully verified & published.`);
  };

  const handleRejectProperty = (propertyId) => {
    setProperties(properties.map(p => p.id === propertyId ? { ...p, verificationStatus: 'REJECTED' } : p));
    const targetProp = properties.find(p => p.id === propertyId);
    
    const log = {
      id: auditLogs.length + 1,
      adminId: 1,
      action: 'REJECT_PROPERTY',
      targetType: 'PROPERTY',
      targetId: propertyId,
      remarks: `Rejected property listing ID: ${propertyId}`,
      createdAt: new Date().toISOString()
    };
    setAuditLogs([log, ...auditLogs]);

    // Notify Owner
    if (targetProp?.ownerId) {
      triggerNotification(targetProp.ownerId, 'Property Listing Rejected', `Your property listing "${targetProp.title}" was rejected due to verification issues.`);
    }
    alert(`Property ID ${propertyId} has been rejected.`);
  };

  const handleApproveReview = (reviewId) => {
    setReviews(reviews.map(r => r.id === reviewId ? { ...r, moderationStatus: 'APPROVED' } : r));
    const rev = reviews.find(r => r.id === reviewId);
    const targetProp = properties.find(p => p.id === rev?.propertyId);

    const log = {
      id: auditLogs.length + 1,
      adminId: 1,
      action: 'APPROVE_REVIEW',
      targetType: 'REVIEW',
      targetId: reviewId,
      remarks: `Approved review by ${rev?.reviewer} for property ${targetProp?.title || rev?.propertyId}`,
      createdAt: new Date().toISOString()
    };
    setAuditLogs([log, ...auditLogs]);

    // Notify Owner
    if (targetProp?.ownerId) {
      triggerNotification(targetProp.ownerId, 'Verified Review Published', `A verified review by ${rev?.reviewer} was approved and published on your listing.`);
    }
    alert(`Review has been approved and published.`);
  };

  const handleRejectReview = (reviewId) => {
    setReviews(reviews.map(r => r.id === reviewId ? { ...r, moderationStatus: 'REJECTED' } : r));
    const rev = reviews.find(r => r.id === reviewId);

    const log = {
      id: auditLogs.length + 1,
      adminId: 1,
      action: 'REJECT_REVIEW',
      targetType: 'REVIEW',
      targetId: reviewId,
      remarks: `Rejected review by ${rev?.reviewer}`,
      createdAt: new Date().toISOString()
    };
    setAuditLogs([log, ...auditLogs]);
    alert(`Review has been rejected.`);
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '80px', marginTop: '40px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Admin Console</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Verify registrations, listings, and monitor platform activities.</p>

      {/* Tabs Menu */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('payments')} className={`btn ${activeTab === 'payments' ? 'btn-primary' : 'btn-secondary'}`}>
          <CreditCard size={16} /> Payments & Revenue ({payments.length})
        </button>
        <button onClick={() => setActiveTab('kyc')} className={`btn ${activeTab === 'kyc' ? 'btn-primary' : 'btn-secondary'}`}>
          KYC Verifications ({pendingKycUsers.length})
        </button>
        <button onClick={() => setActiveTab('properties')} className={`btn ${activeTab === 'properties' ? 'btn-primary' : 'btn-secondary'}`}>
          Pending Properties ({pendingProperties.length})
        </button>
        <button onClick={() => setActiveTab('reviews')} className={`btn ${activeTab === 'reviews' ? 'btn-primary' : 'btn-secondary'}`}>
          Review Moderation ({pendingReviews.length})
        </button>
        <button onClick={() => setActiveTab('broadcast')} className={`btn ${activeTab === 'broadcast' ? 'btn-primary' : 'btn-secondary'}`}>
          Broadcast Center
        </button>
        <button onClick={() => setActiveTab('complaints')} className={`btn ${activeTab === 'complaints' ? 'btn-primary' : 'btn-secondary'}`}>
          Complaints ({complaints.length})
        </button>
        <button onClick={() => setActiveTab('logs')} className={`btn ${activeTab === 'logs' ? 'btn-primary' : 'btn-secondary'}`}>
          Audit Logs
        </button>
        <button onClick={() => setActiveTab('analytics')} className={`btn ${activeTab === 'analytics' ? 'btn-primary' : 'btn-secondary'}`}>
          System Reports
        </button>
      </div>

      {/* Tab: Payments & Escrow */}
      {activeTab === 'payments' && (
        <div className="glass animate-fade-in" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CreditCard style={{ color: 'var(--primary)' }} /> Real-Time Payments & Escrow Desk
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                Monitor transactions, verify bank deposits, and manage buyer-owner disbursements.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => window.print()} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
                <Printer size={16} /> Print Report
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{ padding: '20px', background: 'rgba(204, 163, 83, 0.08)', border: '1px solid rgba(204, 163, 83, 0.25)', borderRadius: '16px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Collected (BDT)</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginTop: '6px' }}>
                {formatBDT(payments.filter(p => p.status === 'COMPLETED').reduce((acc, curr) => acc + (curr.amount || 0), 0))}
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                ● {payments.filter(p => p.status === 'COMPLETED').length} Successful transactions
              </span>
            </div>

            <div style={{ padding: '20px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '16px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Pending Verification</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', marginTop: '6px' }}>
                {formatBDT(payments.filter(p => p.status === 'PENDING').reduce((acc, curr) => acc + (curr.amount || 0), 0))}
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>
                ● {payments.filter(p => p.status === 'PENDING').length} Awaiting bank reconciliation
              </span>
            </div>

            <div style={{ padding: '20px', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '16px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>bKash & Nagad Share</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#818cf8', marginTop: '6px' }}>
                {payments.filter(p => p.paymentMethod === 'BKASH' || p.paymentMethod === 'NAGAD' || p.paymentMethod === 'ROCKET').length} Txns
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Mobile Financial Services
              </span>
            </div>

            <div style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '16px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Platform Success Rate</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '6px' }}>
                {payments.length > 0 ? ((payments.filter(p => p.status === 'COMPLETED').length / payments.length) * 100).toFixed(0) : 100}%
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                SSL & Gateway Uptime
              </span>
            </div>
          </div>

          {/* Search & Filters */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-dark)' }} />
              <input
                type="text"
                placeholder="Search by Transaction ID, Buyer name, or Property title..."
                className="input-field"
                style={{ paddingLeft: '40px' }}
                value={paymentSearchQuery}
                onChange={(e) => setPaymentSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="input-field"
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed (Paid)</option>
              <option value="PENDING">Pending (Bank Transfer)</option>
              <option value="REFUNDED">Refunded</option>
            </select>

            <select
              className="input-field"
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
            >
              <option value="ALL">All Methods</option>
              <option value="BKASH">bKash</option>
              <option value="NAGAD">Nagad</option>
              <option value="ROCKET">Rocket</option>
              <option value="CARD">Debit/Credit Card</option>
              <option value="BANK">Bank Deposit / EFT</option>
            </select>
          </div>

          {/* Payments Table */}
          {payments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No payment transactions logged yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 14px' }}>Txn ID / Date</th>
                    <th style={{ padding: '12px 14px' }}>Buyer Info</th>
                    <th style={{ padding: '12px 14px' }}>Property</th>
                    <th style={{ padding: '12px 14px' }}>Amount</th>
                    <th style={{ padding: '12px 14px' }}>Method</th>
                    <th style={{ padding: '12px 14px' }}>Status</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments
                    .filter((p) => {
                      const matchesSearch = 
                        (p.transactionId?.toLowerCase() || '').includes(paymentSearchQuery.toLowerCase()) ||
                        (p.buyerName?.toLowerCase() || '').includes(paymentSearchQuery.toLowerCase()) ||
                        (p.propertyTitle?.toLowerCase() || '').includes(paymentSearchQuery.toLowerCase());
                      const matchesStatus = paymentStatusFilter === 'ALL' ? true : p.status === paymentStatusFilter;
                      const matchesMethod = paymentMethodFilter === 'ALL' ? true : p.paymentMethod === paymentMethodFilter;
                      return matchesSearch && matchesStatus && matchesMethod;
                    })
                    .map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s' }}>
                        <td style={{ padding: '14px' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)', display: 'block' }}>
                            {p.transactionId}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {new Date(p.createdAt).toLocaleDateString('en-BD')} {new Date(p.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <strong style={{ color: '#ffffff', display: 'block' }}>{p.buyerName}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {p.buyerPhone || p.buyerEmail}
                          </span>
                        </td>
                        <td style={{ padding: '14px', maxWidth: '200px' }}>
                          <span style={{ fontWeight: 600, color: '#ffffff', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.propertyTitle}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {p.propertyCity} • {p.paymentType?.replace('_', ' ')}
                          </span>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <strong style={{ fontSize: '0.95rem', color: 'var(--primary)' }}>
                            {formatBDT(p.amount)}
                          </strong>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: p.paymentMethod === 'BKASH' ? 'rgba(226, 19, 110, 0.15)' :
                                        p.paymentMethod === 'NAGAD' ? 'rgba(247, 148, 29, 0.15)' :
                                        p.paymentMethod === 'CARD' ? 'rgba(59, 130, 246, 0.15)' :
                                        'rgba(16, 185, 129, 0.15)',
                            color: p.paymentMethod === 'BKASH' ? '#f472b6' :
                                   p.paymentMethod === 'NAGAD' ? '#fb923c' :
                                   p.paymentMethod === 'CARD' ? '#60a5fa' :
                                   '#34d399'
                          }}>
                            {p.paymentMethod}
                          </span>
                          {p.paymentMeta?.bankTxnRef && (
                            <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              Ref: {p.paymentMeta.bankTxnRef}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: p.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.15)' :
                                        p.status === 'PENDING' ? 'rgba(245, 158, 11, 0.15)' :
                                        'rgba(239, 68, 68, 0.15)',
                            color: p.status === 'COMPLETED' ? '#10b981' :
                                   p.status === 'PENDING' ? '#f59e0b' :
                                   '#ef4444'
                          }}>
                            {p.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            {p.status === 'PENDING' && (
                              <button
                                onClick={() => handleApprovePayment(p.id)}
                                className="btn"
                                style={{ background: 'var(--secondary)', color: '#ffffff', padding: '6px 12px', fontSize: '0.75rem' }}
                                title="Verify bank deposit"
                              >
                                <Check size={14} /> Verify
                              </button>
                            )}
                            {p.status === 'COMPLETED' && (
                              <button
                                onClick={() => handleRefundPayment(p.id)}
                                className="btn-danger"
                                style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                                title="Issue refund"
                              >
                                Refund
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedReceipt(p)}
                              className="btn-secondary"
                              style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                              title="View digital voucher"
                            >
                              Voucher
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Receipt Modal Preview */}
          {selectedReceipt && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99999,
              padding: '20px'
            }}>
              <div className="glass animate-fade-in" style={{
                background: '#0e1526',
                width: '100%',
                maxWidth: '480px',
                padding: '30px',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.15)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Payment Voucher Details</h3>
                  <button onClick={() => setSelectedReceipt(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
                    <XCircle size={20} />
                  </button>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                  <p style={{ margin: '6px 0', fontSize: '0.85rem' }}><strong>Txn ID:</strong> <span style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>{selectedReceipt.transactionId}</span></p>
                  <p style={{ margin: '6px 0', fontSize: '0.85rem' }}><strong>Property:</strong> {selectedReceipt.propertyTitle}</p>
                  <p style={{ margin: '6px 0', fontSize: '0.85rem' }}><strong>Payer:</strong> {selectedReceipt.buyerName} ({selectedReceipt.buyerPhone})</p>
                  <p style={{ margin: '6px 0', fontSize: '0.85rem' }}><strong>Amount:</strong> <strong style={{ color: 'var(--primary)' }}>{formatBDT(selectedReceipt.amount)}</strong></p>
                  <p style={{ margin: '6px 0', fontSize: '0.85rem' }}><strong>Method:</strong> {selectedReceipt.paymentMethod}</p>
                  <p style={{ margin: '6px 0', fontSize: '0.85rem' }}><strong>Status:</strong> {selectedReceipt.status}</p>
                  <p style={{ margin: '6px 0', fontSize: '0.85rem' }}><strong>Date:</strong> {new Date(selectedReceipt.createdAt).toLocaleString('en-BD')}</p>
                  {selectedReceipt.note && <p style={{ margin: '6px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}><strong>Note:</strong> {selectedReceipt.note}</p>}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => window.print()} className="btn btn-secondary" style={{ flex: 1 }}>
                    <Printer size={16} /> Print Voucher
                  </button>
                  <button onClick={() => setSelectedReceipt(null)} className="btn btn-primary" style={{ flex: 1 }}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: KYC */}
      {activeTab === 'kyc' && (
        <div className="glass animate-fade-in" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck style={{ color: 'var(--primary)' }} /> Pending User Verifications
          </h2>
          {pendingKycUsers.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No pending KYC requests found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {pendingKycUsers.map(u => (
                <div key={u.id} style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{u.fullName}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email: {u.email}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Document: <strong>{u.docType}</strong> ({u.docNum})
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleApproveKyc(u.id)}
                      className="btn" 
                      style={{ background: 'var(--secondary)', color: '#ffffff', padding: '8px 16px', fontSize: '0.85rem' }}
                    >
                      Approve
                    </button>
                    <button className="btn-danger" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Properties */}
      {activeTab === 'properties' && (
        <div className="glass animate-fade-in" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Home style={{ color: 'var(--primary)' }} /> Property Approval Queue
          </h2>
          {pendingProperties.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No properties pending verification.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {pendingProperties.map(p => (
                <div key={p.id} style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{p.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.address}, {p.city}</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 700, marginTop: '8px' }}>
                      Asking Price: {formatBDT(p.pricing)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleApproveProperty(p.id)}
                      className="btn" 
                      style={{ background: 'var(--secondary)', color: '#ffffff', padding: '8px 16px', fontSize: '0.85rem' }}
                    >
                      Verify & Publish
                    </button>
                    <button 
                      onClick={() => handleRejectProperty(p.id)}
                      className="btn-danger" 
                      style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Complaints */}
      {activeTab === 'complaints' && (
        <div className="glass animate-fade-in" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle style={{ color: 'var(--danger)' }} /> User Complaints &amp; Disputes
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={14} style={{ color: 'var(--text-muted)' }} />
              <select
                value={complaintFilter}
                onChange={e => setComplaintFilter(e.target.value)}
                style={{
                  background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)',
                  color: 'var(--text-main)', borderRadius: '10px',
                  padding: '7px 12px', fontSize: '0.82rem', fontFamily: 'inherit', cursor: 'pointer',
                }}
              >
                <option value="ALL">All ({complaints.length})</option>
                <option value="OPEN">Open ({complaints.filter(c => c.status === 'OPEN').length})</option>
                <option value="RESOLVED">Resolved ({complaints.filter(c => c.status === 'RESOLVED').length})</option>
                <option value="REJECTED">Rejected ({complaints.filter(c => c.status === 'REJECTED').length})</option>
              </select>
            </div>
          </div>

          {(() => {
            const visible = complaints.filter(c => complaintFilter === 'ALL' || c.status === complaintFilter);
            if (visible.length === 0) {
              return <p style={{ color: 'var(--text-muted)' }}>No complaints match the selected filter.</p>;
            }
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {visible.map(c => {
                  const statusColor = c.status === 'RESOLVED' ? 'var(--secondary)' : c.status === 'REJECTED' ? 'var(--danger)' : 'var(--warning)';
                  const statusBg    = c.status === 'RESOLVED' ? 'rgba(16,185,129,0.1)' : c.status === 'REJECTED' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)';
                  const StatusIcon  = c.status === 'RESOLVED' ? CheckCircle : c.status === 'REJECTED' ? XCircle : Clock;
                  return (
                    <div key={c.id} style={{
                      padding: '22px 24px', borderRadius: '14px',
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid var(--border-color)',
                    }}>
                      {/* Header row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                              {c.buyerName || `Buyer #${c.buyerId}`}
                            </span>
                            <span style={{
                              padding: '2px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700,
                              background: 'rgba(204,163,83,0.1)', color: 'var(--primary)', border: '1px solid rgba(204,163,83,0.2)',
                            }}>
                              {(c.type || 'COMPLAINT').replace(/_/g, ' ')}
                            </span>
                          </div>
                          {c.propertyId && (
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                              Property ID: {c.propertyId}
                            </p>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                          <span style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            padding: '4px 12px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
                            background: statusBg, color: statusColor,
                          }}>
                            <StatusIcon size={12} /> {c.status}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-dark)' }}>
                            {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                        {c.description}
                      </p>

                      {/* Actions — only on OPEN complaints */}
                      {c.status === 'OPEN' && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            onClick={() => {
                              setComplaints(prev => prev.map(x => x.id === c.id ? { ...x, status: 'RESOLVED' } : x));
                              if (c.buyerId) triggerNotification(c.buyerId, 'Complaint Resolved', 'Your complaint has been reviewed and marked as Resolved by Admin.');
                              setAuditLogs(prev => [{ id: Date.now(), adminId: 1, action: 'RESOLVE_COMPLAINT', targetType: 'COMPLAINT', targetId: c.id, remarks: `Resolved complaint from ${c.buyerName || 'buyer'}`, createdAt: new Date().toISOString() }, ...prev]);
                            }}
                            className="btn btn-secondary"
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px', fontSize: '0.8rem', borderColor: 'rgba(16,185,129,0.4)', color: 'var(--secondary)' }}
                          >
                            <CheckCircle size={14} /> Mark Resolved
                          </button>
                          <button
                            onClick={() => {
                              setComplaints(prev => prev.map(x => x.id === c.id ? { ...x, status: 'REJECTED' } : x));
                              if (c.buyerId) triggerNotification(c.buyerId, 'Complaint Rejected', 'Your complaint has been reviewed and was not upheld by Admin.');
                              setAuditLogs(prev => [{ id: Date.now(), adminId: 1, action: 'REJECT_COMPLAINT', targetType: 'COMPLAINT', targetId: c.id, remarks: `Rejected complaint from ${c.buyerName || 'buyer'}`, createdAt: new Date().toISOString() }, ...prev]);
                            }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              padding: '7px 16px', fontSize: '0.8rem', borderRadius: '10px',
                              background: 'none', border: '1px solid rgba(239,68,68,0.35)',
                              color: 'var(--danger)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
                            }}
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* Tab: Audit Logs */}
      {activeTab === 'logs' && (
        <div className="glass animate-fade-in" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database style={{ color: 'var(--primary)' }} /> Audit Logs
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
            {auditLogs.map(l => (
              <div key={l.id} style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border-color)',
                fontSize: '0.8rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ color: 'var(--primary)', fontWeight: 700, marginRight: '10px' }}>[{l.action}]</span>
                  <span style={{ color: 'var(--text-main)' }}>{l.remarks}</span>
                </div>
                <span style={{ color: 'var(--text-dark)' }}>{l.createdAt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Review Moderation */}
      {activeTab === 'reviews' && (
        <div className="glass animate-fade-in" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck style={{ color: 'var(--primary)' }} /> Review Moderation Queue
          </h2>
          {pendingReviews.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No pending reviews for moderation.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {pendingReviews.map(r => {
                const targetProp = properties.find(p => p.id === r.propertyId);
                return (
                  <div key={r.id} style={{
                    padding: '20px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Review by {r.reviewer}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Property: <strong>{targetProp?.title || `ID ${r.propertyId}`}</strong></p>
                      <p style={{ fontSize: '0.9rem', margin: '8px 0', color: '#ffffff' }}>
                        Rating: <span style={{ color: 'var(--primary)' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>"{r.comment}"</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '6px' }}>
                        Scan Proof: <strong>{r.proof}</strong>
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => handleApproveReview(r.id)}
                        className="btn" 
                        style={{ background: 'var(--secondary)', color: '#ffffff', padding: '8px 16px', fontSize: '0.85rem' }}
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleRejectReview(r.id)}
                        className="btn-danger" 
                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Broadcast Center */}
      {activeTab === 'broadcast' && (
        <div className="glass animate-fade-in" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText style={{ color: 'var(--primary)' }} /> Send Broadcast Announcement
          </h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const titleInput = e.target.elements.title.value;
            const contentInput = e.target.elements.content.value;
            if (!titleInput || !contentInput) {
              alert('Please fill out all fields.');
              return;
            }
            // Send to all mock users (1 to 5)
            [1, 2, 3, 4, 5].forEach(uid => {
              triggerNotification(uid, titleInput, contentInput);
            });
            alert('Broadcast announcement sent to all users.');
            e.target.reset();
          }}>
            <div className="input-group">
              <label className="input-label">Announcement Title</label>
              <input type="text" name="title" className="input-field" placeholder="e.g. Scheduled System Maintenance" required />
            </div>
            <div className="input-group" style={{ marginBottom: '24px' }}>
              <label className="input-label">Announcement Message</label>
              <textarea name="content" rows={4} className="input-field" placeholder="Describe the announcement details..." required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '45px' }}>
              Send Broadcast to All Users
            </button>
          </form>
        </div>
      )}

      {/* Tab: Analytics & Reports */}
      {activeTab === 'analytics' && (
        <div className="glass animate-fade-in" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 style={{ color: 'var(--primary)' }} /> Monthly Performance & Analytics
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', textAlign: 'center' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Total Users</h4>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginTop: '8px' }}>154</p>
            </div>
            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', textAlign: 'center' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Verified Properties</h4>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '8px' }}>342</p>
            </div>
            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', textAlign: 'center' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Visits Scheduled</h4>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '8px' }}>78</p>
            </div>
            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', textAlign: 'center' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Active Complaints</h4>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger)', marginTop: '8px' }}>4</p>
            </div>
          </div>

          <button onClick={() => alert('Monthly report exported to PDF.')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} /> Export Report to PDF
          </button>
        </div>
      )}
    </div>
  );
}
