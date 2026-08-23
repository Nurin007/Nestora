import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Nav
    brandName: 'NESTORA',
    explore: 'Explore',
    listings: 'Listings',
    mapView: 'Map View',
    valuation: 'Valuation',
    calculator: 'Calculator',
    compare: 'Compare',
    chat: 'Chat',
    wishlist: 'Wishlist',
    notifications: 'Notifications',
    dashboard: 'Dashboard',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    adminConsole: 'Admin Console',
    ownerConsole: 'Owner Portal',
    buyerConsole: 'Buyer Dashboard',

    // Home
    heroTitlePrefix: 'Smart Real Estate.',
    heroTitleSuffix: 'Transparent Inspections.',
    heroSub: 'Connect with verified property owners, view locations, inspect properties securely, and book slots in Bangladesh.',
    searchPlaceholder: 'Search Gulshan, Bashundhara, Dhanmondi...',
    allCities: 'All Cities',
    allTypes: 'All Types',
    maxPrice: 'Max Price (BDT)',
    searchBtn: 'Search',
    aiRecommended: 'AI Recommended for You',
    aiRecommendedSub: 'Properties personalized to your search trends and market behavior',
    viewDetails: 'View Details',
    bookVisit: 'Book Visit',
    compareBtn: 'Compare',
    addedToCompare: 'Comparing',
    featuredListings: 'Verified Property Listings',
    featuredSub: 'Browse authentic homes, apartments, and land plots approved by Nestora team.',
    residential: 'Residential',
    commercial: 'Commercial',
    rental: 'Rental',
    land: 'Land',

    // Property Details
    askingPrice: 'Total Asking Price',
    taxNote: 'Tax & Registration fees not included in listed price.',
    payAdvance: 'Pay Booking Advance',
    payFull: 'Pay Full / Down Payment',
    payRent: 'Pay Monthly Rent',
    chatWithOwner: 'Chat with Owner',
    scheduleVisit: 'Schedule Property Visit',
    selectDate: 'Select Date',
    selectSlot: 'Select Time Slot',
    remarks: 'Remarks / Special Instructions',
    confirmBooking: 'Confirm Booking Request',
    bookingSuccess: 'Booking Request Sent',
    bookingSuccessSub: 'Request submitted to property owner. Track status updates inside your Buyer Dashboard.',
    emiCalculator: 'Mortgage & EMI Calculator',
    downPayment: 'Down Payment (BDT)',
    interestRate: 'Interest Rate (%)',
    loanTerm: 'Loan Term (Years)',
    calcEmiBtn: 'Calculate Monthly EMI',
    estimatedMonthlyPayment: 'Estimated Monthly Payment',
    aiPricePredictor: 'AI Price Predictor',
    generateForecast: 'Generate AI Forecast',
    analyzingMarket: 'Analyzing Market Data...',
    reviewsTitle: 'Reviews & Visit Ratings',
    noReviews: 'No verified reviews for this property yet.',
    submitReviewTitle: 'Submit a Verified Review',
    ratingLabel: 'Rating',
    commentsLabel: 'Comments',
    uploadProof: 'Upload Visit Proof / Booking Receipt',
    submitReviewBtn: 'Submit Review for Verification',
    amenities: 'Amenities Included',
    gpsLocation: 'GPS & Map Location',

    // KYC & Verification
    kycTitle: 'Identity Verification (KYC)',
    kycSubtitle: 'Verify your national identity or trade license to unlock verified badges and priority bookings.',
    selectDocType: 'Document Type',
    nid: 'National ID (NID)',
    passport: 'Passport',
    tradeLicense: 'Trade License',
    docNumber: 'Document Number',
    uploadDocFile: 'Upload Document / Photo',
    submitKycBtn: 'Submit Document for Verification',
    kycStatusVerified: 'Verified Account',
    kycStatusPending: 'Verification Under Review',
    kycStatusUnverified: 'Not Verified',

    // Currency / Units
    bdt: 'BDT',
    sqft: 'sq ft',
    perMonth: '/mo',
    years: 'Years',
    months: 'Months'
  },
  bn: {
    // Nav
    brandName: 'নেস্টোরা',
    explore: 'এক্সপ্লোর',
    listings: 'সকল প্রোপার্টি',
    mapView: 'ম্যাপ ভিউ',
    valuation: 'মূল্যায়ন এআই',
    calculator: 'ইএমআই ক্যালকুলেটর',
    compare: 'তুলনা করুন',
    chat: 'মেসেজ/চ্যাট',
    wishlist: 'পছন্দের তালিকা',
    notifications: 'বিজ্ঞপ্তি',
    dashboard: 'ড্যাশবোর্ড',
    login: 'লগইন',
    register: 'রেজিস্টার',
    logout: 'লগআউট',
    adminConsole: 'এডমিন কনসোল',
    ownerConsole: 'ওনার পোর্টাল',
    buyerConsole: 'বায়ার ড্যাশবোর্ড',

    // Home
    heroTitlePrefix: 'স্মার্ট রিয়েল এস্টেট।',
    heroTitleSuffix: 'স্বচ্ছ প্রোপার্টি পরিদর্শন।',
    heroSub: 'যাচাইকৃত প্রোপার্টি মালিকদের সাথে যুক্ত হোন, অবস্থান দেখুন, নিরাপদভাবে পরিদর্শন করুন এবং বুকিং দিন।',
    searchPlaceholder: 'গুলশান, বসুন্ধরা, ধানমন্ডি বা এলাকা খুঁজুন...',
    allCities: 'সকল শহর',
    allTypes: 'সকল ধরন',
    maxPrice: 'সর্বোচ্চ বাজেট (টাকা)',
    searchBtn: 'খুঁজুন',
    aiRecommended: 'আপনার জন্য এআই প্রস্তাবিত',
    aiRecommendedSub: 'আপনার অনুসন্ধান ও চাহিদার ভিত্তিতে সেরা প্রোপার্টিসমূহ',
    viewDetails: 'বিস্তারিত দেখুন',
    bookVisit: 'পরিদর্শন বুকিং',
    compareBtn: 'তুলনা করুন',
    addedToCompare: 'তুলনা তালিকায় আছে',
    featuredListings: 'যাচাইকৃত প্রোপার্টি তালিকা',
    featuredSub: 'নেস্টোরা টিম দ্বারা অনুমোদিত আসল ফ্ল্যাট, বাড়ি ও প্লটসমূহ দেখুন।',
    residential: 'আবাসিক',
    commercial: 'বাণিজ্যিক',
    rental: 'ভাড়া',
    land: 'জমি/প্লট',

    // Property Details
    askingPrice: 'মোট প্রোপার্টির মূল্য',
    taxNote: 'ট্যাক্স এবং রেজিস্ট্রেশন ফি এই মূল্যের অন্তর্ভুক্ত নয়।',
    payAdvance: 'অগ্রিম বুকিং পেমেন্ট দিন',
    payFull: 'সম্পূর্ণ / ডাউন পেমেন্ট দিন',
    payRent: 'অনলাইনে মাসিক ভাড়া দিন',
    chatWithOwner: 'মালিকের সাথে কথা বলুন',
    scheduleVisit: 'পরিদর্শন সময়সূচী নির্ধারণ',
    selectDate: 'তারিখ নির্বাচন করুন',
    selectSlot: 'সময়সূচী নির্বাচন করুন',
    remarks: 'বিশেষ নির্দেশনা / মন্তব্য',
    confirmBooking: 'বুকিং রিকোয়েস্ট নিশ্চিত করুন',
    bookingSuccess: 'বুকিং রিকোয়েস্ট সফলভাবে পাঠানো হয়েছে',
    bookingSuccessSub: 'মালিকের কাছে রিকোয়েস্ট জমা হয়েছে। আপনার বায়ার ড্যাশবোর্ড থেকে আপডেট চেক করুন।',
    emiCalculator: 'মর্টগেজ ও ইএমআই ক্যালকুলেটর',
    downPayment: 'ডাউন পেমেন্ট (টাকা)',
    interestRate: 'সুদের হার (%)',
    loanTerm: 'লোনের মেয়াদ (বছর)',
    calcEmiBtn: 'মাসিক ইএমআই হিসাব করুন',
    estimatedMonthlyPayment: 'আনুমানিক মাসিক কিস্তি',
    aiPricePredictor: 'এআই প্রোপার্টি মূল্য পূর্বাভাস',
    generateForecast: 'এআই পূর্বাভাস দেখুন',
    analyzingMarket: 'বাজারের তথ্য বিশ্লেষণ করা হচ্ছে...',
    reviewsTitle: 'ভিজিট রিভিউ ও রেটিং',
    noReviews: 'এই প্রোপার্টির জন্য এখনো কোনো রিভিউ জমা দেওয়া হয়নি।',
    submitReviewTitle: 'যাচাইকৃত রিভিউ জমা দিন',
    ratingLabel: 'রেটিং',
    commentsLabel: 'আপনার অভিজ্ঞতা ও মন্তব্য',
    uploadProof: 'পরিদর্শন প্রমাণ / রসিদ আপলোড করুন',
    submitReviewBtn: 'পর্যালোচনার জন্য রিভিউ জমা দিন',
    amenities: 'উপলব্ধ সুযোগ-সুবিধাসমূহ',
    gpsLocation: 'জিপিএস ও ম্যাপ অবস্থান',

    // KYC & Verification
    kycTitle: 'জাতীয় পরিচয়পত্র ও কেওয়াইসি (KYC)',
    kycSubtitle: 'যাচাইকৃত ব্যাজ পেতে এবং অগ্রাধিকার বুকিংয়ের জন্য আপনার এনআইডি বা ট্রেড লাইসেন্স আপলোড করুন।',
    selectDocType: 'ডকুমেন্টের ধরন',
    nid: 'জাতীয় পরিচয়পত্র (NID)',
    passport: 'পাসপোর্ট (Passport)',
    tradeLicense: 'ট্রেড লাইসেন্স (Trade License)',
    docNumber: 'ডকুমেন্ট নম্বর',
    uploadDocFile: 'ডকুমেন্টের ছবি / ফাইল আপলোড',
    submitKycBtn: 'যাচাইয়ের জন্য জমা দিন',
    kycStatusVerified: 'যাচাইকৃত একাউন্ট (Verified)',
    kycStatusPending: 'পর্যালোচনাধীন (Pending)',
    kycStatusUnverified: 'যাচাই করা হয়নি (Unverified)',

    // Currency / Units
    bdt: 'টাকা',
    sqft: 'বর্গফুট',
    perMonth: '/মাস',
    years: 'বছর',
    months: 'মাস'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('nestora_lang') || 'en';
  });

  const toggleLanguage = () => {
    const next = language === 'en' ? 'bn' : 'en';
    setLanguage(next);
    localStorage.setItem('nestora_lang', next);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
