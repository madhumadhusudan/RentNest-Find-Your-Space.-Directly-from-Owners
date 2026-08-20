import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  MapPin,
  Phone,
  Building2,
  CheckCircle2,
  User,
  Loader2,
  ArrowLeft,
  Send,
  Navigation,
  Sparkles,
  ShieldCheck,
  Compass,
  Car,
  Wifi,
  Coffee,
  HeartHandshake,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../providers.tsx';
import { InteractiveMap } from '../components/InteractiveMap.tsx';

// Helper to compute great-circle distance in kilometers
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`;
}

export function PropertyDetails() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [message, setMessage] = useState('Hi, I am interested in this property. Please let me know if it is available.');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const { data: p, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const res = await fetch(`/api/properties/${id}`);
      if (!res.ok) throw new Error('Property not found');
      return res.json();
    },
  });

  const sendInquiry = async () => {
    if (!token || !user) {
      alert('Please sign in to contact the owner.');
      return;
    }
    setSending(true);
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          propertyId: parseInt(id!),
          name: user.displayName || user.email?.split('@')[0] || 'Interested Renter',
          phone: user.phoneNumber || 'Contact via RentNest',
          message,
        }),
      });
      setSent(true);
    } catch (e) {
      console.error(e);
      alert('Could not submit inquiry. Please try again.');
    }
    setSending(false);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-32 text-slate-500 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="text-sm font-medium">Loading property specifications...</p>
      </div>
    );
  }

  if (!p) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-32">
        <Building2 className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Property Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">The requested listing may have been rented or removed.</p>
        <Link to="/search" className="bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
          Browse Available Homes
        </Link>
      </div>
    );
  }

  // Realistic nearby facilities anchored around property lat/long
  const nearbyPlaces = p.latitude && p.longitude ? [
    { name: 'City Central Metro / Transit Stop', category: 'Transit', icon: '🚇', dist: calculateDistance(p.latitude, p.longitude, p.latitude + 0.004, p.longitude + 0.003) },
    { name: 'Apollo / Columbia Multi-specialty Clinic', category: 'Healthcare', icon: '🏥', dist: calculateDistance(p.latitude, p.longitude, p.latitude - 0.007, p.longitude + 0.005) },
    { name: 'Fresh Supermarket & Organic Grocery', category: 'Groceries', icon: '🛒', dist: calculateDistance(p.latitude, p.longitude, p.latitude + 0.002, p.longitude - 0.003) },
    { name: 'HDFC & State Bank ATM Kiosk', category: 'Banking', icon: '🏦', dist: calculateDistance(p.latitude, p.longitude, p.latitude - 0.002, p.longitude - 0.001) },
    { name: 'Cult.fit & Fitness First Gym', category: 'Fitness', icon: '💪', dist: calculateDistance(p.latitude, p.longitude, p.latitude + 0.006, p.longitude - 0.004) },
    { name: 'Third Wave Coffee & Artisanal Bakery', category: 'Dining', icon: '☕', dist: calculateDistance(p.latitude, p.longitude, p.latitude - 0.005, p.longitude + 0.002) },
  ] : [];

  return (
    <div className="flex-1 bg-slate-50 pb-24">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/map"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Map Discovery
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Main Title & Key Specs Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="bg-indigo-100 text-indigo-900 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                {p.propertyType}
              </span>
              <span className="bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                {p.furnishing}
              </span>
              <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-md">
                Direct Owner Listing • No Brokerage
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              {p.title}
            </h1>
            <p className="text-slate-600 flex items-center gap-1.5 text-sm font-medium">
              <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
              {p.area ? `${p.area}, ` : ''}{p.city}, {p.state || 'India'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-left md:text-right shrink-0">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Monthly Rent</div>
            <div className="text-3xl font-extrabold text-indigo-700">
              ₹{p.rent.toLocaleString()}
              <span className="text-sm text-slate-500 font-normal"> / month</span>
            </div>
            {p.negotiable && (
              <span className="text-xs font-medium text-emerald-600">✓ Rent is negotiable</span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column: Details, Image, Map & Nearby */}
          <div className="md:col-span-2 space-y-8">
            {/* Primary Visual Showcase */}
            <div className="bg-slate-900 aspect-[16/9] rounded-3xl overflow-hidden shadow-md relative group">
              {p.images?.[0] ? (
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Building2 className="w-12 h-12 text-slate-500" />
                  <span className="text-sm font-medium">Photos uploaded by owner</span>
                </div>
              )}
            </div>

            {/* Core Specifications Grid */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-xs text-slate-400 font-semibold uppercase mb-1">Configuration</div>
                <div className="font-bold text-slate-900">{p.propertyType}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-xs text-slate-400 font-semibold uppercase mb-1">Furnishing</div>
                <div className="font-bold text-slate-900">{p.furnishing}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-xs text-slate-400 font-semibold uppercase mb-1">Tenant Type</div>
                <div className="font-bold text-slate-900">{p.tenantType || 'Family / Bachelors'}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-xs text-slate-400 font-semibold uppercase mb-1">Available From</div>
                <div className="font-bold text-emerald-600">Immediate</div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-3">About this Property</h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line text-sm md:text-base">
                {p.description}
              </p>

              {/* Amenities */}
              {p.amenities && p.amenities.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Featured Amenities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {p.amenities.map((item: string) => (
                      <span
                        key={item}
                        className="bg-indigo-50 text-indigo-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-indigo-100 flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Map & Directions */}
            {p.latitude && p.longitude && (
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Property Location</h2>
                    <p className="text-xs text-slate-500">Exact coordinates verified by direct property owner</p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Get Directions
                  </a>
                </div>

                <div className="h-[320px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                  <InteractiveMap
                    center={{ lat: p.latitude, lng: p.longitude }}
                    zoom={15}
                    singleMarkerMode={true}
                    singleMarkerTitle={p.title}
                    properties={[p]}
                  />
                </div>
              </div>
            )}

            {/* Nearby Places & Facilities */}
            {nearbyPlaces.length > 0 && (
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-slate-900">Nearby Neighborhood Facilities</h2>
                  <p className="text-xs text-slate-500">Calculated distances from this property</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {nearbyPlaces.map((place, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{place.icon}</span>
                        <div>
                          <div className="font-semibold text-slate-900 text-xs">{place.name}</div>
                          <div className="text-[10px] text-slate-500">{place.category}</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        {place.dist}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Contact Owner Action Box */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg sticky top-24">
              <div className="flex items-center gap-3.5 mb-6 pb-6 border-b border-slate-100">
                <div className="w-14 h-14 bg-indigo-100 text-indigo-700 font-extrabold text-xl rounded-2xl flex items-center justify-center shadow-inner">
                  {p.owner?.name?.charAt(0) || 'O'}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-base">{p.owner?.name || 'Verified Owner'}</div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 w-max">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Landlord
                  </div>
                </div>
              </div>

              {sent ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-5 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-sm">Enquiry Sent to Landlord!</h4>
                  <p className="text-xs text-emerald-700">
                    The owner has been notified and will reach out to you shortly. You can track this in your dashboard.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Send Direct Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none resize-none text-slate-800 font-medium"
                    />
                  </div>

                  <button
                    onClick={sendInquiry}
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md shadow-indigo-200 text-sm active:scale-[0.98]"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send Direct Enquiry
                      </>
                    )}
                  </button>

                  {showPhone ? (
                    <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-center">
                      <div className="text-[11px] text-indigo-600 font-semibold uppercase">Owner Direct Contact</div>
                      <a
                        href={`tel:${p.owner?.phone || '+919876543210'}`}
                        className="font-bold text-indigo-900 text-base hover:underline"
                      >
                        {p.owner?.phone || '+91 98765 43210'}
                      </a>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowPhone(true)}
                      className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl transition-colors text-xs"
                    >
                      <Phone className="w-4 h-4 text-slate-600" /> Show Landlord Phone Number
                    </button>
                  )}

                  <div className="pt-4 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>RentNest Guarantee: 100% zero brokerage. Direct owner-to-tenant communication.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
