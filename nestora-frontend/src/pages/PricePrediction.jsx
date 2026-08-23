import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  BrainCircuit, MapPin, BedDouble, Bath, Maximize2, Building2,
  TrendingUp, TrendingDown, Minus, RefreshCw, ChevronRight,
  Sparkles, BarChart3, Info
} from 'lucide-react';

import { BD_DISTRICTS } from '../constants/districts';

/* ─── Price model weights (calibrated to Bangladeshi market) ───────────
   Base price per sq ft by city (BDT)                                   */
const CITY_BASE = BD_DISTRICTS.reduce((acc, curr) => {
  acc[curr.en] = curr.basePriceSqFt;
  return acc;
}, {
  Dhaka: 35000,
  Chittagong: 18000,
  Sylhet: 14000,
  "Cox's Bazar": 22000,
  Narayanganj: 13000,
  Gazipur: 10000,
  Cumilla: 9500,
  Khulna: 8500,
  Rajshahi: 8000,
  Mymensingh: 8000,
  Bogura: 7800,
  Barisal: 7500,
  Jashore: 7200,
  Rangpur: 7000,
  "Sreemangal (Moulvibazar)": 12500
});

const TYPE_MULT = {
  RESIDENTIAL: 1.00,
  COMMERCIAL:  1.65,
  RENTAL:      0.75,   // per-sq-ft lower; price = monthly rent
  LAND:        0.55,
};

const CONDITION_MULT = {
  NEW:        1.20,
  EXCELLENT:  1.10,
  GOOD:       1.00,
  FAIR:       0.85,
  RENOVATION: 0.70,
};

const FLOOR_BONUS   = 0.008;   // +0.8% per floor above ground
const BED_BONUS_SQF = 200;     // extra BDT/sqft per bedroom above 1
const CITY_OPTIONS  = Object.keys(CITY_BASE);
const PROPERTY_TYPES = [
  { value: 'RESIDENTIAL', label: 'Residential' },
  { value: 'COMMERCIAL',  label: 'Commercial'  },
  { value: 'RENTAL',      label: 'Rental'      },
  { value: 'LAND',        label: 'Land'        },
];
const CONDITIONS = [
  { value: 'NEW',        label: 'Brand New'  },
  { value: 'EXCELLENT',  label: 'Excellent'  },
  { value: 'GOOD',       label: 'Good'       },
  { value: 'FAIR',       label: 'Fair'       },
  { value: 'RENOVATION', label: 'Needs Renovation' },
];

const formatBDT = (v) =>
  new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(v);

function estimatePrice({ city, propertyType, area, bedrooms, bathrooms, floor, condition }) {
  const base      = (CITY_BASE[city]   || 12000);
  const typeMult  = TYPE_MULT[propertyType] || 1;
  const condMult  = CONDITION_MULT[condition] || 1;
  const floorBonus = 1 + FLOOR_BONUS * Math.max(0, (floor || 1) - 1);
  const bedBonus   = ((bedrooms || 1) - 1) * BED_BONUS_SQF;
  const bathBonus  = ((bathrooms || 1) - 1) * 500;

  const pricePerSqFt = (base + bedBonus + bathBonus) * typeMult * condMult * floorBonus;
  const core = pricePerSqFt * (area || 1000);

  // Simulated market noise ±8%
  const noise = 1 + (Math.random() * 0.16 - 0.08);
  const mid   = Math.round(core * noise / 50000) * 50000;
  const low   = Math.round(mid * 0.88 / 50000) * 50000;
  const high  = Math.round(mid * 1.12 / 50000) * 50000;

  // Confidence: higher area + known city → higher confidence
  const confidence = Math.min(92, Math.max(62, 70 + (area > 500 ? 8 : 0) + (CITY_BASE[city] ? 8 : 0) + (bedrooms > 0 ? 4 : 0)));

  // Market trend mock
  const trend = propertyType === 'COMMERCIAL' ? 'up' : propertyType === 'LAND' ? 'up' : city === 'Dhaka' ? 'up' : 'stable';

  return { low, mid, high, confidence, trend, pricePerSqFt: Math.round(pricePerSqFt) };
}

/* ─── Similar properties ── uses parent's properties prop ──── */
function findSimilar(properties, { city, propertyType, area }) {
  return properties
    .filter(p =>
      p.verificationStatus === 'APPROVED' &&
      p.city === city &&
      p.propertyType === propertyType
    )
    .sort((a, b) => Math.abs(a.areaSize - area) - Math.abs(b.areaSize - area))
    .slice(0, 3);
}

