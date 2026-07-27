import React, { useState } from 'react';
import { ShieldCheck, Home, AlertCircle, FileText, BarChart3, Database, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';

export default function AdminDashboard({ properties, setProperties, bookings, complaints, setComplaints, auditLogs, setAuditLogs, reviews = [], setReviews, triggerNotification }) {
  // Tabs: 'kyc', 'properties', 'complaints', 'logs', 'analytics', 'reviews'
  const [activeTab, setActiveTab] = useState('kyc');
  const [complaintFilter, setComplaintFilter] = useState('ALL');

  // We mock a list of users pending KYC reviews for testing
  const [pendingKycUsers, setPendingKycUsers] = useState([
    { id: 4, fullName: 'Nurin Chowdhury', email: 'nurin@example.com', docType: 'NID', docNum: '199594837584', docImage: 'nid_scan.jpg' },
    { id: 5, fullName: 'Rahat Islam', email: 'rahat@example.com', docType: 'TRADE_LICENSE', docNum: 'TL-2025-84920', docImage: 'trade_license.jpg' }
  ]);

  const pendingProperties = properties.filter(p => p.verificationStatus === 'PENDING');
  const pendingReviews = reviews.filter(r => r.moderationStatus === 'PENDING');

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

  const formatBDT = (value) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '80px', marginTop: '40px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Admin Console</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Verify registrations, listings, and monitor platform activities.</p>

      {/* Tabs Menu */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
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
