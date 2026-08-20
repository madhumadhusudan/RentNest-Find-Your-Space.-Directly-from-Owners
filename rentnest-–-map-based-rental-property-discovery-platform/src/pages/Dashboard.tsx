import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../providers.tsx';
import { Link } from 'react-router-dom';
import {
  Building,
  Plus,
  Home,
  Phone,
  Mail,
  Loader2,
  MapPin,
  Calendar,
  User as UserIcon,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  KeyRound,
} from 'lucide-react';

export function Dashboard() {
  const { user, token, profile } = useAuth();

  const { data: serverProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    enabled: !!token,
  });

  const currentProfile = serverProfile || profile;
  const isOwner = currentProfile?.role === 'Owner';

  const { data: properties, isLoading: isPropsLoading } = useQuery({
    queryKey: ['my-properties'],
    queryFn: async () => {
      const res = await fetch('/api/users/properties', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    enabled: !!token && isOwner,
  });

  const { data: inquiries, isLoading: isInquiriesLoading } = useQuery({
    queryKey: ['my-inquiries'],
    queryFn: async () => {
      const res = await fetch('/api/inquiries/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    enabled: !!token,
  });

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
        <Building2 className="w-12 h-12 text-indigo-600 mb-3" />
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Access Your Dashboard</h2>
        <p className="text-sm text-slate-600 mb-6">
          Sign in or create an account to view your listed properties, manage direct tenant enquiries, or track saved homes.
        </p>
        <div className="flex gap-3">
          <Link
            to="/login"
            className="bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="bg-slate-100 text-slate-700 font-bold px-6 py-2.5 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  if (isProfileLoading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-32 text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-xs font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8 flex flex-col md:flex-row gap-8 pb-20">
      {/* Sidebar: Profile Summary Card */}
      <div className="w-full md:w-72 shrink-0 flex flex-col gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center text-xl font-extrabold shadow-inner">
              {currentProfile?.name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 truncate">
                {currentProfile?.name || 'User'}
              </h2>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md mt-0.5 bg-indigo-50 text-indigo-700">
                {isOwner ? <Building2 className="w-3 h-3" /> : <KeyRound className="w-3 h-3" />}
                <span>{isOwner ? 'House Owner' : 'Rent Person'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Email:</span>
              <span className="font-medium truncate max-w-[140px]">{currentProfile?.email || user.email}</span>
            </div>
            {currentProfile?.age && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Age:</span>
                <span className="font-bold text-slate-900">{currentProfile.age} yrs</span>
              </div>
            )}
            {currentProfile?.phone && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Phone:</span>
                <span className="font-medium text-slate-900">{currentProfile.phone}</span>
              </div>
            )}
            {currentProfile?.city && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="font-medium text-slate-900">
                  {currentProfile.city}{currentProfile.state ? `, ${currentProfile.state}` : ''}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <Link
              to="/profile"
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
            >
              <UserIcon className="w-3.5 h-3.5" /> Edit Profile Settings
            </Link>
          </div>
        </div>

        {/* Quick Nav Links */}
        <nav className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1 text-xs font-semibold">
          <div className="px-3.5 py-2.5 text-indigo-700 bg-indigo-50 rounded-xl flex items-center gap-2">
            <Home className="w-4 h-4" /> Overview Dashboard
          </div>
          <Link
            to="/search"
            className="px-3.5 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl flex items-center gap-2 transition-colors"
          >
            <MapPin className="w-4 h-4 text-slate-400" /> Explore Properties
          </Link>
          {isOwner && (
            <Link
              to="/add-property"
              className="px-3.5 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4 text-slate-400" /> List New Home
            </Link>
          )}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isOwner ? 'House Owner Portal' : 'Rent Person Dashboard'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isOwner
                ? 'Manage your listed properties and respond to direct tenant requests'
                : 'Track the direct enquiries you have sent to verified landlords'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isOwner ? (
              <Link
                to="/add-property"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-indigo-200"
              >
                <Plus className="w-4 h-4" /> Post New Property
              </Link>
            ) : (
              <Link
                to="/map"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-indigo-200"
              >
                <MapPin className="w-4 h-4" /> Discover on Map
              </Link>
            )}
          </div>
        </div>

        {/* OWNER SECTION: MY PROPERTIES */}
        {isOwner && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-600" /> My Published Properties
              </h2>
              <span className="text-xs text-slate-500 font-semibold">
                {properties?.length || 0} Total Listings
              </span>
            </div>

            {isPropsLoading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              </div>
            ) : properties && properties.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties.map((p: any) => (
                  <div
                    key={p.id}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="h-36 bg-slate-100 relative">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                          No Photo
                        </div>
                      )}
                      <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-bold text-slate-900">
                        {p.propertyType}
                      </div>
                      <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                        {p.status}
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-lg font-extrabold text-indigo-700 mb-1">
                          ₹{p.rent?.toLocaleString()}
                          <span className="text-xs text-slate-400 font-normal">/mo</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-xs truncate mb-1">{p.title}</h3>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          {p.area ? `${p.area}, ` : ''}{p.city}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          to={`/property/${p.id}`}
                          className="text-xs font-bold text-indigo-600 hover:underline"
                        >
                          View Listing →
                        </Link>
                        <span className="text-[11px] text-slate-400 font-medium">Direct Owner</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-10 text-center flex flex-col items-center max-w-lg mx-auto">
                <Building className="w-12 h-12 text-slate-300 mb-3" />
                <h3 className="font-bold text-slate-900 text-sm mb-1">No properties listed yet</h3>
                <p className="text-xs text-slate-500 mb-4">
                  List your house, apartment, or 1 RK directly to verified renters with 0% brokerage.
                </p>
                <Link
                  to="/add-property"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors"
                >
                  List Your First Property
                </Link>
              </div>
            )}
          </section>
        )}

        {/* INQUIRIES SECTION */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-600" />
              {isOwner ? 'Direct Tenant Inquiries Received' : 'My Inquiries to Landlords'}
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              {inquiries?.length || 0} Total Messages
            </span>
          </div>

          {isInquiriesLoading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            </div>
          ) : inquiries && inquiries.length > 0 ? (
            <div className="grid gap-3">
              {inquiries.map((item: any) => (
                <div
                  key={item.inquiry.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-start shadow-xs hover:border-slate-300 transition-all"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        to={`/property/${item.property.id}`}
                        className="font-bold text-indigo-600 hover:underline text-sm"
                      >
                        {item.property.title}
                      </Link>
                      <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        ₹{item.property.rent?.toLocaleString()}/mo
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {item.property.area ? `${item.property.area}, ` : ''}{item.property.city}
                    </p>

                    <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 mt-2 font-medium">
                      "{item.inquiry.message}"
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {new Date(item.inquiry.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Direct Contact
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-10 text-center flex flex-col items-center max-w-lg mx-auto">
              <Mail className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                {isOwner ? 'No inquiries received yet' : 'No inquiries sent yet'}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                {isOwner
                  ? 'As tenants discover your home, their verified enquiries and direct contact requests will show up here.'
                  : 'Browse homes in your preferred neighborhood and send inquiries directly to verified owners.'}
              </p>
              {!isOwner && (
                <Link
                  to="/search"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors"
                >
                  Browse Homes
                </Link>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