/* ══════════════════════════════════════════════════════════════
   Main Component
══════════════════════════════════════════════════════════════ */
export default function PricePrediction({ properties = [] }) {
  const [form, setForm] = useState({
    city: 'Dhaka', propertyType: 'RESIDENTIAL', area: '',
    bedrooms: '', bathrooms: '', floor: '1', condition: 'GOOD',
  });
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [similar, setSimilar]   = useState([]);
  const resultRef               = useRef(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handlePredict = (e) => {
    e.preventDefault();
    if (!form.area || parseFloat(form.area) <= 0) {
      alert('Please enter a valid area size.');
      return;
    }

    setLoading(true);
    setResult(null);

    // Simulate async AI call
    setTimeout(() => {
      const est = estimatePrice({
        city:         form.city,
        propertyType: form.propertyType,
        area:         parseFloat(form.area),
        bedrooms:     parseInt(form.bedrooms) || 0,
        bathrooms:    parseInt(form.bathrooms) || 0,
        floor:        parseInt(form.floor) || 1,
        condition:    form.condition,
      });
      setResult(est);
      setSimilar(findSimilar(properties, { city: form.city, propertyType: form.propertyType, area: parseFloat(form.area) }));
      setLoading(false);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }, 1400);
  };

  const handleReset = () => { setResult(null); setSimilar([]); };

  /* ── Shared input style ── */
  const inp = {
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    color: 'var(--text-main)',
    padding: '12px 16px',
    fontSize: '0.9rem',
    width: '100%',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  };
  const lbl = {
    fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '8px', display: 'block',
  };

  const TrendIcon = result?.trend === 'up' ? TrendingUp : result?.trend === 'down' ? TrendingDown : Minus;
  const trendColor = result?.trend === 'up' ? 'var(--secondary)' : result?.trend === 'down' ? 'var(--danger)' : 'var(--text-muted)';
  const trendLabel = result?.trend === 'up' ? 'Rising market' : result?.trend === 'down' ? 'Declining market' : 'Stable market';

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '100px', marginTop: '48px' }}>

      {/* ── Header ── */}
      <div style={{ textAlign: 'center', marginBottom: '52px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          background: 'rgba(204,163,83,0.1)', border: '1px solid rgba(204,163,83,0.25)',
          borderRadius: '30px', padding: '6px 18px', marginBottom: '20px',
          fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700,
        }}>
          <Sparkles size={14} /> AI-Powered Estimation
        </div>
        <h1 style={{ fontSize: '2.8rem', letterSpacing: '-1px', marginBottom: '14px' }}>
          Property Price Predictor
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto', lineHeight: '1.65' }}>
          Enter property details to get an instant AI-driven market valuation based on location,
          type, size, and condition — calibrated to the Bangladeshi real estate market.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px', alignItems: 'flex-start' }}>

        {/* ── Input Form ── */}
        <div className="glass" style={{ padding: '36px', borderRadius: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BrainCircuit size={20} style={{ color: 'var(--primary)' }} /> Property Details
          </h2>

          <form onSubmit={handlePredict} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* City + Type */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={lbl}><MapPin size={11} style={{ verticalAlign: 'middle', marginRight: '4px' }} />City</label>
                <select id="predict-city" value={form.city} onChange={e => set('city', e.target.value)} style={inp}>
                  {CITY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}><Building2 size={11} style={{ verticalAlign: 'middle', marginRight: '4px' }} />Property Type</label>
                <select id="predict-type" value={form.propertyType} onChange={e => set('propertyType', e.target.value)} style={inp}>
                  {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>

            {/* Area */}
            <div>
              <label style={lbl}><Maximize2 size={11} style={{ verticalAlign: 'middle', marginRight: '4px' }} />Area Size (sq ft) *</label>
              <input
                id="predict-area"
                type="number" min="100" max="100000"
                placeholder="e.g. 1200"
                value={form.area}
                onChange={e => set('area', e.target.value)}
                required
                style={inp}
              />
            </div>

            {/* Beds + Baths */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={lbl}><BedDouble size={11} style={{ verticalAlign: 'middle', marginRight: '4px' }} />Bedrooms</label>
                <select id="predict-beds" value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)} style={inp}>
                  <option value="">0 / N/A</option>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}><Bath size={11} style={{ verticalAlign: 'middle', marginRight: '4px' }} />Bathrooms</label>
                <select id="predict-baths" value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)} style={inp}>
                  <option value="">0 / N/A</option>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            {/* Floor + Condition */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={lbl}>Floor / Level</label>
                <select id="predict-floor" value={form.floor} onChange={e => set('floor', e.target.value)} style={inp}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n}>{n === 1 ? 'Ground / 1st' : `${n}${n===2?'nd':n===3?'rd':'th'} Floor`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={lbl}>Condition</label>
                <select id="predict-condition" value={form.condition} onChange={e => set('condition', e.target.value)} style={inp}>
                  {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                marginTop: '8px', opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? <><RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> Analysing…</>
                : <><BrainCircuit size={18} /> Predict Price</>
              }
            </button>
          </form>

          {/* Disclaimer */}
          <div style={{
            marginTop: '20px', padding: '12px 16px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)',
            display: 'flex', gap: '10px', alignItems: 'flex-start',
          }}>
            <Info size={14} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '1px' }} />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
              Estimates are indicative only, based on market averages. Actual values may vary.
              Always consult a registered property valuator before making financial decisions.
            </p>
          </div>
        </div>

        {/* ── Result Panel ── */}
        <div ref={resultRef}>
          {!result && !loading && (
            <div className="glass" style={{
              borderRadius: '24px', padding: '60px 40px',
              textAlign: 'center', border: '1px dashed var(--border-color)',
            }}>
              <BarChart3 size={48} style={{ opacity: 0.15, marginBottom: '20px', display: 'block', margin: '0 auto 20px' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Fill in the property details and click <strong style={{ color: 'var(--text-main)' }}>Predict Price</strong> to get an AI-powered market valuation.
              </p>
            </div>
          )}

          {loading && (
            <div className="glass" style={{
              borderRadius: '24px', padding: '80px 40px',
              textAlign: 'center', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '20px',
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                border: '4px solid rgba(204,163,83,0.15)',
                borderTopColor: 'var(--primary)',
                animation: 'spin 1s linear infinite',
              }} />
              <div>
                <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>Analysing Market Data…</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Comparing listings, location indices and property attributes
                </p>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* ── Estimated Price Card ── */}
              <div className="glass" style={{ borderRadius: '24px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
                {/* Glow accent */}
                <div style={{
                  position: 'absolute', top: '-40px', right: '-40px',
                  width: '180px', height: '180px', borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(204,163,83,0.12), transparent 70%)',
                  pointerEvents: 'none',
                }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Sparkles size={16} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    AI Estimate
                  </span>
                </div>

                <div style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-1px', marginBottom: '4px' }}>
                  {formatBDT(result.mid)}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '20px' }}>
                  Range: {formatBDT(result.low)} – {formatBDT(result.high)}
                </p>

                {/* Price range bar */}
                <div style={{ position: 'relative', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', marginBottom: '8px' }}>
                  <div style={{
                    position: 'absolute', left: '10%', right: '10%',
                    height: '100%', borderRadius: '4px',
                    background: 'linear-gradient(to right, rgba(204,163,83,0.4), var(--primary), rgba(204,163,83,0.4))',
                  }} />
                  {/* mid marker */}
                  <div style={{
                    position: 'absolute', left: '50%', top: '-4px',
                    transform: 'translateX(-50%)',
                    width: '16px', height: '16px', borderRadius: '50%',
                    background: 'var(--primary)', border: '3px solid var(--bg-dark)',
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                  <span>Low estimate</span><span>High estimate</span>
                </div>

                {/* Meta row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  {[
                    { label: 'Price / sq ft', value: formatBDT(result.pricePerSqFt) },
                    {
                      label: 'Market Trend',
                      value: (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: trendColor }}>
                          <TrendIcon size={14} /> {trendLabel}
                        </span>
                      ),
                    },
                    { label: 'Confidence', value: `${result.confidence}%` },
                  ].map(item => (
                    <div key={item.label} style={{
                      padding: '14px', borderRadius: '12px',
                      background: 'rgba(255,255,255,0.025)',
                      border: '1px solid var(--border-color)',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Confidence bar */}
                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <span>Model Confidence</span><span style={{ color: 'var(--primary)', fontWeight: 700 }}>{result.confidence}%</span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)' }}>
                    <div style={{
                      height: '100%', borderRadius: '3px', width: `${result.confidence}%`,
                      background: `linear-gradient(to right, var(--secondary), var(--primary))`,
                      transition: 'width 1s ease',
                    }} />
                  </div>
                </div>

                <button onClick={handleReset} className="btn btn-secondary" style={{
                  marginTop: '24px', width: '100%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: '6px',
                  fontSize: '0.85rem', padding: '10px',
                }}>
                  <RefreshCw size={14} /> New Prediction
                </button>
              </div>

              {/* ── Similar Listings ── */}
              {similar.length > 0 && (
                <div className="glass" style={{ borderRadius: '20px', padding: '24px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BarChart3 size={16} style={{ color: 'var(--primary)' }} /> Similar Listings in {form.city}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {similar.map(p => (
                      <Link
                        key={p.id}
                        to={`/property/${p.id}`}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '14px',
                          padding: '12px', borderRadius: '12px',
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid var(--border-color)',
                          textDecoration: 'none', color: 'var(--text-main)',
                          transition: 'background 0.2s',
                        }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(204,163,83,0.06)'}
                        onMouseOut={e  => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      >
                        <img src={p.images[0]} alt={p.title}
                          style={{ width: '60px', height: '48px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{p.areaSize} sq ft · {p.city}</div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>{formatBDT(p.pricing)}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {formatBDT(Math.round(p.pricing / p.areaSize))}/sqft
                          </div>
                        </div>
                        <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
