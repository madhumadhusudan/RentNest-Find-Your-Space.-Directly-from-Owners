import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Building2, Key, ShieldCheck } from 'lucide-react';

export function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-indigo-900 text-white pt-24 pb-32 px-4">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Find Your Space.<br className="hidden md:block" /> Directly.
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 mb-10 max-w-2xl mx-auto font-light">
            Search rooms, apartments and homes around you, explore them on the map and connect directly with owners.
          </p>
          
          <div className="bg-white p-2 rounded-2xl shadow-xl shadow-indigo-900/50 flex flex-col sm:flex-row gap-2 max-w-3xl mx-auto">
            <div className="relative flex-1 flex items-center">
              <MapPin className="absolute left-4 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search city, area or locality..." 
                className="w-full pl-12 pr-4 py-4 text-slate-900 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <Link 
              to="/search" 
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              <Search className="w-5 h-5" /> Search Homes
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why RentNest?</h2>
            <p className="text-lg text-slate-600">The modern way to discover rental properties without the middleman.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<MapPin className="w-8 h-8 text-indigo-600" />}
              title="Map-First Discovery"
              desc="Explore neighborhoods interactively. See exactly where your next home is located before you visit."
            />
            <FeatureCard 
              icon={<Key className="w-8 h-8 text-teal-600" />}
              title="Direct Owner Contact"
              desc="Skip the broker fees. We connect you directly with verified property owners for a transparent process."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8 text-indigo-600" />}
              title="Verified Information"
              desc="Accurate photos, clear amenities, and verified contact details to save you time and frustration."
            />
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-24 px-4 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto bg-indigo-50 rounded-3xl p-10 md:p-16 text-center border border-indigo-100">
          <Building2 className="w-12 h-12 text-indigo-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Are you a house owner?</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
            List your property directly on RentNest to find genuine tenants quickly, without paying arbitrary commissions.
          </p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-full transition-colors shadow-sm">
            List Your Property
          </button>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}
