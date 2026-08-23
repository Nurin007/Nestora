import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, Heart, Shield, RefreshCw, Star, Trash2, Bell, BellOff, Search, Plus, X, AlertCircle, CheckCircle, Clock, MessageSquare, Lock, Eye, EyeOff, User, CreditCard, Receipt, Printer } from 'lucide-react';

export default function BuyerDashboard({ user, setUser, properties, wishlist, onToggleWishlist, bookings, setBookings, payments = [], onAddPayment, triggerNotification, savedSearches, setSavedSearches, complaints, setComplaints }) {
  const navigate = useNavigate();
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [docType, setDocType] = useState('NID');
  const [docNumber, setDocNumber] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [kycSubmitted, setKycSubmitted] = useState(false);

  // Saved Search Form
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [ssCity, setSsCity] = useState('');
  const [ssType, setSsType] = useState('');
  const [ssMinPrice, setSsMinPrice] = useState('');
  const [ssMaxPrice, setSsMaxPrice] = useState('');
  const [ssBedrooms, setSsBedrooms] = useState('');
  const [ssAlerts, setSsAlerts] = useState(true);

  // Rescheduling states
  const [reschedulingId, setReschedulingId] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');

  // Complaint form state
  const [showComplaintForm, setShowComplaintForm]   = useState(false);
  const [complaintPropertyId, setComplaintPropertyId] = useState('');
  const [complaintType, setComplaintType]           = useState('PROPERTY_ISSUE');
  const [complaintDesc, setComplaintDesc]           = useState('');

  // Change Password state
  const [currentPwd, setCurrentPwd]     = useState('');
  const [newPwd, setNewPwd]             = useState('');
  const [confirmPwd, setConfirmPwd]     = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd]     = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [pwdLoading, setPwdLoading]     = useState(false);
  const [pwdMessage, setPwdMessage]     = useState(null); // { type: 'success'|'error', text: string }

  // Profile Details state
  const [profileName, setProfileName]   = useState(user.fullName || '');
  const [profilePhone, setProfilePhone] = useState(user.phoneNumber || user.phone_number || '');
  const [picUrl, setPicUrl]             = useState(user.profilePictureUrl || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);

  // Filter bookings for this buyer
  const myBookings = bookings.filter(b => b.buyerId === user.id);

  // Filter wishlist properties
  const myWishlistProperties = properties.filter(p => wishlist.includes(p.id));

  const handleKycSubmit = (e) => {
    e.preventDefault();
    if (!docNumber || !docUrl) {
      alert('Please fill out all fields.');
      return;
    }
    setKycSubmitted(true);
    
    // Notify Admin (mock user ID 1)
    triggerNotification(
      1,
      'KYC Verification Requested',
      `User ${user.fullName} submitted ${docType} (${docNumber}) for verification.`
    );

    // Simulate updating user KYC status
    setTimeout(() => {
      setUser({
        ...user,
        kycStatus: 'PENDING',
        kycDocType: docType,
        kycDocNum: docNumber
      });
    }, 500);
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this visit booking?')) {
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b));
      
      const targetBooking = bookings.find(b => b.id === bookingId);
      const targetProp = properties.find(p => p.id === targetBooking?.propertyId);
      
      if (targetProp?.ownerId) {
        triggerNotification(
          targetProp.ownerId,
          'Inspection Visit Cancelled',
          `Buyer ${user.fullName} has cancelled the scheduled visit for your property "${targetProp.title}".`
        );
      }
    }
  };

  const handleRescheduleSubmit = (bookingId) => {
    if (!newDate || !newTimeSlot) {
      alert('Please select both a date and a time slot.');
      return;
    }
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, visitDate: newDate, visitTimeSlot: newTimeSlot, status: 'PENDING' } : b));
    
    const targetBooking = bookings.find(b => b.id === bookingId);
    const targetProp = properties.find(p => p.id === targetBooking?.propertyId);
    
    if (targetProp?.ownerId) {
      triggerNotification(
        targetProp.ownerId,
        'Inspection Visit Rescheduled',
        `Buyer ${user.fullName} rescheduled their inspection visit for "${targetProp.title}" to ${newDate} during ${newTimeSlot}.`
      );
    }
    alert('Visit rescheduled successfully! Pending owner re-confirmation.');
    setReschedulingId(null);
    setNewDate('');
    setNewTimeSlot('');
  };

  const handleSaveSearch = (e) => {
    e.preventDefault();
    if (!ssCity && !ssType && !ssMinPrice && !ssMaxPrice && !ssBedrooms) {
      alert('Please set at least one search criteria.');
      return;
    }
    const newSearch = {
      id: Date.now(),
      city: ssCity,
      propertyType: ssType,
      minPrice: ssMinPrice ? parseFloat(ssMinPrice) : null,
      maxPrice: ssMaxPrice ? parseFloat(ssMaxPrice) : null,
      minBedrooms: ssBedrooms ? parseInt(ssBedrooms) : null,
      alertsEnabled: ssAlerts,
      createdAt: new Date().toISOString()
    };
    setSavedSearches(prev => [newSearch, ...prev]);
    setSsCity('');
    setSsType('');
    setSsMinPrice('');
    setSsMaxPrice('');
    setSsBedrooms('');
    setSsAlerts(true);
    setShowSearchForm(false);
  };

  const handleDeleteSearch = (id) => {
    setSavedSearches(prev => prev.filter(s => s.id !== id));
  };

  const handleToggleSearchAlert = (id) => {
    setSavedSearches(prev => prev.map(s => s.id === id ? { ...s, alertsEnabled: !s.alertsEnabled } : s));
  };

  const handleComplaintSubmit = (e) => {
    e.preventDefault();
    if (!complaintDesc.trim()) {
      alert('Please describe your complaint.');
      return;
    }
    const newComplaint = {
      id: Date.now(),
      buyerId: user.id,
      buyerName: user.fullName,
      propertyId: complaintPropertyId ? parseInt(complaintPropertyId) : null,
      type: complaintType,
      description: complaintDesc.trim(),
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };
    setComplaints(prev => [newComplaint, ...prev]);
    triggerNotification(
      1, // notify Admin
      'New Complaint Filed',
      `${user.fullName} filed a ${complaintType.replace('_', ' ')} complaint.`
    );
    setComplaintDesc('');
    setComplaintPropertyId('');
    setComplaintType('PROPERTY_ISSUE');
    setShowComplaintForm(false);
  };

  const handleDeleteComplaint = (id) => {
    if (window.confirm('Withdraw this complaint?')) {
      setComplaints(prev => prev.filter(c => c.id !== id));
    }
  };

  const getMatchCount = (search) => {
    return properties.filter(p => {
      if (p.verificationStatus !== 'APPROVED') return false;
      if (search.city && !p.city.toLowerCase().includes(search.city.toLowerCase())) return false;
      if (search.propertyType && p.propertyType !== search.propertyType) return false;
      if (search.minPrice && p.pricing < search.minPrice) return false;
      if (search.maxPrice && p.pricing > search.maxPrice) return false;
      if (search.minBedrooms && p.numberOfBedrooms < search.minBedrooms) return false;
      return true;
    }).length;
  };

  const buildSearchUrl = (search) => {
    const params = new URLSearchParams();
    if (search.city) params.set('city', search.city);
    if (search.propertyType) params.set('type', search.propertyType);
    if (search.minPrice) params.set('priceMin', search.minPrice);
    if (search.maxPrice) params.set('priceMax', search.maxPrice);
    if (search.minBedrooms) params.set('beds', search.minBedrooms);
    return `/listings?${params.toString()}`;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdMessage(null);
    if (newPwd.length < 8) {
      setPwdMessage({ type: 'error', text: 'New password must be at least 8 characters.' });
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (currentPwd === newPwd) {
      setPwdMessage({ type: 'error', text: 'New password must differ from the current password.' });
      return;
    }
    setPwdLoading(true);
    // Simulate API call: PUT /api/v1/profile/password
    await new Promise(res => setTimeout(res, 800));
    // In production: await fetch('/api/v1/profile/password', { method: 'PUT', ... })
    setPwdLoading(false);
    setCurrentPwd('');
    setNewPwd('');
    setConfirmPwd('');
    setPwdMessage({ type: 'success', text: 'Password changed successfully!' });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMessage(null);
    if (!profileName.trim()) {
      setProfileMessage({ type: 'error', text: 'Full Name cannot be empty.' });
      return;
    }
    setProfileLoading(true);
    // Simulate API call: PUT /api/v1/profile
    await new Promise(res => setTimeout(res, 700));
    setProfileLoading(false);
    setUser(prev => ({
      ...prev,
      fullName: profileName.trim(),
      phoneNumber: profilePhone.trim(),
      phone_number: profilePhone.trim(),
      profilePictureUrl: picUrl.trim()
    }));
    setProfileMessage({ type: 'success', text: 'Profile details updated successfully!' });
  };

  const formatBDT = (value) =>
    value ? new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(value) : null;


  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '80px', marginTop: '24px' }}>
      <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', marginBottom: '8px' }}>Buyer Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Manage your visits, wishlist, and verification status.</p>

      <div className="buyer-dashboard-layout">
        
        {/* Left column: Bookings and Wishlist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* My Bookings Section */}
          <div className="glass" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar style={{ color: 'var(--primary)' }} /> Property Visit Schedule
            </h2>

            {myBookings.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>You haven't scheduled any property visits yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {myBookings.map(b => {
                  const prop = properties.find(p => p.id === b.propertyId);
                  if (reschedulingId === b.id) {
                    return (
                      <div key={b.id} style={{
                        padding: '20px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.01)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Reschedule Visit</h4>
                          <button 
                            onClick={() => setReschedulingId(null)}
                            className="btn btn-secondary" 
                            style={{ padding: '4px 10px', fontSize: '0.7rem' }}
                          >
                            Cancel
                          </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div className="input-group" style={{ margin: 0 }}>
                            <label className="input-label" style={{ fontSize: '0.75rem' }}>Select New Date</label>
                            <input 
                              type="date" 
                              className="input-field" 
                              value={newDate} 
                              onChange={(e) => setNewDate(e.target.value)} 
                            />
                          </div>
                          <div className="input-group" style={{ margin: 0 }}>
                            <label className="input-label" style={{ fontSize: '0.75rem' }}>Select Time Slot</label>
                            <select 
                              className="input-field" 
                              value={newTimeSlot} 
                              onChange={(e) => setNewTimeSlot(e.target.value)}
                            >
                              <option value="">Choose slot</option>
                              <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                              <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                              <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                              <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                            </select>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleRescheduleSubmit(b.id)}
                          className="btn btn-primary" 
                          style={{ alignSelf: 'flex-end', padding: '8px 16px', fontSize: '0.8rem' }}
                        >
                          Confirm Reschedule
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div key={b.id} style={{
                      padding: '20px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{prop?.title || 'Unknown Property'}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{prop?.address}, {prop?.city}</p>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <span>📅 {b.visitDate}</span>
                          <span>🕒 {b.visitTimeSlot}</span>
                        </div>
                        {b.remarks && <p style={{ fontSize: '0.8rem', marginTop: '8px', color: 'var(--text-dark)' }}>Remarks: {b.remarks}</p>}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: b.status === 'PENDING' ? 'rgba(245, 158, 11, 0.15)' : 
                                      b.status === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: b.status === 'PENDING' ? 'var(--warning)' : 
                                 b.status === 'CONFIRMED' ? 'var(--secondary)' : 'var(--danger)'
                        }}>
                          {b.status === 'PENDING' ? '⏳ Admin Approval Pending' : 
                           b.status === 'CONFIRMED' ? '✅ Visit Confirmed' : '❌ Cancelled'}
                        </span>
                        
                        {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              onClick={() => {
                                setReschedulingId(b.id);
                                setNewDate(b.visitDate);
                                setNewTimeSlot(b.visitTimeSlot);
                              }}
                              className="btn btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px', cursor: 'pointer' }}
                            >
                              Reschedule
                            </button>
                            <button 
                              onClick={() => handleCancelBooking(b.id)}
                              className="btn-danger"
                              style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px', cursor: 'pointer' }}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* My Payments & Invoices Section */}
          <div className="glass" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CreditCard style={{ color: 'var(--primary)' }} /> My Payments & Digital Invoices
              </h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>
                {payments.filter(p => p.buyerId === user.id || p.buyerEmail === user.email).length} Transactions
              </span>
            </div>

            {payments.filter(p => p.buyerId === user.id || p.buyerEmail === user.email).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)' }}>
                <Receipt size={36} style={{ color: 'var(--text-dark)', marginBottom: '10px' }} />
                <p style={{ fontSize: '0.9rem' }}>You haven't made any online booking advance or rent payments yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {payments
                  .filter(p => p.buyerId === user.id || p.buyerEmail === user.email)
                  .map((p) => (
                    <div key={p.id} style={{
                      padding: '18px 20px',
                      borderRadius: '14px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>
                            {p.transactionId}
                          </span>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            background: p.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.15)' :
                                        p.status === 'PENDING' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: p.status === 'COMPLETED' ? '#10b981' :
                                   p.status === 'PENDING' ? '#f59e0b' : '#ef4444'
                          }}>
                            {p.status}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '2px 0' }}>{p.propertyTitle}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {p.paymentType?.replace('_', ' ')} • via {p.paymentMethod} • {new Date(p.createdAt).toLocaleDateString('en-BD')}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                          ৳{p.amount.toLocaleString()}
                        </span>
                        <button
                          onClick={() => setSelectedVoucher(p)}
                          className="btn btn-secondary"
                          style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Receipt size={14} /> Voucher
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Wishlist Section */}
          <div className="glass" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Heart style={{ color: 'var(--danger)' }} /> My Wishlist
            </h2>

            {myWishlistProperties.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No properties in your wishlist.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {myWishlistProperties.map(p => (
                  <div key={p.id} className="glass" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <img src={p.images[0]} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                    <div style={{ padding: '16px' }}>
                      <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{p.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{p.city}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button onClick={() => navigate(`/property/${p.id}`)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                          View
                        </button>
                        <button onClick={() => onToggleWishlist(p.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Searches & Smart Alerts */}
          <div className="glass" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Search style={{ color: 'var(--primary)' }} /> Saved Searches
              </h2>
              <button
                onClick={() => setShowSearchForm(!showSearchForm)}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.85rem' }}
              >
                {showSearchForm ? <X size={14} /> : <Plus size={14} />}
                {showSearchForm ? 'Cancel' : 'New Search Alert'}
              </button>
            </div>

            {/* New Search Form */}
            {showSearchForm && (
              <form onSubmit={handleSaveSearch} style={{
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(204, 163, 83, 0.25)',
                background: 'rgba(204, 163, 83, 0.05)',
                marginBottom: '24px'
              }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '16px', color: 'var(--primary)' }}>Define Search Criteria</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>City</label>
                    <input type="text" className="input-field" placeholder="e.g. Dhaka, Gazipur" value={ssCity} onChange={e => setSsCity(e.target.value)} style={{ height: '40px', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Property Type</label>
                    <select className="input-field" value={ssType} onChange={e => setSsType(e.target.value)} style={{ height: '40px', fontSize: '0.85rem' }}>
                      <option value="">Any Type</option>
                      <option value="RESIDENTIAL">Residential</option>
                      <option value="COMMERCIAL">Commercial</option>
                      <option value="LAND">Land</option>
                      <option value="RENTAL">Rental</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Min Price (BDT)</label>
                    <input type="number" className="input-field" placeholder="e.g. 5000000" value={ssMinPrice} onChange={e => setSsMinPrice(e.target.value)} style={{ height: '40px', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Max Price (BDT)</label>
                    <input type="number" className="input-field" placeholder="e.g. 20000000" value={ssMaxPrice} onChange={e => setSsMaxPrice(e.target.value)} style={{ height: '40px', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Min Bedrooms</label>
                    <input type="number" className="input-field" placeholder="e.g. 2" min="0" value={ssBedrooms} onChange={e => setSsBedrooms(e.target.value)} style={{ height: '40px', fontSize: '0.85rem' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '2px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem' }}>
                      <input type="checkbox" checked={ssAlerts} onChange={e => setSsAlerts(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }} />
                      <span>Enable Smart Alerts</span>
                      <Bell size={14} style={{ color: 'var(--primary)' }} />
                    </label>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '18px', padding: '10px 24px', fontSize: '0.85rem' }}>
                  Save This Search
                </button>
              </form>
            )}

            {/* Saved Search List */}
            {savedSearches.length === 0 && !showSearchForm ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
                <Search size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <p>No saved searches yet. Create one to get Smart Alerts when matching properties are listed.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {savedSearches.map(s => {
                  const matchCount = getMatchCount(s);
                  return (
                    <div key={s.id} style={{
                      padding: '18px 20px',
                      borderRadius: '14px',
                      border: '1px solid var(--border-color)',
                      background: 'rgba(255,255,255,0.01)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '16px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                          {s.city && <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', background: 'rgba(204,163,83,0.12)', color: 'var(--primary)', fontWeight: 600 }}>📍 {s.city}</span>}
                          {s.propertyType && <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}>{s.propertyType}</span>}
                          {s.minPrice && <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', background: 'rgba(16,185,129,0.1)', color: 'var(--secondary)' }}>Min: {formatBDT(s.minPrice)}</span>}
                          {s.maxPrice && <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', background: 'rgba(16,185,129,0.1)', color: 'var(--secondary)' }}>Max: {formatBDT(s.maxPrice)}</span>}
                          {s.minBedrooms && <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>🛏 {s.minBedrooms}+ beds</span>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <span style={{ color: matchCount > 0 ? 'var(--secondary)' : 'var(--text-muted)', fontWeight: matchCount > 0 ? 600 : 400 }}>
                            <Star size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            {matchCount} matching {matchCount === 1 ? 'property' : 'properties'}
                          </span>
                          {s.alertsEnabled
                            ? <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Bell size={12} /> Alerts ON</span>
                            : <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><BellOff size={12} /> Alerts OFF</span>
                          }
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                        {matchCount > 0 && (
                          <Link to={buildSearchUrl(s)} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.75rem', textDecoration: 'none' }}>
                            View Results
                          </Link>
                        )}
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleToggleSearchAlert(s.id)}
                            title={s.alertsEnabled ? 'Disable Alerts' : 'Enable Alerts'}
                            style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '5px 8px', cursor: 'pointer', color: s.alertsEnabled ? 'var(--primary)' : 'var(--text-muted)' }}
                          >
                            {s.alertsEnabled ? <Bell size={14} /> : <BellOff size={14} />}
                          </button>
                          <button
                            onClick={() => handleDeleteSearch(s.id)}
                            title="Delete Search"
                            style={{ background: 'none', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '5px 8px', cursor: 'pointer', color: 'var(--danger)' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right column: Verification and User Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Profile Details Card */}
          <div className="glass" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User style={{ color: 'var(--primary)' }} /> Profile Details
            </h3>

            {/* Avatar Preview */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: (user.profilePictureUrl || picUrl.trim()) ? 'transparent' : 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                fontSize: '2.2rem',
                fontWeight: 800,
                color: '#0b0f19',
                boxShadow: '0 0 20px rgba(204,163,83,0.3)'
              }}>
                {(user.profilePictureUrl || picUrl.trim())
                  ? <img
                      src={picUrl.trim() || user.profilePictureUrl}
                      alt="Profile preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  : (profileName || 'U')[0].toUpperCase()
                }
              </div>
            </div>

            {profileMessage && (
              <div style={{
                padding: '8px 14px',
                borderRadius: '8px',
                marginBottom: '14px',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                background: profileMessage.type === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                color: profileMessage.type === 'success' ? 'var(--secondary)' : 'var(--danger)',
                border: `1px solid ${profileMessage.type === 'success' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`
              }}>
                {profileMessage.type === 'success' ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
                {profileMessage.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={profileName}
                  onChange={e => { setProfileName(e.target.value); setProfileMessage(null); }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={profilePhone}
                  onChange={e => { setProfilePhone(e.target.value); setProfileMessage(null); }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Profile Picture URL
                </label>
                <input
                  id="buyer-profile-pic-url"
                  type="url"
                  className="input-field"
                  placeholder="https://example.com/photo.jpg"
                  value={picUrl}
                  onChange={e => { setPicUrl(e.target.value); setProfileMessage(null); }}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={profileLoading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {profileLoading
                  ? <><RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
                  : 'Save Details'
                }
              </button>
            </form>
          </div>

          {/* Account Verification (KYC) Card */}
          <div className="glass" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield style={{ color: 'var(--primary)' }} /> KYC Verification
            </h3>

            {user.isVerified ? (
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <span style={{ fontSize: '3rem' }}>✅</span>
                <h4 style={{ marginTop: '12px', color: 'var(--secondary)' }}>Account Verified</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                  Your document submission has been verified. You can now schedule visits without limitations.
                </p>
              </div>
            ) : user.kycStatus === 'PENDING' || kycSubmitted ? (
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <RefreshCw className="spinner" size={32} style={{ animation: 'spin 2s linear infinite', color: 'var(--warning)' }} />
                <h4 style={{ marginTop: '12px', color: 'var(--warning)' }}>Verification Pending</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                  Your document ({user.kycDocType || docType} - {user.kycDocNum || docNumber}) is currently being reviewed by Admin.
                </p>
              </div>
            ) : (
              <form onSubmit={handleKycSubmit}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Submit national ID or Trade License to unlock verified buyer status.
                </p>

                <div className="input-group">
                  <label className="input-label">Document Type</label>
                  <select className="input-field" value={docType} onChange={(e) => setDocType(e.target.value)}>
                    <option value="NID">National ID (NID)</option>
                    <option value="TRADE_LICENSE">Trade License</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Document Number</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. 199512345678" 
                    value={docNumber} 
                    onChange={(e) => setDocNumber(e.target.value)}
                  />
                </div>

                <div className="input-group" style={{ marginBottom: '24px' }}>
                  <label className="input-label">Document Scan URL</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Link to document image" 
                    value={docUrl} 
                    onChange={(e) => setDocUrl(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Submit for Verification
                </button>
              </form>
            )}
          </div>

          {/* Change Password Card */}
          <div className="glass" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock style={{ color: 'var(--primary)' }} /> Change Password
            </h3>

            {pwdMessage && (
              <div style={{
                padding: '10px 16px',
                borderRadius: '10px',
                marginBottom: '18px',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: pwdMessage.type === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                color: pwdMessage.type === 'success' ? 'var(--secondary)' : 'var(--danger)',
                border: `1px solid ${pwdMessage.type === 'success' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`
              }}>
                {pwdMessage.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                {pwdMessage.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Current Password */}
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Current Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="buyer-current-password"
                    type={showCurrentPwd ? 'text' : 'password'}
                    className="input-field"
                    placeholder="Enter current password"
                    value={currentPwd}
                    onChange={e => { setCurrentPwd(e.target.value); setPwdMessage(null); }}
                    required
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPwd(v => !v)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0' }}
                  >
                    {showCurrentPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  New Password <span style={{ color: 'var(--text-dark)', fontWeight: 400 }}>(min. 8 characters)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="buyer-new-password"
                    type={showNewPwd ? 'text' : 'password'}
                    className="input-field"
                    placeholder="Enter new password"
                    value={newPwd}
                    onChange={e => { setNewPwd(e.target.value); setPwdMessage(null); }}
                    required
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPwd(v => !v)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0' }}
                  >
                    {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Confirm New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="buyer-confirm-password"
                    type={showConfirmPwd ? 'text' : 'password'}
                    className="input-field"
                    placeholder="Re-enter new password"
                    value={confirmPwd}
                    onChange={e => { setConfirmPwd(e.target.value); setPwdMessage(null); }}
                    required
                    style={{
                      paddingRight: '40px',
                      borderColor: confirmPwd && newPwd && confirmPwd !== newPwd ? 'var(--danger)' : undefined
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd(v => !v)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0' }}
                  >
                    {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPwd && newPwd && confirmPwd !== newPwd && (
                  <p style={{ color: 'var(--danger)', fontSize: '0.72rem', marginTop: '4px' }}>Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={pwdLoading}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}
              >
                {pwdLoading ? (
                  <>
                    <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    Update Password
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Complaints & Disputes */}
          <div className="glass" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle style={{ color: 'var(--danger)' }} /> Complaints
              </h3>
              <button
                onClick={() => setShowComplaintForm(v => !v)}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', fontSize: '0.8rem' }}
              >
                {showComplaintForm ? <X size={13} /> : <Plus size={13} />}
                {showComplaintForm ? 'Cancel' : 'File Complaint'}
              </button>
            </div>

            {/* File Complaint Form */}
            {showComplaintForm && (
              <form onSubmit={handleComplaintSubmit} style={{
                padding: '18px', borderRadius: '14px',
                border: '1px solid rgba(239,68,68,0.2)',
                background: 'rgba(239,68,68,0.04)',
                marginBottom: '20px',
                display: 'flex', flexDirection: 'column', gap: '14px',
              }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Complaint Type
                  </label>
                  <select
                    className="input-field"
                    value={complaintType}
                    onChange={e => setComplaintType(e.target.value)}
                    style={{ fontSize: '0.875rem' }}
                  >
                    <option value="PROPERTY_ISSUE">Property Issue</option>
                    <option value="AGENT_MISCONDUCT">Agent / Owner Misconduct</option>
                    <option value="FAKE_LISTING">Fake / Misleading Listing</option>
                    <option value="BOOKING_PROBLEM">Booking Problem</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Related Property (optional)
                  </label>
                  <select
                    className="input-field"
                    value={complaintPropertyId}
                    onChange={e => setComplaintPropertyId(e.target.value)}
                    style={{ fontSize: '0.875rem' }}
                  >
                    <option value="">— None / General —</option>
                    {properties.filter(p => p.verificationStatus === 'APPROVED').map(p => (
                      <option key={p.id} value={p.id}>{p.title} ({p.city})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Description *
                  </label>
                  <textarea
                    className="input-field"
                    rows={4}
                    placeholder="Describe the issue in detail…"
                    value={complaintDesc}
                    onChange={e => setComplaintDesc(e.target.value)}
                    required
                    style={{ fontSize: '0.875rem', resize: 'vertical' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '9px 20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageSquare size={14} /> Submit Complaint
                </button>
              </form>
            )}

            {/* My Complaints List */}
            {(() => {
              const myComplaints = (complaints || []).filter(c => c.buyerId === user.id);
              if (myComplaints.length === 0 && !showComplaintForm) {
                return (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    No complaints filed. Use the button above to report an issue.
                  </p>
                );
              }
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {myComplaints.map(c => {
                    const prop = properties.find(p => p.id === c.propertyId);
                    const statusIcon  = c.status === 'RESOLVED' ? <CheckCircle size={13} /> : c.status === 'REJECTED' ? <X size={13} /> : <Clock size={13} />;
                    const statusColor = c.status === 'RESOLVED' ? 'var(--secondary)' : c.status === 'REJECTED' ? 'var(--danger)' : 'var(--warning)';
                    const statusBg    = c.status === 'RESOLVED' ? 'rgba(16,185,129,0.1)' : c.status === 'REJECTED' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)';
                    return (
                      <div key={c.id} style={{
                        padding: '14px 16px', borderRadius: '12px',
                        background: 'rgba(255,255,255,0.01)',
                        border: '1px solid var(--border-color)',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {c.type.replace(/_/g, ' ')}
                          </span>
                          <span style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            fontSize: '0.7rem', fontWeight: 700,
                            padding: '3px 9px', borderRadius: '20px',
                            background: statusBg, color: statusColor,
                          }}>
                            {statusIcon} {c.status}
                          </span>
                        </div>
                        {prop && (
                          <p style={{ fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '6px' }}>
                            📍 {prop.title}
                          </p>
                        )}
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '10px' }}>
                          {c.description}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-dark)' }}>
                            {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                          {c.status === 'OPEN' && (
                            <button
                              onClick={() => handleDeleteComplaint(c.id)}
                              style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Trash2 size={12} /> Withdraw
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

        </div>

      </div>

      {/* Voucher Modal Preview */}
      {selectedVoucher && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
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
            maxWidth: '500px',
            padding: '30px',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Receipt style={{ color: 'var(--primary)' }} size={20} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Official Payment Voucher</h3>
              </div>
              <button onClick={() => setSelectedVoucher(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Transaction ID:</span>
                <span style={{ color: 'var(--primary)', fontFamily: 'monospace', fontWeight: 800 }}>{selectedVoucher.transactionId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Property:</span>
                <strong style={{ color: '#ffffff', textAlign: 'right', maxWidth: '240px' }}>{selectedVoucher.propertyTitle}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment For:</span>
                <span>{selectedVoucher.paymentType?.replace('_', ' ')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Channel / Method:</span>
                <span style={{ fontWeight: 700 }}>{selectedVoucher.paymentMethod}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Date & Time:</span>
                <span>{new Date(selectedVoucher.createdAt).toLocaleString('en-BD')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: 700 }}>Paid Amount:</span>
                <strong style={{ color: 'var(--primary)' }}>৳{selectedVoucher.amount.toLocaleString()}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => window.print()} className="btn btn-secondary" style={{ flex: 1 }}>
                <Printer size={16} /> Print Voucher
              </button>
              <button onClick={() => setSelectedVoucher(null)} className="btn btn-primary" style={{ flex: 1 }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
