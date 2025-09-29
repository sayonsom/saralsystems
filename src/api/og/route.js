// src/app/api/og/route.jsx
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Fonts (optional - you can load custom fonts)
const fontRegular = fetch(
  new URL('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap', import.meta.url)
).then((res) => res.arrayBuffer());

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract parameters
    const country = searchParams.get('country') || 'Global';
    const production = searchParams.get('production') || 'N/A';
    const renewable = searchParams.get('renewable') || 'N/A';
    const carbon = searchParams.get('carbon') || 'N/A';
    const trend = searchParams.get('trend') || 'stable';
    const rank = searchParams.get('rank') || 'N/A';
    const flag = searchParams.get('flag') || '🌍';
    
    // Format country name
    const countryName = country.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    // Determine color scheme based on carbon intensity
    const carbonValue = parseFloat(carbon);
    const colorScheme = {
      primary: carbonValue < 150 ? '#10b981' : carbonValue < 350 ? '#eab308' : '#ef4444',
      gradient: carbonValue < 150 
        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
        : carbonValue < 350 
        ? 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)'
        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      bg: carbonValue < 150 ? '#064e3b' : carbonValue < 350 ? '#713f12' : '#7f1d1d'
    };
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            backgroundImage: `linear-gradient(135deg, #0f172a 0%, ${colorScheme.bg} 100%)`,
            position: 'relative',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              backgroundImage: `
                radial-gradient(circle at 20% 50%, ${colorScheme.primary} 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, #3b82f6 0%, transparent 50%),
                radial-gradient(circle at 40% 20%, #8b5cf6 0%, transparent 50%)
              `,
            }}
          />
          
          {/* Grid Pattern Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.05,
              backgroundImage: `
                linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.1) 75%, rgba(255, 255, 255, 0.1) 76%, transparent 77%),
                linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.1) 75%, rgba(255, 255, 255, 0.1) 76%, transparent 77%)
              `,
              backgroundSize: '50px 50px',
            }}
          />
          
          {/* Content Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '60px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Top Badge */}
            <div
              style={{
                position: 'absolute',
                top: -200,
                right: 60,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 24,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontSize: 14,
                color: '#e2e8f0',
              }}
            >
              🏆 Rank #{rank} Globally
            </div>
            
            {/* Country Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontSize: 72,
                  filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5))',
                }}
              >
                {flag}
              </div>
              <h1
                style={{
                  fontSize: 84,
                  fontWeight: 900,
                  color: 'white',
                  margin: 0,
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                  letterSpacing: '-2px',
                }}
              >
                {countryName}
              </h1>
            </div>
            
            {/* Subtitle */}
            <p
              style={{
                fontSize: 32,
                color: '#94a3b8',
                marginTop: 0,
                marginBottom: 60,
                textAlign: 'center',
                opacity: 0.9,
              }}
            >
              Electricity Production & Energy Data {new Date().getFullYear()}
            </p>
            
            {/* Stats Cards Container */}
            <div
              style={{
                display: 'flex',
                gap: 32,
                marginBottom: 40,
              }}
            >
              {/* Production Card */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '36px 52px',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.05) 100%)',
                  borderRadius: 24,
                  border: '2px solid rgba(59, 130, 246, 0.3)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <span style={{ fontSize: 28 }}>⚡</span>
                  <span style={{ fontSize: 18, color: '#93c5fd', fontWeight: 600 }}>Production</span>
                </div>
                <div
                  style={{
                    fontSize: 72,
                    fontWeight: 'bold',
                    color: '#60a5fa',
                    marginBottom: 8,
                    textShadow: '0 2px 8px rgba(96, 165, 250, 0.5)',
                  }}
                >
                  {production}
                </div>
                <div style={{ fontSize: 24, color: '#dbeafe', fontWeight: '600' }}>
                  TWh/year
                </div>
              </div>
              
              {/* Renewable Card */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '36px 52px',
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.05) 100%)',
                  borderRadius: 24,
                  border: '2px solid rgba(34, 197, 94, 0.3)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <span style={{ fontSize: 28 }}>🌱</span>
                  <span style={{ fontSize: 18, color: '#86efac', fontWeight: 600 }}>Renewable</span>
                </div>
                <div
                  style={{
                    fontSize: 72,
                    fontWeight: 'bold',
                    color: '#4ade80',
                    marginBottom: 8,
                    textShadow: '0 2px 8px rgba(74, 222, 128, 0.5)',
                  }}
                >
                  {renewable}%
                </div>
                <div style={{ fontSize: 24, color: '#dcfce7', fontWeight: '600' }}>
                  Clean Energy
                </div>
              </div>
              
              {/* Carbon Card */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '36px 52px',
                  background: `linear-gradient(135deg, ${colorScheme.primary}33 0%, ${colorScheme.primary}0D 100%)`,
                  borderRadius: 24,
                  border: `2px solid ${colorScheme.primary}4D`,
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <span style={{ fontSize: 28 }}>🏭</span>
                  <span style={{ fontSize: 18, color: '#fbbf24', fontWeight: 600 }}>Carbon</span>
                </div>
                <div
                  style={{
                    fontSize: 72,
                    fontWeight: 'bold',
                    color: colorScheme.primary,
                    marginBottom: 8,
                    textShadow: `0 2px 8px ${colorScheme.primary}80`,
                  }}
                >
                  {carbon}
                </div>
                <div style={{ fontSize: 24, color: '#fef3c7', fontWeight: '600' }}>
                  gCO₂/kWh
                </div>
              </div>
            </div>
            
            {/* Trend Indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 16,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: 40,
              }}
            >
              <span style={{ fontSize: 20 }}>
                {trend === 'increasing' ? '📈' : trend === 'decreasing' ? '📉' : '➡️'}
              </span>
              <span style={{ fontSize: 18, color: '#cbd5e1' }}>
                Emissions Trend: {trend.charAt(0).toUpperCase() + trend.slice(1)}
              </span>
            </div>
            
            {/* Footer */}
            <div
              style={{
                position: 'absolute',
                bottom: 40,
                display: 'flex',
                alignItems: 'center',
                gap: 15,
              }}
            >
              <div style={{ fontSize: 26, color: '#64748b' }}>
                Real-time data from
              </div>
              <div style={{ fontSize: 30, fontWeight: 'bold', color: 'white' }}>
                EnergyMonitor.com
              </div>
            </div>
            
            {/* Timestamp */}
            <div
              style={{
                position: 'absolute',
                top: 40,
                left: 60,
                fontSize: 14,
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              🕐 Updated: {new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (e) {
    console.error(`Failed to generate OG image: ${e.message}`);
    
    // Return a fallback image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          }}
        >
          <div style={{ fontSize: 60, fontWeight: 'bold', color: 'white', marginBottom: 20 }}>
            Energy Monitor
          </div>
          <div style={{ fontSize: 24, color: '#64748b' }}>
            Global Electricity Production Data
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}

// OPTIONS method for CORS if needed
export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}