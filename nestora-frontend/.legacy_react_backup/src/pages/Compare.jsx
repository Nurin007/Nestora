import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GitCompare, Trash2, Eye } from 'lucide-react';

export default function Compare({ compareList, onRemove }) {
  const navigate = useNavigate();

  const formatBDT = (value) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0
    }).format(value);
  };

  if (compareList.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px auto'
        }}>
          <GitCompare size={32} style={{ color: 'var(--text-dark)' }} />
        </div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Compare List is Empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          Explore properties and add them to compare specifications side-by-side.
        </p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Explore Properties
        </button>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '80px', marginTop: '40px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Property Comparison</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Side-by-side technical specification comparison (Max 3 properties).</p>

      <div className="glass" style={{ padding: '32px', overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left'
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px', color: 'var(--text-muted)', width: '200px' }}>Specification</th>
              {compareList.map(p => (
                <th key={p.id} style={{ padding: '16px', minWidth: '250px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <img src={p.images[0]} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{p.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{p.address}, {p.city}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                      <button onClick={() => navigate(`/property/${p.id}`)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', flexGrow: 1 }}>
                        <Eye size={12} /> View Details
                      </button>
                      <button onClick={() => onRemove(p)} className="btn-danger" style={{ padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>Asking Price</td>
              {compareList.map(p => (
                <td key={p.id} style={{ padding: '16px', fontSize: '1.1rem', fontWeight: 750, color: 'var(--primary)' }}>
                  {formatBDT(p.pricing)}
                </td>
              ))}
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>Property Type</td>
              {compareList.map(p => (
                <td key={p.id} style={{ padding: '16px', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 700 }}>
                  {p.propertyType}
                </td>
              ))}
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>Area Size</td>
              {compareList.map(p => (
                <td key={p.id} style={{ padding: '16px', fontSize: '0.9rem' }}>
                  {p.areaSize} sq ft
                </td>
              ))}
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>Bedrooms</td>
              {compareList.map(p => (
                <td key={p.id} style={{ padding: '16px', fontSize: '0.9rem' }}>
                  {p.numberOfBedrooms || 'N/A'}
                </td>
              ))}
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>Bathrooms</td>
              {compareList.map(p => (
                <td key={p.id} style={{ padding: '16px', fontSize: '0.9rem' }}>
                  {p.numberOfBathrooms || 'N/A'}
                </td>
              ))}
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>Key Amenities</td>
              {compareList.map(p => (
                <td key={p.id} style={{ padding: '16px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {p.amenities.map((am, i) => (
                      <span key={i} style={{
                        padding: '2px 8px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.75rem'
                      }}>{am}</span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
