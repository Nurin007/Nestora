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
    verificationStatus: 'PENDING',
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
  },
  {
    id: 6,
    title: 'Green Valley Tea Estate Luxury Villa',
    description: 'Breathtaking luxury vacation bungalow nestled amidst the rolling lush tea gardens of Sreemangal and Sylhet. Features wooden aesthetics, private panoramic veranda, solar & generator backup, and high-speed Wi-Fi.',
    propertyType: 'RESIDENTIAL',
    status: 'AVAILABLE',
    verificationStatus: 'APPROVED',
    pricing: 24500000,
    areaSize: 4200,
    numberOfBedrooms: 5,
    numberOfBathrooms: 5,
    address: 'Radhanagar, Tea Estate Road',
    city: 'Sylhet',
    locationLat: 24.8949,
    locationLong: 91.8687,
    ownerId: 2,
    amenities: ['Tea Garden View', 'Solar & Generator', 'Private Lawn', 'Barbeque Zone', 'Servant Quarters', 'Infinity Jacuzzi'],
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 7,
    title: 'Surma Riverview Duplex Residence',
    description: 'Ultra-modern 4-bedroom duplex apartment directly overlooking the scenic Surma River in Sylhet Zindabazar. Includes Italian fittings, central smart home automation, and 2 designated covered parking slots.',
    propertyType: 'RESIDENTIAL',
    status: 'AVAILABLE',
    verificationStatus: 'APPROVED',
    pricing: 18500000,
    areaSize: 3100,
    numberOfBedrooms: 4,
    numberOfBathrooms: 4,
    address: 'VIP Road, Zindabazar',
    city: 'Sylhet',
    locationLat: 24.8978,
    locationLong: 91.8714,
    ownerId: 3,
    amenities: ['Riverfront View', 'Smart Automation', 'Double-Height Ceiling', '24/7 Security', 'Rooftop Lounge'],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 8,
    title: 'Sylhet Shahjalal Commercial Plaza',
    description: 'Prime commercial office space situated along Shahjalal Upashahar Main Avenue. Highly suitable for UK/USA consultancy firms, multinational IT centers, or foreign exchange banks.',
    propertyType: 'COMMERCIAL',
    status: 'AVAILABLE',
    verificationStatus: 'APPROVED',
    pricing: 62000000,
    areaSize: 6400,
    numberOfBedrooms: 0,
    numberOfBathrooms: 6,
    address: 'Block D, Shahjalal Upashahar',
    city: 'Sylhet',
    locationLat: 24.8860,
    locationLong: 91.8820,
    ownerId: 2,
    amenities: ['Dedicated High-Speed Lift', 'Central VRF AC', 'Underground 8-Car Parking', 'Fire Sprinklers'],
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 9,
    title: 'Luxury Vacation Villa in Sreemangal',
    description: 'Charming eco-resort style private villa surrounded by lemon orchards and pineapples. Perfect for weekend getaways and passive rental income in Greater Sylhet region.',
    propertyType: 'RENTAL',
    status: 'AVAILABLE',
    verificationStatus: 'APPROVED',
    pricing: 120000,
    areaSize: 2900,
    numberOfBedrooms: 3,
    numberOfBathrooms: 3,
    address: 'Grand Sultan Bypass Road',
    city: 'Sylhet',
    locationLat: 24.3120,
    locationLong: 91.7340,
    ownerId: 3,
    amenities: ['Eco-Friendly Design', 'Campfire Area', 'Infinity Lawn', 'Maid Service'],
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 10,
    title: 'Bayview Sea-Facing Penthouse Apartment',
    description: 'Exclusive beachfront luxury residence overlooking the Marine Drive and Bay of Bengal in Cox\'s Bazar. Ideal for premium holiday home or high-yield vacation rental.',
    propertyType: 'RESIDENTIAL',
    status: 'AVAILABLE',
    verificationStatus: 'APPROVED',
    pricing: 31000000,
    areaSize: 2850,
    numberOfBedrooms: 3,
    numberOfBathrooms: 4,
    address: 'Kolatoli Marine Drive',
    city: "Cox's Bazar",
    locationLat: 21.4272,
    locationLong: 92.0058,
    ownerId: 3,
    amenities: ['Sea View Balcony', 'Infinity Pool', '24/7 Security', 'Beach Access', 'Underground Parking'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 11,
    title: 'Modern Minimalist Villa in Dhanmondi',
    description: 'Architect-designed private 3-story luxury residence located on serene Dhanmondi Road 8/A. Features indoor landscaped atrium, heated plunge pool, dedicated library, solar power system, and 3-car garage.',
    propertyType: 'RESIDENTIAL',
    status: 'AVAILABLE',
    verificationStatus: 'APPROVED',
    pricing: 42000000,
    areaSize: 4500,
    numberOfBedrooms: 5,
    numberOfBathrooms: 6,
    address: 'Road 8/A, Dhanmondi',
    city: 'Dhaka',
    locationLat: 23.7465,
    locationLong: 90.3760,
    ownerId: 2,
    amenities: ['Private Plunge Pool', 'Solar System', 'Indoor Atrium', '3-Car Garage', 'Smart Access Control', 'Servant Quarters'],
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 12,
    title: 'Chittagong Bay-View Corporate Tower Suite',
    description: 'Grade-A premium commercial office floor in Agrabad Commercial Area. High-speed panoramic elevators, sea view meeting rooms, 100% full power backup, and centralized VRF HVAC system.',
    propertyType: 'COMMERCIAL',
    status: 'AVAILABLE',
    verificationStatus: 'APPROVED',
    pricing: 78000000,
    areaSize: 7200,
    numberOfBedrooms: 0,
    numberOfBathrooms: 6,
    address: 'Agrabad Commercial Area',
    city: 'Chittagong',
    locationLat: 22.3242,
    locationLong: 91.8143,
    ownerId: 3,
    amenities: ['Port & Bay View', 'Central VRF AC', 'High-Speed Elevators', '24/7 Security & CCTV', 'Covered Parking 12 Cars'],
    images: [
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 13,
    title: 'Khulshi Hills Elite Panoramic Duplex',
    description: 'Exclusive hillside duplex situated in elite South Khulshi Residential Area, Chittagong. Features lush green natural surroundings, expansive glass curtain walls, private rooftop garden, and Italian marble interior.',
    propertyType: 'RESIDENTIAL',
    status: 'AVAILABLE',
    verificationStatus: 'APPROVED',
    pricing: 29500000,
    areaSize: 3600,
    numberOfBedrooms: 4,
    numberOfBathrooms: 5,
    address: 'South Khulshi R/A',
    city: 'Chittagong',
    locationLat: 22.3619,
    locationLong: 91.8021,
    ownerId: 2,
    amenities: ['Hill View', 'Rooftop Lawn Garden', 'Italian Marble Flooring', 'Double Height Living Room', 'Smart Security System'],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 14,
    title: 'Banani Lakefront Executive Furnished Rental',
    description: 'Fully furnished, turnkey luxury 3-bedroom apartment with direct Banani-Gulshan lake views. Tastefully curated with Scandinavian furniture, smart appliances, weekly housekeeping, and 24/7 dedicated reception desk.',
    propertyType: 'RENTAL',
    status: 'AVAILABLE',
    verificationStatus: 'APPROVED',
    pricing: 140000,
    areaSize: 2400,
    numberOfBedrooms: 3,
    numberOfBathrooms: 3,
    address: 'Road 11, Banani',
    city: 'Dhaka',
    locationLat: 23.7937,
    locationLong: 90.4043,
    ownerId: 3,
    amenities: ['Lake View', 'Turnkey Furnished', 'Gym & Sauna', 'Housekeeping Included', '24/7 Front Desk Concierge'],
    images: [
      'https://images.unsplash.com/photo-1502005229762-ee1b2da97c0f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 15,
    title: 'Suburban Gated Community Family Estate',
    description: 'Picturesque American-style suburban family neighborhood and townhouses inspired by top franchise master developments. Offers manicured front lawns, wide tree-lined paved avenues, community club, kids playground, and round-the-clock patrol.',
    propertyType: 'RESIDENTIAL',
    status: 'AVAILABLE',
    verificationStatus: 'APPROVED',
    pricing: 38500000,
    areaSize: 3800,
    numberOfBedrooms: 4,
    numberOfBathrooms: 4,
    address: 'Purbachal Sector 21',
    city: 'Dhaka',
    locationLat: 23.8340,
    locationLong: 90.5210,
    ownerId: 2,
    amenities: ['Front Lawn Garden', 'Tree-Lined Avenues', 'Gated Community Patrol', 'Clubhouse & Gym', 'Solar Street Lighting'],
    images: [
      'https://lexpress-franchise.com/wp-content/uploads/2026/02/dillon-kydd-2kecpb73aqy-unsplash-1168x779.jpg',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

const INITIAL_PAYMENTS = [
  {
    id: 101,
    transactionId: 'BKX8921345',
    propertyId: 1,
    propertyTitle: 'Luxury Gold-Accent Penthouse',
    propertyCity: 'Dhaka',
    propertyAddress: 'Road 45, Gulshan 2',
    propertyType: 'RESIDENTIAL',
    buyerId: 4,
    buyerName: 'Karim Ahmed',
    buyerEmail: 'buyer@nestora.com',
    buyerPhone: '+8801712345678',
    ownerId: 2,
    paymentType: 'BOOKING_ADVANCE',
    paymentMethod: 'BKASH',
    amount: 100000,
    currency: 'BDT',
    status: 'COMPLETED',
    note: 'Token booking money for Gulshan penthouse inspection priority',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    paymentMeta: {
      methodName: 'bKash',
      senderPhone: '01712345678'
    }
  },
  {
    id: 102,
    transactionId: 'NGD4918239',
    propertyId: 4,
    propertyTitle: 'Modern Duplex in Bashundhara',
    propertyCity: 'Dhaka',
    propertyAddress: 'Block I, Bashundhara R/A',
    propertyType: 'RENTAL',
    buyerId: 4,
    buyerName: 'Nurin Chowdhury',
    buyerEmail: 'nurin@example.com',
    buyerPhone: '+8801819283746',
    ownerId: 3,
    paymentType: 'MONTHLY_RENT',
    paymentMethod: 'NAGAD',
    amount: 85000,
    currency: 'BDT',
    status: 'COMPLETED',
    note: 'Monthly rental advance deposit for Bashundhara duplex',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    paymentMeta: {
      methodName: 'Nagad',
      senderPhone: '01819283746'
    }
  },
  {
    id: 103,
    transactionId: 'BNK7729104',
    propertyId: 2,
    propertyTitle: 'High-Yield Commercial Plaza',
    propertyCity: 'Dhaka',
    propertyAddress: 'Motijheel Commercial Area',
    propertyType: 'COMMERCIAL',
    buyerId: 5,
    buyerName: 'Apex Holdings Ltd',
    buyerEmail: 'corporate@apex.com.bd',
    buyerPhone: '+8801911928374',
    ownerId: 3,
    paymentType: 'BOOKING_ADVANCE',
    paymentMethod: 'BANK',
    amount: 500000,
    currency: 'BDT',
    status: 'PENDING',
    note: 'Commercial floor reservation security deposit via City Bank EFT',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    paymentMeta: {
      methodName: 'Direct Bank Transfer',
      bankName: 'The City Bank Ltd',
      bankBranch: 'Motijheel Corporate Branch',
      bankTxnRef: 'EFT-2026-92847'
    }
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

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('nestora_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
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
    localStorage.setItem('nestora_payments', JSON.stringify(payments));
  }, [payments]);

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

  const triggerNotification = (userId, title, content, meta = {}) => {
    const newNotif = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      userId,
      title,
      content,
      isRead: false,
      createdAt: new Date().toISOString(),
      meta
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleAddPayment = (newPayment) => {
    setPayments(prev => [newPayment, ...prev]);
    // Log to audit log
    setAuditLogs(prev => [
      {
        id: Date.now(),
        adminId: 1,
        action: 'PAYMENT_RECEIVED',
        targetType: 'PAYMENT',
        targetId: newPayment.id,
        remarks: `${newPayment.buyerName} paid ৳${newPayment.amount.toLocaleString()} via ${newPayment.paymentMethod} (Txn: ${newPayment.transactionId})`,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const handleLogin = (userData, isNewRegistration = false) => {
    setUser(userData);
    localStorage.setItem('nestora_user', JSON.stringify(userData));

    const loginTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    if (isNewRegistration) {
      // 1. Notify Admin (User ID: 1)
      triggerNotification(
        1,
        '🎉 New User Registration Alert',
        `New account registered: ${userData.fullName} as ${userData.role} (${userData.email}).`,
        { userName: userData.fullName, userEmail: userData.email, userRole: userData.role, eventType: 'REGISTER' }
      );
      // 2. Notify new user
      triggerNotification(
        userData.id,
        'Welcome to Nestora!',
        `Your account has been created successfully as a ${userData.role}. Explore properties or list yours!`,
        { userName: userData.fullName, userEmail: userData.email, userRole: userData.role, eventType: 'WELCOME' }
      );
      // 3. Audit log
      setAuditLogs(prev => [
        {
          id: Date.now(),
          adminId: 1,
          action: 'USER_REGISTER',
          targetType: 'USER',
          targetId: userData.id,
          remarks: `New user registration: ${userData.fullName} (${userData.role})`,
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);
    } else {
      // 1. Notify Admin (User ID: 1)
      triggerNotification(
        1,
        '🔔 User Login Alert',
        `User ${userData.fullName} (${userData.role}) just signed in to Nestora at ${loginTime}.`,
        { userName: userData.fullName, userEmail: userData.email, userRole: userData.role, eventType: 'LOGIN' }
      );
      // 2. Notify user for account security
      triggerNotification(
        userData.id,
        '🔐 Security Alert: Successful Login',
        `You signed in successfully to Nestora at ${loginTime}.`,
        { userName: userData.fullName, userEmail: userData.email, userRole: userData.role, eventType: 'SELF_LOGIN' }
      );
      // 3. Audit log
      setAuditLogs(prev => [
        {
          id: Date.now(),
          adminId: 1,
          action: 'USER_LOGIN',
          targetType: 'USER',
          targetId: userData.id,
          remarks: `Login session initiated by ${userData.fullName} (${userData.role})`,
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);
    }
  };

  const handleLogout = () => {
    if (user) {
      triggerNotification(
        1,
        '🚪 User Logout Notice',
        `User ${user.fullName} (${user.role}) logged out.`,
        { userName: user.fullName, userEmail: user.email, userRole: user.role, eventType: 'LOGOUT' }
      );
    }
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
          user ? (
            <Home 
              properties={properties} 
              wishlist={wishlist} 
              onToggleWishlist={handleToggleWishlist}
              compareList={compareList}
              onToggleCompare={handleToggleCompare}
            />
          ) : <Navigate to="/login" />
        } />
        
        <Route path="/login" element={
          user ? <Navigate to="/" /> : <Login onLogin={(data) => handleLogin(data, false)} />
        } />
        
        <Route path="/register" element={
          user ? <Navigate to="/" /> : <Login onLogin={(data) => handleLogin(data, true)} />
        } />
        
        <Route path="/property/:id" element={
          user ? (
            <PropertyDetails 
              user={user}
              properties={properties} 
              bookings={bookings}
              setBookings={setBookings}
              payments={payments}
              onAddPayment={handleAddPayment}
              reviews={reviews}
              setReviews={setReviews}
              triggerNotification={triggerNotification}
            />
          ) : <Navigate to="/login" />
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
          user ? (
            <Compare 
              compareList={compareList} 
              onRemove={handleToggleCompare} 
            />
          ) : <Navigate to="/login" />
        } />

        <Route path="/calculator" element={
          user ? <MortgageCalculator /> : <Navigate to="/login" />
        } />

        <Route path="/listings" element={
          user ? (
            <Listings
              properties={properties}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              compareList={compareList}
              onToggleCompare={handleToggleCompare}
            />
          ) : <Navigate to="/login" />
        } />

        <Route path="/map" element={
          user ? <MapView properties={properties} /> : <Navigate to="/login" />
        } />

        <Route path="/predict" element={
          user ? <PricePrediction properties={properties} /> : <Navigate to="/login" />
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
              payments={payments}
              onAddPayment={handleAddPayment}
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
              payments={payments}
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
              setBookings={setBookings}
              payments={payments}
              setPayments={setPayments}
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
      {user && <AIChatbot />}
    </Router>
  );
}
