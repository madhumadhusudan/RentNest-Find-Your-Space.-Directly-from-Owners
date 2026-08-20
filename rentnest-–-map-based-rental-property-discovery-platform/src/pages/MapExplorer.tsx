import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Loader2, MapPin, SlidersHorizontal, Home as HomeIcon, CheckCircle2 } from 'lucide-react';
import { InteractiveMap, PropertyMarkerData } from '../components/InteractiveMap.tsx';
import { Link } from 'react-router-dom';

export function MapExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedFurnishing, setSelectedFurnishing] = useState('ALL');
  const [maxBudget, setMaxBudget] = useState<number | ''>('');
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<number | null>(null);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const { data: properties = [], isLoading } = useQuery<PropertyMarkerData[]>({
    queryKey: ['properties'],
    queryFn: async () => {
      const res = await fetch('/api/properties');
      if (!res.ok) throw new Error('Failed to fetch properties');
      return res.json();
    },
  });

  // Client-side filtering for immediate responsive search
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = p.title?.toLowerCase().includes(query);
        const matchesCity = p.city?.toLowerCase().includes(query);
        const matchesArea = p.area?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCity && !matchesArea) return false;
      }

      if (selectedType !== 'ALL' && p.propertyType !== selectedType) {
        return false;
      }

      if (selectedFurnishing !== 'ALL' && p.furnishing !== selectedFurnishing) {
        return false;
      }

      if (maxBudget !== '' && p.rent > Number(maxBudget)) {
        return false;
      }

      return true;
    });
  }, [properties, searchTerm, selectedType, selectedFurnishing, maxBudget]);

  const activeFiltersCount =
    (selectedType !== 'ALL' ? 1 : 0) +
    (selectedFurnishing !== 'ALL' ? 1 : 0) +
    (maxBudget !== '' ? 1 : 0);

  const resetFilters = () => {
    setSelectedType('ALL');
    setSelectedFurnishing('ALL');
    setMaxBudget('');
    setSearchTerm('');
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
      {/* Left Sidebar List */}
      <div className="w-full md:w-[420px] lg:w-[460px] bg-white shadow-xl z-20 flex flex-col h-full overflow-hidden border-r border-slate-200 shrink-0">
        {/* Header Search & Filter Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-col gap-3 shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search city, area (e.g. Bangalore, Indiranagar)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-900"
              />
            </div>
            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2.5 rounded-xl border transition-all ${
                activeFiltersCount > 0
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-indigo-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center ml-0.5">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Quick Property Type Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {['ALL', '1 BHK', '2 BHK', '3 BHK', '1 RK'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  selectedType === type
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type === 'ALL' ? 'All Types' : type}
              </button>
            ))}
          </div>

          {/* Collapsible Filter Panel */}
          {showFilterDrawer && (
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs animate-in fade-in slide-in-from-top-2">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Furnishing</label>
                <select
                  value={selectedFurnishing}
                  onChange={(e) => setSelectedFurnishing(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-1 focus:ring-indigo-500 outline-none"
                >
                  <option value="ALL">Any Furnishing</option>
                  <option value="Fully Furnished">Fully Furnished</option>
                  <option value="Semi Furnished">Semi Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Max Budget (₹/mo)</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value ? Number(e.target.value) : '')}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
              {activeFiltersCount > 0 && (
                <div className="col-span-2 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="text-xs font-semibold text-rose-600 hover:underline"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Count Bar */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
          <span>
            Showing <strong className="text-slate-900 font-bold">{filteredProperties.length}</strong> available {filteredProperties.length === 1 ? 'home' : 'homes'}
          </span>
          <span className="text-[11px] text-slate-400">Click a card or pin to explore</span>
        </div>

        {/* Properties Scroll List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-sm font-medium">Loading verified properties...</p>
            </div>
          ) : filteredProperties.length > 0 ? (
            filteredProperties.map((p) => {
              const isSelected = selectedPropertyId === p.id;
              return (
                <div
                  key={p.id}
                  onMouseEnter={() => setHoveredPropertyId(p.id)}
                  onMouseLeave={() => setHoveredPropertyId(null)}
                  onClick={() => setSelectedPropertyId(p.id)}
                  className={`group bg-white border rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer flex flex-col ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-lg'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div className="h-44 bg-slate-100 relative overflow-hidden">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                        <HomeIcon className="w-8 h-8 text-slate-300" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-900 shadow-sm">
                      {p.propertyType}
                    </div>
                    {p.owner?.phoneVerified && (
                      <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col gap-1.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="text-xl font-extrabold text-indigo-700">
                        ₹{p.rent.toLocaleString()}
                        <span className="text-xs text-slate-500 font-medium">/mo</span>
                      </div>
                      <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {p.furnishing}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-indigo-600 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      {p.area ? `${p.area}, ` : ''}{p.city}
                    </p>

                    <div className="pt-3 mt-1 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-500">
                        Direct Owner: <strong className="text-slate-800">{p.owner?.name || 'Verified Owner'}</strong>
                      </span>
                      <Link
                        to={`/property/${p.id}`}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-slate-500 py-16 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="font-bold text-slate-800 mb-1">No homes found</h4>
              <p className="text-xs text-slate-500 mb-4">Try clearing your filters or searching a different area.</p>
              <button
                onClick={resetFilters}
                className="text-xs font-semibold bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Map Canvas */}
      <div className="flex-1 relative bg-slate-100 min-h-[350px] md:min-h-0 h-full">
        <InteractiveMap
          properties={filteredProperties}
          selectedPropertyId={selectedPropertyId}
          onSelectProperty={(prop) => setSelectedPropertyId(prop?.id || null)}
          hoveredPropertyId={hoveredPropertyId}
          center={
            filteredProperties[0]?.latitude && filteredProperties[0]?.longitude
              ? { lat: filteredProperties[0].latitude, lng: filteredProperties[0].longitude }
              : { lat: 12.9716, lng: 77.5946 }
          }
        />
      </div>
    </div>
  );
}
