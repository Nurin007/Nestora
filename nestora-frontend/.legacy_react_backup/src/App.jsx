import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AIChatbot from './components/AIChatbot';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PropertyDetails from './pages/PropertyDetails';
import BuyerDashboard from './pages/BuyerDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Compare from './pages/Compare';
import Chat from './pages/Chat';
import Wishlist from './pages/Wishlist';
import MortgageCalculator from './pages/MortgageCalculator';
import Listings from './pages/Listings';
import MapView from './pages/MapView';
import PricePrediction from './pages/PricePrediction';

// Mock DB populated with properties representing all types (Residential, Commercial, Rental, Land) in Bangladesh
const INITIAL_PROPERTIES = [
  {
    id: 1,
    title: 'Luxury Gold-Accent Penthouse',
    description: 'Stunning premium penthouse overlooking the Gulshan Lake. Complete with smart-home systems, automated lighting, double-height ceilings, marble flooring, and customized gold finishes. A truly state-of-the-art living experience with top-tier security.',
    propertyType: 'RESIDENTIAL',
    status: 'AVAILABLE',
    verificationStatus: 'APPROVED',
    pricing: 35000000,
    areaSize: 3200,
    numberOfBedrooms: 4,
    numberOfBathrooms: 5,
    address: 'Road 45, Gulshan 2',
    city: 'Dhaka',
    locationLat: 23.7925,
    locationLong: 90.4156,
    ownerId: 2,
    amenities: ['Lake View', '24/7 Security', 'Smart Home', 'Private Lift', 'Backup Generator', 'Infinity Pool'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 2,
    title: 'High-Yield Commercial Plaza',
    description: 'Corporate office space in the heart of Motijheel C/A. Ideal for banking corporate headquarters or tech startups. Offers high visibility, central AC, multi-car parking bays, and high-speed fiber connection.',
    propertyType: 'COMMERCIAL',
    status: 'AVAILABLE',
    verificationStatus: 'APPROVED',
    pricing: 120000000,
    areaSize: 8500,
    numberOfBedrooms: 0,
    numberOfBathrooms: 6,
    address: 'Motijheel Commercial Area',
    city: 'Dhaka',
    locationLat: 23.7329,
    locationLong: 90.4196,
    ownerId: 3,
    amenities: ['Central Aircon', 'Fibre Internet', '10-Car Parking', 'Fire Sprinklers', 'Conference Room'],
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 3,
    title: 'Premium Agricultural Farmland',
    description: 'Fertile agricultural land perfect for commercial farming or setting up a modern organic resort. Has access to the main regional highway and is fully gated with deep tubewells installed.',
    propertyType: 'LAND',
    status: 'AVAILABLE',
    verificationStatus: 'APPROVED',
    pricing: 18000000,
    areaSize: 45000,
    numberOfBedrooms: 0,
    numberOfBathrooms: 0,
    address: 'Mawna, Sreepur',
    city: 'Gazipur',
    locationLat: 24.1950,
    locationLong: 90.4330,
    ownerId: 2,
    amenities: ['Highway Access', 'Gated Boundary', 'Deep Tubewell', 'Electricity Connection'],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 4,
    title: 'Modern Duplex in Bashundhara',
    description: 'Charming modern duplex rental listing located inside Bashundhara R/A Block I. Highly secure family-friendly sector, fitted with Italian tiles, jacuzzi, rooftop patio garden, and servant quarters.',
    propertyType: 'RENTAL',
    status: 'AVAILABLE',
    verificationStatus: 'APPROVED',
    pricing: 85000,
    areaSize: 2600,
    numberOfBedrooms: 3,
    numberOfBathrooms: 4,
    address: 'Block I, Bashundhara R/A',
    city: 'Dhaka',
    locationLat: 23.8188,
    locationLong: 90.4312,
    ownerId: 3,
    amenities: ['Rooftop Garden', 'Jacuzzi', 'Servant Quarter', '24/7 Guards', 'Intercom System'],
    images: [
      'https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 5,
    title: 'Lakeview Residential Plot',
    description: 'Prime residential plot in Sector 11, Uttara. High growth zone facing lake view road. Ready for immediate construction of up to 10-story building (RAJUK approved).',
    propertyType: 'LAND',
    status: 'AVAILABLE',
    verificationStatus: 'PENDING', // Pending Admin review
    pricing: 28000000,
    areaSize: 3600,
    numberOfBedrooms: 0,
    numberOfBathrooms: 0,
    address: 'Sector 11, Uttara',
    city: 'Dhaka',
    locationLat: 23.8759,
    locationLong: 90.3795,
    ownerId: 2,
    amenities: ['Lake Facing', 'RAJUK Approved', 'Water Line', 'Gas Connection'],
    images: [
      'https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

export default function App() {
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('nestora_properties');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nestora_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('nestora_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [compareList, setCompareList] = useState(() => {
    const saved = localStorage.getItem('nestora_compare');
    return saved ? JSON.parse(saved) : [];
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('nestora_bookings');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        propertyId: 1,
        buyerId: 4,
        visitDate: '2026-07-25',
        visitTimeSlot: '10:00 - 12:00',
        status: 'PENDING',
        remarks: 'Would love to inspect the lake view balcony and generator capacity.'
      }
    ];
  });

  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('nestora_complaints');
    return saved ? JSON.parse(saved) : [];
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('nestora_audit_logs');
    return saved ? JSON.parse(saved) : [
      { id: 1, adminId: 1, action: 'PLATFORM_START', targetType: 'SYSTEM', targetId: 0, remarks: 'System initialization', createdAt: new Date().toISOString() }
    ];
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('nestora_reviews');
    return saved ? JSON.parse(saved) : [
      { id: 1, propertyId: 1, reviewer: 'Karim Ahmed', rating: 5, comment: 'Spacious layout and amazing views. Recommended!', proof: 'visit_receipt_1.jpg', moderationStatus: 'APPROVED' }
    ];
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('nestora_notifications');
    return saved ? JSON.parse(saved) : [
      { id: 1, userId: 4, title: 'Welcome to Nestora', content: 'Thank you for registering on our platform!', isRead: false, createdAt: new Date().toISOString() },
      { id: 2, userId: 2, title: 'Welcome to Nestora', content: 'Explore listings or register properties!', isRead: false, createdAt: new Date().toISOString() }
    ];
  });

  const [savedSearches, setSavedSearches] = useState(() => {
    const saved = localStorage.getItem('nestora_saved_searches');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('nestora_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('nestora_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('nestora_compare', JSON.stringify(compareList));
  }, [compareList]);

  useEffect(() => {
    localStorage.setItem('nestora_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('nestora_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('nestora_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('nestora_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('nestora_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('nestora_saved_searches', JSON.stringify(savedSearches));
  }, [savedSearches]);

  const triggerNotification = (userId, title, content) => {
    const newNotif = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      userId,
      title,
      content,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('nestora_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nestora_user');
  };

  const handleToggleWishlist = (propertyId) => {
    if (wishlist.includes(propertyId)) {
      setWishlist(wishlist.filter(id => id !== propertyId));
    } else {
      setWishlist([...wishlist, propertyId]);
    }
  };

  const handleToggleCompare = (property) => {
    if (compareList.some(p => p.id === property.id)) {
      setCompareList(compareList.filter(p => p.id !== property.id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare a maximum of 3 properties at once.');
        return;
      }
      setCompareList([...compareList, property]);
    }
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} notifications={notifications} setNotifications={setNotifications} wishlist={wishlist} />
      <Routes>
        <Route path="/" element={
          <Home 
            properties={properties} 
            wishlist={wishlist} 
            onToggleWishlist={handleToggleWishlist}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
          />
        } />
        
        <Route path="/login" element={
          user ? <Navigate to="/" /> : <Home properties={properties} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} /> && <Login onLogin={handleLogin} />
        } />
        
        <Route path="/register" element={
          user ? <Navigate to="/" /> : <Register onLogin={handleLogin} />
        } />
        
        <Route path="/property/:id" element={
          <PropertyDetails 
            user={user}
            properties={properties} 
            bookings={bookings}
            setBookings={setBookings}
            reviews={reviews}
            setReviews={setReviews}
            triggerNotification={triggerNotification}
          />
        } />

        <Route path="/wishlist" element={
          user ? (
            <Wishlist
              user={user}
              properties={properties}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              compareList={compareList}
              onToggleCompare={handleToggleCompare}
            />
          ) : <Navigate to="/login" />
        } />

        <Route path="/compare" element={
          <Compare 
            compareList={compareList} 
            onRemove={handleToggleCompare} 
          />
        } />

        <Route path="/calculator" element={<MortgageCalculator />} />

        <Route path="/listings" element={
          <Listings
            properties={properties}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
          />
        } />

        <Route path="/map" element={
          <MapView properties={properties} />
        } />

        <Route path="/predict" element={
          <PricePrediction properties={properties} />
        } />

        <Route path="/chat" element={
          user ? <Chat user={user} /> : <Navigate to="/login" />
        } />

        <Route path="/buyer" element={
          user?.role === 'BUYER' ? (
            <BuyerDashboard 
              user={user} 
              setUser={setUser}
              properties={properties}
              wishlist={wishlist} 
              onToggleWishlist={handleToggleWishlist}
              bookings={bookings}
              setBookings={setBookings}
              triggerNotification={triggerNotification}
              savedSearches={savedSearches}
              setSavedSearches={setSavedSearches}
              complaints={complaints}
              setComplaints={setComplaints}
            />
          ) : <Navigate to="/" />
        } />

        <Route path="/owner" element={
          user?.role === 'PROPERTY_OWNER' || user?.role === 'AGENT' ? (
            <OwnerDashboard 
              user={user}
              setUser={setUser}
              properties={properties}
              setProperties={setProperties}
              bookings={bookings}
              setBookings={setBookings}
              triggerNotification={triggerNotification}
            />
          ) : <Navigate to="/" />
        } />

        <Route path="/admin" element={
          user?.role === 'ADMIN' ? (
            <AdminDashboard 
              user={user}
              properties={properties}
              setProperties={setProperties}
              bookings={bookings}
              complaints={complaints}
              setComplaints={setComplaints}
              auditLogs={auditLogs}
              setAuditLogs={setAuditLogs}
              reviews={reviews}
              setReviews={setReviews}
              triggerNotification={triggerNotification}
            />
          ) : <Navigate to="/" />
        } />
      </Routes>
      <AIChatbot />
    </Router>
  );
}
