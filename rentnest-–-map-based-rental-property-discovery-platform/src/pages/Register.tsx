import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers.tsx';
import {
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  KeyRound,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Home,
} from 'lucide-react';

const QUICK_CITIES = [
  { city: 'Bangalore', state: 'Karnataka' },
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Mysuru', state: 'Karnataka' },
  { city: 'Delhi', state: 'Delhi' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Chennai', state: 'Tamil Nadu' },
];

export function Register() {
  const { registerWithEmailAndDetails, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Form Fields
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'Owner' | 'Seeker'>('Seeker'); // House Owner vs Rent Person
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [state, setState] = useState('Karnataka');

  // UI States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Validate Age (Must be >= 18)
  const isAgeValid = typeof age === 'number' && age >= 18 && age <= 120;
  const isAgeEntered = age !== '';

  const handleQuickCitySelect = (c: { city: string; state: string }) => {
    setCity(c.city);
    setState(c.state);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validations
    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (typeof age !== 'number' || age < 18) {
      setErrorMessage('Age validation failed: You must be at least 18 years of age to register.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-check.');
      return;
    }

    setLoading(true);
    try {
      await registerWithEmailAndDetails({
        name: name.trim(),
        age: Number(age),
        email: email.trim(),
        password,
        role,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        city: city.trim(),
        state: state.trim(),
      });

      setSuccessMessage('Registration successful! Setting up your workspace...');
      setTimeout(() => {
        if (role === 'Owner') {
          navigate('/add-property');
        } else {
          navigate('/search');
        }
      }, 1000);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already registered. Please sign in instead.');
      } else {
        setErrorMessage(err.message || 'Failed to complete registration.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 bg-slate-50">
      <div className="w-full max-w-xl">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 font-extrabold text-2xl tracking-tight mb-2">
            <Building2 className="w-7 h-7 stroke-[2.5]" />
            <span>RentNest</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Join thousands of verified landlords and tenants with zero broker fees
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8">
          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. REGISTRATION TYPE / ROLE SELECTOR */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                I am registering as <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* House Owner */}
                <div
                  onClick={() => setRole('Owner')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-1.5 ${
                    role === 'Owner'
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      role === 'Owner' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      <Building2 className="w-4 h-4" />
                    </div>
                    {role === 'Owner' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <div className="font-bold text-slate-900 text-sm mt-1">House Owner</div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    I own residential property & want to list for rent
                  </p>
                </div>

                {/* Rent Person / Seeker */}
                <div
                  onClick={() => setRole('Seeker')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-1.5 ${
                    role === 'Seeker'
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      role === 'Seeker' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      <KeyRound className="w-4 h-4" />
                    </div>
                    {role === 'Seeker' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <div className="font-bold text-slate-900 text-sm mt-1">Rent Person</div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    I am looking to discover & rent verified homes
                  </p>
                </div>
              </div>
            </div>

            {/* 2. PERSONAL IDENTITY: NAME & AGE (STRICTLY > 18) */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Age <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] font-bold text-slate-400">(Min 18 yrs)</span>
                </div>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    required
                    min="18"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 24"
                    className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border rounded-xl text-sm font-bold text-slate-900 outline-none transition-all ${
                      isAgeEntered && !isAgeValid
                        ? 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/50'
                        : isAgeValid
                        ? 'border-emerald-400 bg-emerald-50/20'
                        : 'border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Age Validation Warning Banner if < 18 */}
            {isAgeEntered && !isAgeValid && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>You must be at least 18 years old to register as a legal tenant or property owner.</span>
              </div>
            )}

            {/* 3. EMAIL & PHONE NUMBER */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mobile Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. PASSWORDS */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 5. RESIDENTIAL ADDRESS, CITY, STATE */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Residential / Business Address
                </label>
                <div className="relative">
                  <Home className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Flat 402, Green Glen Layout, Bellandur"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Bangalore"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Karnataka"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Quick City Suggestions */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 mr-2">Popular Cities:</span>
                <div className="inline-flex flex-wrap gap-1.5 mt-1">
                  {QUICK_CITIES.map((c) => (
                    <button
                      key={c.city}
                      type="button"
                      onClick={() => handleQuickCitySelect(c)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                        city.toLowerCase() === c.city.toLowerCase()
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {c.city}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Terms & Submit Button */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-start gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  By registering, you confirm that you are at least 18 years old and agree to direct landlord-tenant communication with zero broker fees.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading || (isAgeEntered && !isAgeValid)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-100 text-sm active:scale-[0.99]"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Link to Login */}
        <div className="text-center mt-6 text-xs text-slate-600">
          <span>Already have an account? </span>
          <Link
            to="/login"
            className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Sign In here →
          </Link>
        </div>
      </div>
    </div>
  );
}
