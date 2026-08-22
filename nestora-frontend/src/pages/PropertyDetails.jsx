import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, DollarSign, Award, ArrowLeft, Send, CheckCircle, Calculator, Map, MapPin, MessageSquare, TrendingUp, Bot, CreditCard, Lock, ShieldCheck, Wallet } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';

export default function PropertyDetails({ user, properties, bookings, setBookings, payments = [], onAddPayment, reviews, setReviews, triggerNotification }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = properties.find((p) => p.id === parseInt(id));

  // --- Payment Modal State ---
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentModalType, setPaymentModalType] = useState('BOOKING_ADVANCE');

  // --- Image Gallery State ---
  const [activeImage, setActiveImage] = useState(property?.images?.[0] || '');

  // --- Booking Schedule Form State ---
  const [visitDate, setVisitDate] = useState('');
  const [visitTimeSlot, setVisitTimeSlot] = useState('');
  const [bookingRemarks, setBookingRemarks] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // --- EMI Calculator State ---
  const [downPayment, setDownPayment] = useState(property?.pricing ? property.pricing * 0.2 : 0); // 20% default down payment
  const [interestRate, setInterestRate] = useState(9); // 9% default interest rate in BD banks
  const [loanTerm, setLoanTerm] = useState(15); // 15 years loan term
  const [monthlyEmi, setMonthlyEmi] = useState(null);

  // --- AI Price Predictor State & Logic ---
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  const runPricePrediction = () => {
    setIsPredicting(true);
    setPredictionResult(null);
    setTimeout(() => {
      setIsPredicting(false);
      // Mock calculation based on property info
      const basePrice = property.pricing || 0;
      let trendMultiplier = 1.15; // default +15%
      if (property.city === 'Dhaka') trendMultiplier = 1.25;
      if (property.propertyType === 'COMMERCIAL') trendMultiplier = 1.30;
      
      const estimatedPrice = basePrice * trendMultiplier;
      const trendPercent = ((trendMultiplier - 1) * 100).toFixed(1);

      setPredictionResult({
        estimatedPrice: estimatedPrice,
        trend: `+${trendPercent}% Upward`,
        confidence: property.city === 'Dhaka' ? '96.5%' : '91.2%',
        reason: `Based on historical data for ${property.propertyType} properties in ${property.city}.`
      });
    }, 1200);
  };

  // --- Reviews State ---
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState('');

  // Sync active image when property changes or initially loads
  React.useEffect(() => {
    if (property?.images?.[0]) {
      setActiveImage(property.images[0]);
    }
    if (property?.pricing) {
      setDownPayment(property.pricing * 0.2);
    }
  }, [property]);

  // --- Map State & Logic ---
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!property || !property.locationLat || !property.locationLong) return;
    if (window.L) { setMapReady(true); return; }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => setMapReady(true);
    document.head.appendChild(script);

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [property]);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !property || !property.locationLat || !property.locationLong) return;
    if (leafletMap.current) return;

    const L = window.L;
    leafletMap.current = L.map(mapRef.current, {
      center: [property.locationLat, property.locationLong],
      zoom: 15,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(leafletMap.current);

    const icon = L.divIcon({
      className: '',
      iconSize: [34, 44],
      iconAnchor: [17, 44],
      html: `
        <div style="width:34px;height:44px;position:relative;filter:drop-shadow(0 3px 6px rgba(0,0,0,.55));">
          <svg viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 0C7.6 0 0 7.6 0 17c0 12.75 17 27 17 27S34 29.75 34 17C34 7.6 26.4 0 17 0z" fill="#cca353" stroke="rgba(255,255,255,0.6)" stroke-width="1.5"/>
            <circle cx="17" cy="17" r="7" fill="rgba(0,0,0,0.25)"/>
          </svg>
        </div>`,
    });

    L.marker([property.locationLat, property.locationLong], { icon }).addTo(leafletMap.current);
  }, [mapReady, property]);

  if (!property) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Property not found</h2>
        <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ marginTop: '20px' }}>
          Back to Explore
        </button>
      </div>
    );
  }

  // Handle Booking Submission
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to schedule a property visit.');
      navigate('/login');
      return;
    }
    if (!visitDate || !visitTimeSlot) {
      alert('Please select both a date and a time slot.');
      return;
    }

    const newBooking = {
      id: bookings.length + 1,
      propertyId: property.id,
      buyerId: user.id,
      visitDate,
      visitTimeSlot,
      status: 'PENDING',
      remarks: bookingRemarks
    };

    setBookings([...bookings, newBooking]);
    setBookingSuccess(true);
  };

  // Compute EMI
  const calculateEmi = () => {
    const loanAmount = property.pricing - parseFloat(downPayment);
    if (loanAmount <= 0) {
      setMonthlyEmi(0);
      return;
    }
    const monthlyRate = (parseFloat(interestRate) / 12) / 100;
    const numberOfPayments = parseFloat(loanTerm) * 12;

    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    setMonthlyEmi(emi);
  };

  // Handle Review Image Upload simulation
  const handleProofChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
    }
  };

  // Submit Review
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to submit a review.');
      navigate('/login');
      return;
    }
    if (!proofFile) {
      alert('Security Policy: You must upload proof of visit (image or PDF receipt) to rate a property.');
      return;
    }

    const newReview = {
      id: reviews.length + 1,
      propertyId: property.id,
      reviewer: user.fullName,
      rating,
      comment,
      proof: proofFile.name,
      moderationStatus: 'PENDING'
    };

    setReviews([...reviews, newReview]);
    
    // Notify Owner
    if (property.ownerId) {
      triggerNotification(
        property.ownerId,
        'New Property Review Submitted',
        `A review by ${user.fullName} was submitted for your property: "${property.title}". It is pending Admin moderation.`
      );
    }
    
    // Notify Admin (mock user ID 1)
    triggerNotification(
      1,
      'Review Verification Needed',
      `New review submitted by ${user.fullName} for Property ID ${property.id}. Scan attached: ${proofFile.name}.`
    );

    setComment('');
    setProofFile(null);
    setProofPreview('');
    alert('Your review has been submitted and is pending moderation verification.');
  };

  // Format currency
  const formatBDT = (value) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '100px' }}>
      
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back
      </button>

      {/* Main Grid: Images & Details */}
      <div className="property-details-layout" style={{ alignItems: 'start' }}>
        
        {/* Left Side: Media Gallery, Desc, Map, Reviews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Gallery Component */}
          <div className="glass" style={{ padding: '16px', borderRadius: '24px' }}>
            <div style={{ height: '420px', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
              <img src={activeImage} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {property.images.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  style={{
                    width: '90px',
                    height: '70px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: activeImage === img ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    opacity: activeImage === img ? 1 : 0.6,
                    transition: 'all 0.2s'
                  }}
                >
                  <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Description & Amenities */}
          <div className="glass" style={{ padding: '32px' }}>
            <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>
              {property.propertyType} • {property.status}
            </span>
            <h1 style={{ fontSize: '2.2rem', marginTop: '8px', marginBottom: '16px' }}>{property.title}</h1>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '32px' }}>{property.description}</p>
            
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Amenities Included
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
              {property.amenities.map((am, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>✓</span> {am}
                </div>
              ))}
            </div>
          </div>

          {/* Real Google/Leaflet Maps GPS Integration */}
          <div className="glass" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Map size={18} style={{ color: 'var(--primary)' }} /> GPS & Map Location
            </h3>
            
            <div style={{
              height: '300px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              position: 'relative',
              overflow: 'hidden',
              background: '#111827'
            }}>
              {property?.locationLat && property?.locationLong ? (
                <>
                  {!mapReady && (
                    <div style={{
                      position: 'absolute', inset: 0, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      zIndex: 1, color: 'var(--text-muted)'
                    }}>
                      Loading map…
                    </div>
                  )}
                  <div ref={mapRef} style={{ width: '100%', height: '100%', zIndex: 0 }}></div>
                </>
              ) : (
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  zIndex: 1, color: 'var(--text-muted)', flexDirection: 'column'
                }}>
                  <MapPin size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                  <p>Location data not available for this property.</p>
                </div>
              )}
              
              <style>{`
                .leaflet-container { background: #111827 !important; }
                .leaflet-control-attribution { font-size: 10px !important; }
              `}</style>
            </div>
            
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <MapPin size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                <strong style={{ color: 'var(--text-main)' }}>{property?.city}</strong><br />
                {property?.address}
              </p>
            </div>
          </div>

          {/* Ratings & Reviews */}
          <div className="glass" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Reviews & Visit Ratings</h3>
            
            {/* Reviews list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
              {reviews.filter(r => r.propertyId === property.id && r.moderationStatus === 'APPROVED').length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No verified reviews for this property yet.</p>
              ) : (
                reviews.filter(r => r.propertyId === property.id && r.moderationStatus === 'APPROVED').map((rev) => (
                  <div key={rev.id} style={{
                    padding: '16px',
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{rev.reviewer}</span>
                      <span style={{ color: 'var(--primary)' }}>{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{rev.comment}</p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dark)', marginTop: '8px', display: 'block' }}>
                      📎 Verified visit proof: {rev.proof}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Submit review */}
            <form onSubmit={handleReviewSubmit} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '16px' }}>Submit a Verified Review</h4>
              
              <div className="input-group">
                <label className="input-label">Rating</label>
                <select className="input-field" value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
                  <option value={5}>5 Stars (Excellent)</option>
                  <option value={4}>4 Stars (Good)</option>
                  <option value={3}>3 Stars (Average)</option>
                  <option value={2}>2 Stars (Poor)</option>
                  <option value={1}>1 Star (Terrible)</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Comments</label>
                <textarea 
                  className="input-field" 
                  rows={4} 
                  placeholder="Share your experience during the property visit..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <div className="input-group" style={{ marginBottom: '24px' }}>
                <label className="input-label">Upload Visit Proof (Required)</label>
                <input 
                  type="file" 
                  accept="image/*,application/pdf"
                  onChange={handleProofChange}
                  style={{ display: 'none' }}
                  id="proof-upload"
                />
                <label htmlFor="proof-upload" className="btn btn-secondary" style={{ width: '100%', cursor: 'pointer' }}>
                  Choose Receipt / Booking Confirmation Image
                </label>
                {proofPreview && (
                  <div style={{ marginTop: '12px', height: '80px', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={proofPreview} style={{ height: '100%', objectFit: 'contain' }} />
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Send size={16} /> Submit Review for Verification
              </button>
            </form>
          </div>

        </div>

        {/* Right Side: Price, Scheduler, EMI Calculator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', position: 'sticky', top: '100px' }}>
          
          {/* Price display Card */}
          <div className="glass" style={{ padding: '32px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Asking Price</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px', marginBottom: '8px' }}>
              {formatBDT(property.pricing)}
              {property.propertyType === 'RENTAL' && <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/mo</span>}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '20px' }}>
              Tax & Registration fees not included in listed price.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => {
                  setPaymentModalType('BOOKING_ADVANCE');
                  setIsPaymentOpen(true);
                }}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 20px rgba(204, 163, 83, 0.35)'
                }}
              >
                <CreditCard size={18} />
                <span>Pay Booking Advance (অগ্রিম বুকিং)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentModalType(property.propertyType === 'RENTAL' ? 'MONTHLY_RENT' : 'FULL_PAYMENT');
                  setIsPaymentOpen(true);
                }}
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'rgba(255,255,255,0.06)'
                }}
              >
                <Wallet size={16} style={{ color: 'var(--primary)' }} />
                <span>{property.propertyType === 'RENTAL' ? 'Pay Rent Online' : 'Pay Full / Down Payment'}</span>
              </button>
            </div>

            <Link
              to="/chat"
              className="btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 600,
                textDecoration: 'none',
                border: '1px solid var(--border-color)',
                transition: 'all 0.2s'
              }}
            >
              <MessageSquare size={16} style={{ color: 'var(--primary)' }} />
              Chat with Owner
            </Link>
          </div>

          {/* Visit Booking Flow Card */}
          <div className="glass" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Schedule Property Visit</h3>
            
            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }} className="animate-fade-in">
                <CheckCircle size={48} style={{ color: 'var(--secondary)', marginBottom: '16px' }} />
                <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Booking Request Sent</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  Request submitted to Alhaz Properties Ltd. Track status updates inside your Buyer Dashboard.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                <div className="input-group">
                  <label className="input-label">Select Date</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Select Time Slot</label>
                  <select 
                    className="input-field"
                    value={visitTimeSlot}
                    onChange={(e) => setVisitTimeSlot(e.target.value)}
                  >
                    <option value="">Choose slot</option>
                    <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                    <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                    <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                    <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Remarks / Special Instructions</label>
                  <textarea 
                    className="input-field"
                    rows={3}
                    placeholder="Any specific feature you want to inspect?"
                    value={bookingRemarks}
                    onChange={(e) => setBookingRemarks(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '45px' }}>
                  <Calendar size={16} /> Confirm Booking Request
                </button>
              </form>
            )}
          </div>

          {/* Mortgage & EMI Calculator */}
          <div className="glass" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={18} style={{ color: 'var(--primary)' }} /> Mortgage & EMI Calculator
            </h3>

            <div className="input-group">
              <label className="input-label">Down Payment (BDT)</label>
              <input 
                type="number" 
                className="input-field" 
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Interest Rate (%)</label>
              <input 
                type="number" 
                step="0.1" 
                className="input-field" 
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
            </div>

            <div className="input-group" style={{ marginBottom: '24px' }}>
              <label className="input-label">Loan Term (Years)</label>
              <input 
                type="number" 
                className="input-field" 
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
              />
            </div>

            <button type="button" onClick={calculateEmi} className="btn btn-secondary" style={{ width: '100%', marginBottom: '16px' }}>
              Calculate Monthly EMI
            </button>

            {monthlyEmi !== null && (
              <div className="animate-fade-in" style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Monthly Payment</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '4px' }}>
                  {formatBDT(monthlyEmi)}/mo
                </div>
              </div>
            )}
          </div>

          {/* AI Price Predictor */}
          <div className="glass" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} style={{ color: 'var(--primary)' }} /> AI Price Predictor
            </h3>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.5' }}>
              Get an AI-powered forecast of this property's future valuation based on historical data, local infrastructure projects, and market demand in {property.city}.
            </p>

            <button 
              type="button" 
              onClick={runPricePrediction} 
              className="btn btn-primary" 
              style={{ width: '100%', marginBottom: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              disabled={isPredicting}
            >
              {isPredicting ? (
                <>Analyzing Market Data...</>
              ) : (
                <><Bot size={18} /> Generate AI Forecast</>
              )}
            </button>

            {predictionResult && (
              <div className="animate-fade-in" style={{
                background: 'rgba(204, 163, 83, 0.05)',
                border: '1px solid var(--primary)',
                borderRadius: '12px',
                padding: '20px',
                marginTop: '16px'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ gridColumn: 'span 2', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estimated Future Price (5 Yrs)</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '4px' }}>
                      {formatBDT(predictionResult.estimatedPrice)}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Price Trend</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4ade80' }}>{predictionResult.trend}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>AI Confidence</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>{predictionResult.confidence}</div>
                  </div>
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  lineHeight: '1.6',
                  color: 'var(--text-main)',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <strong style={{ color: 'var(--primary)' }}>AI Insights:</strong> {predictionResult.reason}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        property={property}
        user={user}
        paymentType={paymentModalType}
        onPaymentSuccess={(newPayment) => {
          if (onAddPayment) onAddPayment(newPayment);
        }}
        triggerNotification={triggerNotification}
      />

    </div>
  );
}
