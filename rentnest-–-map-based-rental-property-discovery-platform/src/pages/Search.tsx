import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, MapPin, SlidersHorizontal, Loader2 } from 'lucide-react';

export function Search() {
  const [city, setCity] = useState('');
  
  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties', city],
    queryFn: async () => {
      const url = city ? `/api/properties?city=${encodeURIComponent(city)}` : '/api/properties';
      const res = await fetch(url);
      return res.json();
    }
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search by city (e.g. Mysuru)..." 
              className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
            <SlidersHorizontal className="w-5 h-5" /> Filters
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          {city ? `Homes in ${city}` : 'All Homes'} <span className="text-slate-500 font-normal text-lg">({properties?.length || 0})</span>
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>
        ) : properties?.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((p: any) => (
              <Link to={`/property/${p.id}`} key={p.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all flex flex-col hover:border-indigo-200">
                <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded flex items-center gap-1 text-xs font-bold text-slate-900 shadow-sm">
                    {p.propertyType}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="text-2xl font-extrabold text-indigo-700 mb-2">₹{p.rent}<span className="text-sm text-slate-500 font-medium">/mo</span></div>
                  <h3 className="font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-indigo-700 transition-colors">{p.title}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mb-4 line-clamp-1"><MapPin className="w-3.5 h-3.5 shrink-0"/> {p.area}, {p.city}</p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-600">
                    <span className="bg-slate-50 px-2.5 py-1.5 rounded-lg">{p.furnishing}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-slate-200 border-dashed rounded-3xl">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No homes found</h2>
            <p className="text-slate-500">Try adjusting your search criteria or location.</p>
          </div>
        )}
      </div>
    </div>
  );
}
