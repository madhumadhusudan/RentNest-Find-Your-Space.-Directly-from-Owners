import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers.tsx';
import { Building2, MapPin, Loader2, CheckCircle2, Image as ImageIcon, Sparkles, Plus, Check } from 'lucide-react';
import { InteractiveMap } from '../components/InteractiveMap.tsx';

const CITY_COORDS: Record<string, { lat: number; lng: number; state: string }> = {
  bangalore: { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  bengaluru: { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  mumbai: { lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
  mysuru: { lat: 12.2958, lng: 76.6394, state: 'Karnataka' },
  mysore: { lat: 12.2958, lng: 76.6394, state: 'Karnataka' },
  delhi: { lat: 28.7041, lng: 77.1025, state: 'Delhi' },
  hyderabad: { lat: 17.3850, lng: 78.4867, state: 'Telangana' },
  pune: { lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
  chennai: { lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
};

const ALL_AMENITIES = [
  'Parking',
  'WiFi',
  'AC',
  'Lift',
  'Balcony',
  'Power Backup',
  'Security',
  'CCTV',
  'Gym',
  'Water Supply',
  'Gated Community',
  'Pet Friendly',
];

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1de2d96674?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2000&auto=format&fit=crop',
];

export function AddProperty() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: '2 BHK',
    furnishing: 'Semi Furnished',
    rent: '',
    city: 'Bangalore',
    area: 'Indiranagar',
    state: 'Karnataka',
    tenantType: 'Anyone',
    allowedMembers: 3,
    latitude: 12.9784,
    longitude: 77.6408,
    images: [PRESET_IMAGES[0]],
    amenities: ['Parking', 'WiFi', 'Security'],
  });

  const [imageUrlInput, setImageUrlInput] = useState('');

  const handleCityChange = (cityName: string) => {
    const key = cityName.trim().toLowerCase();
    const cityInfo = CITY_COORDS[key];
    if (cityInfo) {
      setFormData((prev) => ({
        ...prev,
        city: cityName,
        state: cityInfo.state,
        latitude: cityInfo.lat + (Math.random() - 0.5) * 0.04,
        longitude: cityInfo.lng + (Math.random() - 0.5) * 0.04,
      }));
    } else {
      setFormData((prev) => ({ ...prev, city: cityName }));
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const addCustomImage = () => {
    if (!imageUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()],
    }));
    setImageUrlInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert('Please sign in to publish a property listing.');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          rent: parseInt(formData.rent as string),
          allowedMembers: Number(formData.allowedMembers),
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to list property.');
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Property Listed Live!</h2>
        <p className="text-slate-600 text-sm mb-4">
          Your listing has been published to RentNest and is now visible on the interactive map and search discovery.
        </p>
        <span className="text-xs text-slate-400">Redirecting to owner dashboard...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-8 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">List Your Property</h1>
        <p className="text-slate-600 text-sm">
          Connect directly with verified tenants with 100% zero broker commissions.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-8"
      >
        {/* Step 1: Basic Details */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-5 h-5 text-indigo-600" /> Basic Information
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Property Title</label>
            <input
              required
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              type="text"
              placeholder="e.g. Sunny 2 BHK Apartment near Metro"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-sm text-slate-900 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Property Type</label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-900 font-medium"
              >
                <option>1 RK</option>
                <option>1 BHK</option>
                <option>2 BHK</option>
                <option>3 BHK</option>
                <option>Single Room</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Furnishing</label>
              <select
                name="furnishing"
                value={formData.furnishing}
                onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-900 font-medium"
              >
                <option>Fully Furnished</option>
                <option>Semi Furnished</option>
                <option>Unfurnished</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Rent (₹)</label>
              <input
                required
                name="rent"
                value={formData.rent}
                onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                type="number"
                min="500"
                placeholder="25000"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-sm text-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Tenants</label>
              <select
                name="tenantType"
                value={formData.tenantType}
                onChange={(e) => setFormData({ ...formData, tenantType: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-900 font-medium"
              >
                <option>Anyone</option>
                <option>Family</option>
                <option>Bachelors</option>
                <option>Working Professionals</option>
                <option>Students</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Property Description</label>
            <textarea
              required
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Highlight proximity to IT parks, natural light, security, power backup, etc."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-sm text-slate-900"
            />
          </div>
        </div>

        {/* Step 2: Location */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="w-5 h-5 text-indigo-600" /> Location Details
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
              <input
                required
                name="city"
                value={formData.city}
                onChange={(e) => handleCityChange(e.target.value)}
                type="text"
                placeholder="e.g. Bangalore, Mumbai, Mysuru"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-900 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Area / Locality</label>
              <input
                required
                name="area"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                type="text"
                placeholder="e.g. Indiranagar, Koramangala, Bandra"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-900 font-medium"
              />
            </div>
          </div>

          <div className="h-48 rounded-2xl overflow-hidden border border-slate-200 relative">
            <InteractiveMap
              center={{ lat: formData.latitude, lng: formData.longitude }}
              zoom={13}
              singleMarkerMode={true}
              singleMarkerTitle={formData.title || 'Selected Location'}
            />
          </div>
        </div>

        {/* Step 3: Amenities */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-5 h-5 text-indigo-600" /> Amenities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {ALL_AMENITIES.map((amenity) => {
              const selected = formData.amenities.includes(amenity);
              return (
                <button
                  type="button"
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`p-2.5 text-xs font-semibold rounded-xl border flex items-center justify-between transition-all ${
                    selected
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{amenity}</span>
                  {selected && <Check className="w-4 h-4 text-indigo-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Photos */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <ImageIcon className="w-5 h-5 text-indigo-600" /> Property Photos
          </h2>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {PRESET_IMAGES.map((url, i) => {
              const isChosen = formData.images.includes(url);
              return (
                <div
                  key={i}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      images: isChosen
                        ? prev.images.filter((img) => img !== url)
                        : [...prev.images, url],
                    }))
                  }
                  className={`aspect-square rounded-xl overflow-hidden relative cursor-pointer border-2 transition-all ${
                    isChosen ? 'border-indigo-600 ring-2 ring-indigo-500/30' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="Preset" className="w-full h-full object-cover" />
                  {isChosen && (
                    <div className="absolute top-1 right-1 bg-indigo-600 text-white rounded-full p-0.5 shadow-sm">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Or paste an image URL..."
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
            />
            <button
              type="button"
              onClick={addCustomImage}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-2xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Listing Now'}
          </button>
        </div>
      </form>
    </div>
  );
}
