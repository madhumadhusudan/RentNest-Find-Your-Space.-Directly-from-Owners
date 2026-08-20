import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './providers.tsx';
import { Home, Map as MapIcon, User, LogIn, LogOut, PlusCircle, Search as SearchIcon, ShieldCheck } from 'lucide-react';

export function Layout() {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Brand Zone (Single Text Element) */}
          <Link to="/" className="flex items-center gap-2 text-indigo-700 hover:text-indigo-800 transition-colors whitespace-nowrap shrink-0">
            <Home className="w-5 h-5 stroke-[2.5]" />
            <span className="font-extrabold text-xl tracking-tight">RentNest</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 font-semibold text-xs tracking-wide uppercase">
            <Link
              to="/"
              className={`transition-colors whitespace-nowrap shrink-0 ${
                isCurrent('/') ? 'text-indigo-600 font-bold' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/search"
              className={`transition-colors whitespace-nowrap shrink-0 ${
                isCurrent('/search') ? 'text-indigo-600 font-bold' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              Find Homes
            </Link>
            <Link
              to="/map"
              className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
                isCurrent('/map') ? 'text-indigo-600 font-bold' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" /> Map Explorer
            </Link>
            {profile?.role === 'Owner' && (
              <Link
                to="/add-property"
                className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
                  isCurrent('/add-property') ? 'text-indigo-600 font-bold' : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" /> List Property
              </Link>
            )}
          </nav>

          {/* Action Zone */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0"
                >
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{profile?.name || user.displayName || 'Dashboard'}</span>
                  {profile?.role && (
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-bold">
                      {profile.role === 'Owner' ? 'Owner' : 'Renter'}
                    </span>
                  )}
                </Link>

                <button
                  onClick={signOut}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 transition-colors px-3 py-2 rounded-xl hover:bg-rose-50 whitespace-nowrap shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3.5 py-2 rounded-xl hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200 whitespace-nowrap shrink-0"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
