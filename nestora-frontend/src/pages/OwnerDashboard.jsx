import React, { useState } from 'react';
import { Calendar, PlusCircle, Check, X, ShieldAlert, FileText, Image, Lock, Eye, EyeOff, RefreshCw, CheckCircle, AlertCircle, User, CreditCard, DollarSign, Receipt } from 'lucide-react';
import { BD_DISTRICTS } from '../constants/districts';

export default function OwnerDashboard({ user, setUser, properties, setProperties, bookings, setBookings, payments = [], triggerNotification }) {
  // Tabs: 'listings', 'bookings', 'payments', 'create', 'settings'
  const [activeTab, setActiveTab] = useState('listings');

  // Change Password state
  const [ownerCurrentPwd, setOwnerCurrentPwd]     = useState('');
  const [ownerNewPwd, setOwnerNewPwd]             = useState('');
  const [ownerConfirmPwd, setOwnerConfirmPwd]     = useState('');
  const [ownerShowCurrentPwd, setOwnerShowCurrentPwd] = useState(false);
  const [ownerShowNewPwd, setOwnerShowNewPwd]     = useState(false);
  const [ownerShowConfirmPwd, setOwnerShowConfirmPwd] = useState(false);
  const [ownerPwdLoading, setOwnerPwdLoading]     = useState(false);
  const [ownerPwdMessage, setOwnerPwdMessage]     = useState(null);

  // Profile Details state
  const [ownerProfileName, setOwnerProfileName]   = useState(user.fullName || '');
  const [ownerProfilePhone, setOwnerProfilePhone] = useState(user.phoneNumber || user.phone_number || '');
  const [ownerPicUrl, setOwnerPicUrl]             = useState(user.profilePictureUrl || '');
  const [ownerProfileLoading, setOwnerProfileLoading] = useState(false);
  const [ownerProfileMessage, setOwnerProfileMessage] = useState(null);

  // Form states for creating a new property listing
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState('RESIDENTIAL');
  const [pricing, setPricing] = useState('');
  const [areaSize, setAreaSize] = useState('');
  const [bedrooms, setBedrooms] = useState('2');
  const [bathrooms, setBathrooms] = useState('2');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [amenitiesInput, setAmenitiesInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  // Filter listings owned by this user
  const myProperties = properties.filter(p => p.ownerId === user.id);

  // Filter bookings for this owner's properties
  const myPropertyIds = myProperties.map(p => p.id);
  const myPropertyBookings = bookings.filter(b => myPropertyIds.includes(b.propertyId));

  const handleCreateListing = (e) => {
    e.preventDefault();
    if (!title || !description || !pricing || !areaSize || !address || !imageInput) {
      alert('Please fill out all required fields.');
      return;
    }

    const newProperty = {
      id: properties.length + 1,
      title,
      description,
      propertyType,
      status: 'AVAILABLE',
      verificationStatus: 'PENDING', // Submits to admin first
      pricing: parseFloat(pricing),
      areaSize: parseFloat(areaSize),
      numberOfBedrooms: parseInt(bedrooms),
      numberOfBathrooms: parseInt(bathrooms),
      address,
      city,
      locationLat: 23.8103, // Mock Lat
      locationLong: 90.4125, // Mock Long
      ownerId: user.id,
      amenities: amenitiesInput ? amenitiesInput.split(',').map(a => a.trim()) : [],
      images: [imageInput]
    };

    setProperties([...properties, newProperty]);

    // Notify Admin (mock user ID 1)
    triggerNotification(
      1,
      'New Property Verification Required',
      `Owner ${user.fullName} listed property: "${title}". Moderation approval is required to publish.`
    );

    alert('Property listed successfully! It has been submitted to Nestora Admin for verification.');
    
    // Reset form
    setTitle('');
    setDescription('');
    setPricing('');
    setAreaSize('');
    setAddress('');
    setAmenitiesInput('');
    setImageInput('');
    setActiveTab('listings');
  };

  const handleUpdateBookingStatus = (bookingId, newStatus) => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    
    const targetBooking = bookings.find(b => b.id === bookingId);
    const targetProp = properties.find(p => p.id === targetBooking?.propertyId);
    
    if (targetBooking?.buyerId) {
      triggerNotification(
        targetBooking.buyerId,
        `Inspection Visit ${newStatus}`,
        `Your visit booking for property "${targetProp?.title || 'Unknown Property'}" has been ${newStatus.toLowerCase()} by the owner.`
      );
    }
  };

  const handleChangeOwnerPassword = async (e) => {
    e.preventDefault();
    setOwnerPwdMessage(null);
    if (ownerNewPwd.length < 8) {
      setOwnerPwdMessage({ type: 'error', text: 'New password must be at least 8 characters.' });
      return;
    }
    if (ownerNewPwd !== ownerConfirmPwd) {
      setOwnerPwdMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (ownerCurrentPwd === ownerNewPwd) {
      setOwnerPwdMessage({ type: 'error', text: 'New password must differ from the current password.' });
      return;
    }
    setOwnerPwdLoading(true);
    // Simulate API call: PUT /api/v1/profile/password
    await new Promise(res => setTimeout(res, 800));
    setOwnerPwdLoading(false);
    setOwnerCurrentPwd('');
    setOwnerNewPwd('');
    setOwnerConfirmPwd('');
    setOwnerPwdMessage({ type: 'success', text: 'Password changed successfully!' });
  };

  const handleUpdateOwnerProfile = async (e) => {
    e.preventDefault();
    setOwnerProfileMessage(null);
    if (!ownerProfileName.trim()) {
      setOwnerProfileMessage({ type: 'error', text: 'Full Name cannot be empty.' });
      return;
    }
    setOwnerProfileLoading(true);
    // Simulate API call: PUT /api/v1/profile
    await new Promise(res => setTimeout(res, 700));
    setOwnerProfileLoading(false);
    setUser(prev => ({
      ...prev,
      fullName: ownerProfileName.trim(),
      phoneNumber: ownerProfilePhone.trim(),
      phone_number: ownerProfilePhone.trim(),
      profilePictureUrl: ownerPicUrl.trim()
    }));
    setOwnerProfileMessage({ type: 'success', text: 'Profile details updated successfully!' });
  };

  const formatBDT = (value) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Filter received payments for this owner's properties
  const myReceivedPayments = payments.filter(p => myPropertyIds.includes(p.propertyId) || p.ownerId === user.id);

  // KYC Verification form state
  const [ownerDocType, setOwnerDocType] = useState('TRADE_LICENSE');
  const [ownerDocNumber, setOwnerDocNumber] = useState('');
  const [ownerDocUrl, setOwnerDocUrl] = useState('');
  const [ownerKycSubmitted, setOwnerKycSubmitted] = useState(false);

  const handleOwnerKycSubmit = (e) => {
    e.preventDefault();
    if (!ownerDocNumber || !ownerDocUrl) {
      alert('Please fill out all document verification fields.');
      return;
    }
    setOwnerKycSubmitted(true);
    
    // Notify Admin (mock user ID 1)
    triggerNotification(
      1,
      'Owner KYC Verification Requested',
      `Property Owner/Agent ${user.fullName} submitted ${ownerDocType} (${ownerDocNumber}) for KYC verification.`
    );

    setUser({
      ...user,
      kycStatus: 'PENDING',
      kycDocType: ownerDocType,
      kycDocNum: ownerDocNumber
    });

    alert('Your KYC verification documents have been submitted to Nestora Admin for approval.');
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '80px', marginTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Owner & Agent Portal</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Manage your real estate listings, inspect visit bookings, and verify your official credentials.
          </p>
        </div>

        {/* KYC Badge indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '20px',
          background: user.kycStatus === 'APPROVED' ? 'rgba(16,185,129,0.15)' :
                      user.kycStatus === 'PENDING' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.12)',
          border: `1px solid ${user.kycStatus === 'APPROVED' ? 'rgba(16,185,129,0.4)' : user.kycStatus === 'PENDING' ? 'rgba(245,158,11,0.4)' : 'rgba(239,68,68,0.3)'}`
        }}>
          <ShieldAlert size={18} style={{ color: user.kycStatus === 'APPROVED' ? '#10b981' : user.kycStatus === 'PENDING' ? '#f59e0b' : '#ef4444' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: user.kycStatus === 'APPROVED' ? '#10b981' : user.kycStatus === 'PENDING' ? '#f59e0b' : '#ef4444' }}>
            {user.kycStatus === 'APPROVED' ? 'Verified Partner ✓' : user.kycStatus === 'PENDING' ? 'KYC Under Review ⏳' : 'Unverified Partner ⚠️'}
          </span>
        </div>
      </div>

      {/* Tabs Menu */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('listings')}
          className={`btn ${activeTab === 'listings' ? 'btn-primary' : 'btn-secondary'}`}
        >
          My Listings ({myProperties.length})
        </button>
        <button 
          onClick={() => setActiveTab('bookings')}
          className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Inspection Bookings ({myPropertyBookings.length})
        </button>
        <button 
          onClick={() => setActiveTab('payments')}
          className={`btn ${activeTab === 'payments' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <CreditCard size={16} /> Received Payments ({myReceivedPayments.length})
        </button>
        <button 
          onClick={() => setActiveTab('kyc')}
          className={`btn ${activeTab === 'kyc' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ShieldAlert size={16} /> KYC Verification
        </button>
        <button 
          onClick={() => setActiveTab('create')}
          className={`btn ${activeTab === 'create' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <PlusCircle size={16} /> List New Property
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Lock size={16} /> Account Settings
        </button>
      </div>

      {/* Tab: KYC Verification */}
      {activeTab === 'kyc' && (
        <div className="glass animate-fade-in" style={{ padding: '32px', maxWidth: '750px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert style={{ color: 'var(--primary)' }} /> Partner KYC & Trade License Verification
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>
            Upload legal verification documents (National ID, Trade License, or REHAB Certification) to receive the Verified Partner badge.
          </p>

          {user.kycStatus === 'APPROVED' ? (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <CheckCircle size={36} style={{ color: '#10b981' }} />
              <div>
                <h4 style={{ fontSize: '1.1rem', color: '#10b981', margin: 0 }}>Your Account is Officially Verified</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  Document: {user.kycDocType || 'Trade License'} ({user.kycDocNum || 'Approved'}). All your properties will display the Verified badge.
                </p>
              </div>
            </div>
          ) : user.kycStatus === 'PENDING' ? (
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <AlertCircle size={36} style={{ color: '#f59e0b' }} />
              <div>
                <h4 style={{ fontSize: '1.1rem', color: '#f59e0b', margin: 0 }}>Verification Review Pending</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  Your document ({user.kycDocType || ownerDocType}) has been submitted to the Admin team. You will receive an instant notification once approved.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleOwnerKycSubmit}>
              <div className="input-group">
                <label className="input-label">Document Type *</label>
                <select 
                  className="input-field"
                  value={ownerDocType}
                  onChange={(e) => setOwnerDocType(e.target.value)}
                >
                  <option value="TRADE_LICENSE">City Corporation Trade License</option>
                  <option value="NID">National ID Card (NID)</option>
                  <option value="REHAB_CERTIFICATE">REHAB / Real Estate Agent License</option>
                  <option value="PASSPORT">Passport</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Document Registration Number *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. TL-DCC-2025-9382 or NID 1994857362"
                  value={ownerDocNumber}
                  onChange={(e) => setOwnerDocNumber(e.target.value)}
                  required
                />
              </div>

              <div className="input-group" style={{ marginBottom: '24px' }}>
                <label className="input-label">Document Scan URL / Photo Link *</label>
                <input 
                  type="url" 
                  className="input-field" 
                  placeholder="https://example.com/uploads/trade_license_scan.jpg"
                  value={ownerDocUrl}
                  onChange={(e) => setOwnerDocUrl(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '46px' }}>
                <ShieldAlert size={16} /> Submit Documents for KYC Approval
              </button>
            </form>
          )}
        </div>
      )}

      {/* Tab: Received Payments */}
      {activeTab === 'payments' && (
        <div className="glass animate-fade-in" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CreditCard style={{ color: 'var(--primary)' }} /> Received Booking Advances & Rents
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                Escrow deposits and payments collected from verified buyers.
              </p>
            </div>
            <div style={{
              background: 'rgba(204, 163, 83, 0.1)',
              border: '1px solid rgba(204, 163, 83, 0.25)',
              padding: '10px 18px',
              borderRadius: '12px',
              textAlign: 'right'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Total Earnings Received</span>
              <strong style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>
                {formatBDT(myReceivedPayments.filter(p => p.status === 'COMPLETED').reduce((acc, curr) => acc + (curr.amount || 0), 0))}
              </strong>
            </div>
          </div>

          {myReceivedPayments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <Receipt size={40} style={{ color: 'var(--text-dark)', marginBottom: '12px' }} />
              <p>No payments received for your properties yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {myReceivedPayments.map((p) => (
                <div key={p.id} style={{
                  padding: '20px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '14px'
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
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '2px 0' }}>{p.propertyTitle}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Payer: <strong style={{ color: '#ffffff' }}>{p.buyerName}</strong> ({p.buyerPhone || p.buyerEmail})
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>
                      Payment Type: {p.paymentType?.replace('_', ' ')} • Channel: {p.paymentMethod} • Date: {new Date(p.createdAt).toLocaleDateString('en-BD')}
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Net Amount</span>
                    <strong style={{ fontSize: '1.4rem', color: 'var(--primary)', display: 'block' }}>
                      {formatBDT(p.amount)}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: '#10b981' }}>
                      {p.status === 'COMPLETED' ? '✓ Credited to Owner Account' : '⏳ Escrow Verification Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: My Listings */}
      {activeTab === 'listings' && (
        <div className="glass animate-fade-in" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>My Listed Properties</h2>
          {myProperties.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>You don't have any properties listed yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {myProperties.map(p => (
                <div key={p.id} style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)',
                  background: 'rgba(255,255,255,0.01)'
                }}>
                  <img src={p.images[0]} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        background: p.verificationStatus === 'APPROVED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: p.verificationStatus === 'APPROVED' ? 'var(--secondary)' : 'var(--warning)'
                      }}>
                        {p.verificationStatus === 'APPROVED' ? 'Verified' : 'Pending Verification'}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>{p.propertyType}</span>
                    </div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{p.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.address}, {p.city}</p>
                    <p style={{ fontSize: '1rem', fontWeight: 750, color: '#ffffff', marginTop: '12px' }}>{formatBDT(p.pricing)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Booking Requests */}
      {activeTab === 'bookings' && (
        <div className="glass animate-fade-in" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>🏠 Incoming Booking Requests</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {myPropertyBookings.filter(b => b.status === 'PENDING').length} pending
            </span>
          </div>
          {myPropertyBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '1rem' }}>No booking requests received yet.</p>
              <p style={{ fontSize: '0.85rem' }}>When a buyer requests a visit, it will appear here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {myPropertyBookings.slice().reverse().map(b => {
                const prop = properties.find(p => p.id === b.propertyId);
                const requestTime = b.createdAt ? new Date(b.createdAt).toLocaleString('en-BD', { dateStyle: 'medium', timeStyle: 'short' }) : 'Unknown';
                return (
                  <div key={b.id} style={{
                    padding: '20px',
                    borderRadius: '14px',
                    background: b.status === 'PENDING' ? 'rgba(245, 158, 11, 0.06)' : b.status === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.06)' : 'rgba(239,68,68,0.06)',
                    border: `1.5px solid ${b.status === 'PENDING' ? 'rgba(245,158,11,0.35)' : b.status === 'CONFIRMED' ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)'}`,
                  }}>
                    {/* Top row: property name + status badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h4 style={{ fontSize: '1rem', marginBottom: '2px', color: 'var(--text-main)' }}>{prop?.title || 'Unknown Property'}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prop?.address}, {prop?.city}</span>
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: b.status === 'PENDING' ? 'rgba(245,158,11,0.18)' : b.status === 'CONFIRMED' ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.18)',
                        color: b.status === 'PENDING' ? '#b45309' : b.status === 'CONFIRMED' ? '#065f46' : '#991b1b'
                      }}>{b.status}</span>
                    </div>

                    {/* Buyer info */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px', padding: '12px', background: 'rgba(255,255,255,0.5)', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.06)' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Buyer Name</span>
                        <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0c2340', margin: '2px 0 0 0' }}>{b.buyerName || `Buyer #${b.buyerId}`}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact</span>
                        <p style={{ fontSize: '0.82rem', color: '#334155', margin: '2px 0 0 0' }}>{b.buyerEmail || '—'}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Visit Date</span>
                        <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0c2340', margin: '2px 0 0 0' }}>{b.visitDate}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time Slot</span>
                        <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0c2340', margin: '2px 0 0 0' }}>{b.visitTimeSlot}</p>
                      </div>
                    </div>

                    {b.remarks && (
                      <div style={{ marginBottom: '12px', padding: '10px 14px', background: 'rgba(100,116,139,0.08)', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Buyer Note</span>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.83rem', color: '#334155', fontStyle: 'italic' }}>"{ b.remarks}"</p>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Requested: {requestTime}</span>
                      {b.status === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            onClick={() => handleUpdateBookingStatus(b.id, 'CONFIRMED')}
                            className="btn"
                            style={{ background: '#10b981', color: '#ffffff', padding: '7px 16px', fontSize: '0.82rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <Check size={14} /> Accept
                          </button>
                          <button
                            onClick={() => handleUpdateBookingStatus(b.id, 'CANCELLED')}
                            className="btn-danger"
                            style={{ padding: '7px 16px', fontSize: '0.82rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <X size={14} /> Decline
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: b.status === 'CONFIRMED' ? '#10b981' : '#ef4444' }}>
                          {b.status === 'CONFIRMED' ? '✅ Accepted' : '❌ Declined'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: List New Property Form */}
      {activeTab === 'create' && (
        <div className="glass animate-fade-in" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText style={{ color: 'var(--primary)' }} /> Listing Form
          </h2>
          <form onSubmit={handleCreateListing}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="input-group">
                <label className="input-label">Property Title *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Modern Lakefront Apartment"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Property Type *</label>
                <select className="input-field" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                  <option value="RESIDENTIAL">Residential</option>
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="RENTAL">Rental</option>
                  <option value="LAND">Land</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Description *</label>
              <textarea 
                className="input-field" 
                rows={4}
                placeholder="Describe features, amenities, and connectivity..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
              <div className="input-group">
                <label className="input-label">Price (BDT) *</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={pricing}
                  onChange={(e) => setPricing(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Area (sq ft) *</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={areaSize}
                  onChange={(e) => setAreaSize(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Bedrooms</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Bathrooms</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
              <div className="input-group">
                <label className="input-label">Address *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Road 12, Sector 4, Uttara"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">City *</label>
                <select className="input-field" value={city} onChange={(e) => setCity(e.target.value)}>
                  {BD_DISTRICTS.map(d => (
                    <option key={d.id} value={d.en}>
                      {d.en} ({d.bn})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Amenities (Comma separated)</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="WiFi, Lift, Backup Generator, Security, Lake View"
                value={amenitiesInput}
                onChange={(e) => setAmenitiesInput(e.target.value)}
              />
            </div>

            <div className="input-group" style={{ marginBottom: '32px' }}>
              <label className="input-label">Property Main Image URL *</label>
              <div style={{ position: 'relative' }}>
                <Image size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-dark)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ paddingLeft: '48px' }}
                  placeholder="Paste URL of property image"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px' }}>
              Submit Property Listing
            </button>

          </form>
        </div>
      )}

      {/* Tab: Account Settings (Profile Picture & Change Password) */}
      {activeTab === 'settings' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'start', maxWidth: '1000px' }}>
          
          {/* Profile Details Card */}
          <div className="glass animate-fade-in" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User style={{ color: 'var(--primary)' }} /> Profile Details
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '20px' }}>
              Update your account settings.
            </p>

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
                background: (user.profilePictureUrl || ownerPicUrl.trim()) ? 'transparent' : 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                fontSize: '2.2rem',
                fontWeight: 800,
                color: '#0b0f19',
                boxShadow: '0 0 20px rgba(204,163,83,0.3)'
              }}>
                {(user.profilePictureUrl || ownerPicUrl.trim())
                  ? <img
                      src={ownerPicUrl.trim() || user.profilePictureUrl}
                      alt="Profile preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  : (ownerProfileName || 'U')[0].toUpperCase()
                }
              </div>
            </div>

            {ownerProfileMessage && (
              <div style={{
                padding: '10px 16px',
                borderRadius: '10px',
                marginBottom: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: ownerProfileMessage.type === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                color: ownerProfileMessage.type === 'success' ? 'var(--secondary)' : 'var(--danger)',
                border: `1px solid ${ownerProfileMessage.type === 'success' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`
              }}>
                {ownerProfileMessage.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                {ownerProfileMessage.text}
              </div>
            )}

            <form onSubmit={handleUpdateOwnerProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={ownerProfileName}
                  onChange={e => { setOwnerProfileName(e.target.value); setOwnerProfileMessage(null); }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={ownerProfilePhone}
                  onChange={e => { setOwnerProfilePhone(e.target.value); setOwnerProfileMessage(null); }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                  Profile Picture URL
                </label>
                <input
                  id="owner-profile-pic-url"
                  type="url"
                  className="input-field"
                  placeholder="https://example.com/photo.jpg"
                  value={ownerPicUrl}
                  onChange={e => { setOwnerPicUrl(e.target.value); setOwnerProfileMessage(null); }}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={ownerProfileLoading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '46px' }}
              >
                {ownerProfileLoading
                  ? <><RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
                  : 'Save Details'
                }
              </button>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="glass animate-fade-in" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lock style={{ color: 'var(--primary)' }} /> Change Password
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '28px' }}>
              Update your account password. Your new password must be at least 8 characters.
            </p>

            {ownerPwdMessage && (
              <div style={{
                padding: '10px 16px',
                borderRadius: '10px',
                marginBottom: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: ownerPwdMessage.type === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                color: ownerPwdMessage.type === 'success' ? 'var(--secondary)' : 'var(--danger)',
                border: `1px solid ${ownerPwdMessage.type === 'success' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`
              }}>
                {ownerPwdMessage.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                {ownerPwdMessage.text}
              </div>
            )}

            <form onSubmit={handleChangeOwnerPassword} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                  Current Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="owner-current-password"
                    type={ownerShowCurrentPwd ? 'text' : 'password'}
                    className="input-field"
                    placeholder="Enter current password"
                    value={ownerCurrentPwd}
                    onChange={e => { setOwnerCurrentPwd(e.target.value); setOwnerPwdMessage(null); }}
                    required
                    style={{ paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setOwnerShowCurrentPwd(v => !v)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                  >
                    {ownerShowCurrentPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                  New Password <span style={{ fontWeight: 400, color: 'var(--text-dark)' }}>(min. 8 characters)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="owner-new-password"
                    type={ownerShowNewPwd ? 'text' : 'password'}
                    className="input-field"
                    placeholder="Enter new password"
                    value={ownerNewPwd}
                    onChange={e => { setOwnerNewPwd(e.target.value); setOwnerPwdMessage(null); }}
                    required
                    style={{ paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setOwnerShowNewPwd(v => !v)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                  >
                    {ownerShowNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                  Confirm New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="owner-confirm-password"
                    type={ownerShowConfirmPwd ? 'text' : 'password'}
                    className="input-field"
                    placeholder="Re-enter new password"
                    value={ownerConfirmPwd}
                    onChange={e => { setOwnerConfirmPwd(e.target.value); setOwnerPwdMessage(null); }}
                    required
                    style={{
                      paddingRight: '44px',
                      borderColor: ownerConfirmPwd && ownerNewPwd && ownerConfirmPwd !== ownerNewPwd ? 'var(--danger)' : undefined
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setOwnerShowConfirmPwd(v => !v)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                  >
                    {ownerShowConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {ownerConfirmPwd && ownerNewPwd && ownerConfirmPwd !== ownerNewPwd && (
                  <p style={{ color: 'var(--danger)', fontSize: '0.72rem', marginTop: '5px' }}>Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={ownerPwdLoading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '46px', marginTop: '4px' }}
              >
                {ownerPwdLoading ? (
                  <>
                    <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    Update Password
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
