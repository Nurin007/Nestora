import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calculator, TrendingUp, DollarSign, Percent,
  Calendar, Info, ChevronDown, ChevronUp, BarChart2
} from 'lucide-react';

export default function MortgageCalculator() {
  const navigate = useNavigate();

  // Inputs
  const [propertyPrice, setPropertyPrice] = useState(5000000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(9.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [showAmortization, setShowAmortization] = useState(false);
  const [showScheduleRows, setShowScheduleRows] = useState(12);

  // Derived Values
  const downPaymentAmount = (propertyPrice * downPaymentPct) / 100;
  const loanAmount = propertyPrice - downPaymentAmount;
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanTenure * 12;

  // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const emi = monthlyRate > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : loanAmount / totalMonths;

  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - loanAmount;

  // Format currency in BDT
  const formatBDT = (value) =>
    new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(value);

  // Amortization schedule
  const amortizationSchedule = [];
  let balance = loanAmount;
  for (let month = 1; month <= totalMonths; month++) {
    const interestForMonth = balance * monthlyRate;
    const principalForMonth = emi - interestForMonth;
    balance -= principalForMonth;
    if (balance < 0) balance = 0;
    amortizationSchedule.push({
      month,
      year: Math.ceil(month / 12),
      emi,
      principal: principalForMonth,
      interest: interestForMonth,
      balance
    });
  }

  // Yearly grouped summary
  const yearlySummary = [];
  for (let y = 1; y <= loanTenure; y++) {
    const monthsInYear = amortizationSchedule.filter(r => r.year === y);
    yearlySummary.push({
      year: y,
      totalEmi: monthsInYear.reduce((s, r) => s + r.emi, 0),
      totalPrincipal: monthsInYear.reduce((s, r) => s + r.principal, 0),
      totalInterest: monthsInYear.reduce((s, r) => s + r.interest, 0),
      balance: monthsInYear[monthsInYear.length - 1]?.balance || 0
    });
  }

  // Donut chart values
  const principalPct = ((loanAmount / totalPayment) * 100).toFixed(1);
  const interestPct = ((totalInterest / totalPayment) * 100).toFixed(1);

  // SVG donut
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const principalStroke = (loanAmount / totalPayment) * circumference;
  const interestStroke = (totalInterest / totalPayment) * circumference;

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 0 100px 0' }}>

      {/* Back */}
      <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <div style={{
          width: '64px', height: '64px',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, var(--primary), #f59e0b)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px auto',
          boxShadow: '0 8px 24px rgba(204, 163, 83, 0.3)'
        }}>
          <Calculator size={30} color="#0b0f19" />
        </div>
        <h1 style={{ fontSize: '2.6rem', marginBottom: '12px', background: 'linear-gradient(to right, #fff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Mortgage & EMI Calculator
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto' }}>
          Plan your property investment in Bangladesh. Estimate monthly repayments, total interest, and amortisation schedule.
        </p>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '32px', alignItems: 'start' }}>

        {/* Input Panel */}
        <div className="glass" style={{ borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
            <DollarSign size={18} /> Loan Parameters
          </h3>

          {/* Property Price */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <label style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>Property Price</label>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem' }}>{formatBDT(propertyPrice)}</span>
            </div>
            <input
              type="range"
              min="500000"
              max="100000000"
              step="100000"
              value={propertyPrice}
              onChange={e => setPropertyPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)', height: '6px', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.72rem', color: 'var(--text-dark)' }}>
              <span>৳5L</span><span>৳10Cr</span>
            </div>
            <input
              type="number"
              value={propertyPrice}
              onChange={e => setPropertyPrice(Math.max(500000, Number(e.target.value)))}
              className="input-field"
              style={{ marginTop: '12px', height: '42px', fontSize: '0.9rem' }}
              placeholder="Enter amount manually"
            />
          </div>

          {/* Down Payment */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <label style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>Down Payment</label>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem' }}>{downPaymentPct}% ({formatBDT(downPaymentAmount)})</span>
            </div>
            <input
              type="range"
              min="5"
              max="80"
              step="1"
              value={downPaymentPct}
              onChange={e => setDownPaymentPct(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)', height: '6px', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.72rem', color: 'var(--text-dark)' }}>
              <span>5%</span><span>80%</span>
            </div>
          </div>

          {/* Loan Amount display */}
          <div style={{
            padding: '14px 18px',
            borderRadius: '12px',
            background: 'rgba(204, 163, 83, 0.08)',
            border: '1px solid rgba(204, 163, 83, 0.2)',
            marginBottom: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Loan Principal</span>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)' }}>{formatBDT(loanAmount)}</span>
          </div>

          {/* Interest Rate */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <label style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                <Percent size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Annual Interest Rate
              </label>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem' }}>{interestRate}%</span>
            </div>
            <input
              type="range"
              min="4"
              max="20"
              step="0.25"
              value={interestRate}
              onChange={e => setInterestRate(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)', height: '6px', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.72rem', color: 'var(--text-dark)' }}>
              <span>4%</span><span>20%</span>
            </div>
          </div>

          {/* Loan Tenure */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <label style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Loan Tenure
              </label>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem' }}>{loanTenure} years ({totalMonths} months)</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={loanTenure}
              onChange={e => setLoanTenure(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)', height: '6px', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.72rem', color: 'var(--text-dark)' }}>
              <span>1 yr</span><span>30 yrs</span>
            </div>
          </div>

          {/* BD Bank rates info */}
          <div style={{
            marginTop: '28px',
            padding: '14px 18px',
            borderRadius: '12px',
            background: 'rgba(96, 165, 250, 0.06)',
            border: '1px solid rgba(96, 165, 250, 0.15)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            lineHeight: '1.6'
          }}>
            <Info size={13} style={{ display: 'inline', marginRight: '6px', color: '#60a5fa' }} />
            <strong style={{ color: '#60a5fa' }}>Bangladesh Bank Rates (2026):</strong> HBFC home loans: 9–11% p.a. · DBBL: 10.5% · Islami Bank: 9.5% · BRAC Bank: 11%. Rates vary by loan type and creditworthiness.
          </div>
        </div>

        {/* Results Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* EMI Card */}
          <div style={{
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(204, 163, 83, 0.15) 0%, rgba(204, 163, 83, 0.05) 100%)',
            border: '1px solid rgba(204, 163, 83, 0.3)',
            padding: '32px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle at 70% 30%, rgba(204, 163, 83, 0.08), transparent 60%)',
              pointerEvents: 'none'
            }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Monthly EMI</p>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', lineHeight: '1', marginBottom: '8px' }}>
              {formatBDT(emi)}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>per month for {loanTenure} years</p>
          </div>

          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { label: 'Loan Principal', value: formatBDT(loanAmount), color: '#60a5fa', sub: `${(100 - downPaymentPct).toFixed(0)}% of property price` },
              { label: 'Down Payment', value: formatBDT(downPaymentAmount), color: '#4ade80', sub: `${downPaymentPct}% upfront` },
              { label: 'Total Interest', value: formatBDT(totalInterest), color: '#f97316', sub: `${interestPct}% of total payment` },
              { label: 'Total Payment', value: formatBDT(totalPayment), color: 'var(--primary)', sub: `Principal + Interest` },
            ].map((item, i) => (
              <div key={i} className="glass" style={{ borderRadius: '16px', padding: '20px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, color: item.color, marginBottom: '4px' }}>{item.value}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-dark)' }}>{item.sub}</p>
              </div>
            ))}
          </div>

          {/* Donut Chart */}
          <div className="glass" style={{ borderRadius: '24px', padding: '28px' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart2 size={16} style={{ color: 'var(--primary)' }} /> Payment Breakdown
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', justifyContent: 'center' }}>
              <svg width="180" height="180" viewBox="0 0 180 180">
                <circle cx="90" cy="90" r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="24" />
                {/* Principal segment */}
                <circle
                  cx="90" cy="90" r={radius}
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="24"
                  strokeDasharray={`${principalStroke} ${circumference}`}
                  strokeDashoffset={circumference * 0.25}
                  style={{ transition: 'stroke-dasharray 0.5s ease' }}
                />
                {/* Interest segment */}
                <circle
                  cx="90" cy="90" r={radius}
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="24"
                  strokeDasharray={`${interestStroke} ${circumference}`}
                  strokeDashoffset={circumference * 0.25 - principalStroke}
                  style={{ transition: 'stroke-dasharray 0.5s ease' }}
                />
                <text x="90" y="84" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="Inter, sans-serif">Total</text>
                <text x="90" y="100" textAnchor="middle" fill="var(--primary)" fontSize="10" fontFamily="Inter, sans-serif">
                  {formatBDT(totalPayment).replace('BDT', '৳')}
                </text>
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#60a5fa', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Principal</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{principalPct}% · {formatBDT(loanAmount)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#f97316', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Interest</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{interestPct}% · {formatBDT(totalInterest)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Yearly Amortization Table */}
      <div className="glass" style={{ borderRadius: '24px', marginTop: '32px', overflow: 'hidden' }}>
        <button
          onClick={() => setShowAmortization(!showAmortization)}
          style={{
            width: '100%',
            padding: '20px 28px',
            background: 'none',
            border: 'none',
            color: 'var(--text-main)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '1rem',
            fontWeight: 700
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
            Year-by-Year Amortization Schedule
          </span>
          {showAmortization ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {showAmortization && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
              <thead>
                <tr style={{ background: 'rgba(204, 163, 83, 0.08)', borderBottom: '1px solid var(--border-color)' }}>
                  {['Year', 'Annual EMI', 'Principal Paid', 'Interest Paid', 'Outstanding Balance'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {h === 'Year' ? <span style={{ textAlign: 'left', display: 'block' }}>{h}</span> : h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {yearlySummary.map((row, i) => (
                  <tr
                    key={row.year}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.03)',
                      background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(204, 163, 83, 0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
                  >
                    <td style={{ padding: '13px 20px', fontWeight: 700 }}>Year {row.year}</td>
                    <td style={{ padding: '13px 20px', textAlign: 'right', color: 'var(--primary)' }}>{formatBDT(row.totalEmi)}</td>
                    <td style={{ padding: '13px 20px', textAlign: 'right', color: '#60a5fa' }}>{formatBDT(row.totalPrincipal)}</td>
                    <td style={{ padding: '13px 20px', textAlign: 'right', color: '#f97316' }}>{formatBDT(row.totalInterest)}</td>
                    <td style={{ padding: '13px 20px', textAlign: 'right', color: row.balance < 1 ? '#4ade80' : 'var(--text-main)' }}>
                      {row.balance < 1 ? '✓ Fully Paid' : formatBDT(row.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Monthly Amortization Table */}
      {showAmortization && (
        <div className="glass" style={{ borderRadius: '24px', marginTop: '20px', overflow: 'hidden' }}>
          <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-color)' }}>
            <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
              <Calendar size={16} style={{ color: 'var(--primary)' }} /> Monthly Breakdown
            </h4>
          </div>
          <div style={{ overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <tr style={{ background: 'rgba(22, 28, 45, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
                  {['Month', 'EMI', 'Principal', 'Interest', 'Balance'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--text-muted)' }}>
                      {h === 'Month' ? <span style={{ textAlign: 'left', display: 'block' }}>{h}</span> : h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {amortizationSchedule.slice(0, showScheduleRows).map((row, i) => (
                  <tr
                    key={row.month}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
                  >
                    <td style={{ padding: '10px 16px', fontWeight: 600 }}>Month {row.month}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--primary)' }}>{formatBDT(row.emi)}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', color: '#60a5fa' }}>{formatBDT(row.principal)}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', color: '#f97316' }}>{formatBDT(row.interest)}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'right' }}>{formatBDT(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showScheduleRows < totalMonths && (
            <div style={{ padding: '16px', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
              <button
                onClick={() => setShowScheduleRows(prev => Math.min(prev + 24, totalMonths))}
                className="btn btn-secondary"
                style={{ fontSize: '0.82rem' }}
              >
                Show more months ({totalMonths - showScheduleRows} remaining)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
