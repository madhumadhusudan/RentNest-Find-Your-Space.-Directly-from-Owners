import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../providers.tsx';
import {
  Mail,
  Lock,
  Phone,
  UserCheck,
  Building2,
  KeyRound,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  Smartphone,
} from 'lucide-react';

export function Login() {
  const { signInWithEmail, signInWithPhoneSimulated, signInAsGuest, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Auth Mode: 'email' | 'phone' | 'guest'
  const [authMode, setAuthMode] = useState<'email' | 'phone' | 'guest'>('email');

  // Email State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone State
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneStep, setPhoneStep] = useState<'input' | 'otp'>('input');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('482910');
  const [otpCountdown, setOtpCountdown] = useState(30);
  const [phoneRole, setPhoneRole] = useState<'Seeker' | 'Owner'>('Seeker');

  // Guest State
  const [guestRole, setGuestRole] = useState<'Seeker' | 'Owner'>('Seeker');

  // UI State
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle OTP Countdown
  React.useEffect(() => {
    let interval: any = null;
    if (phoneStep === 'otp' && otpCountdown > 0) {
      interval = setInterval(() => setOtpCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [phoneStep, otpCountdown]);

  // 1. Email Sign In
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    if (!email.trim() || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email.trim(), password);
      setSuccessMessage('Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMessage('Invalid email or password. If you do not have an account, please register first.');
      } else {
        setErrorMessage(err.message || 'Login failed. Please verify your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Phone Number Flow
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Generate simulated 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setPhoneStep('otp');
    setOtpCountdown(30);
    setOtpValues(['', '', '', '', '', '']);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val[val.length - 1];
    }
    const newOtp = [...otpValues];
    newOtp[index] = val;
    setOtpValues(newOtp);

    // Auto-advance to next box
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-box-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-box-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyPhoneOtp = async () => {
    setErrorMessage('');
    const enteredOtp = otpValues.join('');
    if (enteredOtp.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP.');
      return;
    }

    if (enteredOtp !== generatedOtp && enteredOtp !== '482910') {
      setErrorMessage(`Invalid OTP code. Please use the simulated OTP: ${generatedOtp}`);
      return;
    }

    setLoading(true);
    try {
      const fullPhone = `${countryCode} ${phoneNumber}`;
      await signInWithPhoneSimulated(
        fullPhone,
        phoneRole,
        phoneRole === 'Owner' ? 'Phone Verified Landlord' : 'Phone Verified Tenant'
      );
      setSuccessMessage('Phone verified! Redirecting to your dashboard...');
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Phone sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Guest Login
  const handleGuestLogin = async (role: 'Seeker' | 'Owner') => {
    setErrorMessage('');
    setLoading(true);
    try {
      const guestName = role === 'Owner' ? 'Guest Landlord' : 'Guest Home Seeker';
      await signInAsGuest(role, guestName);
      setSuccessMessage(`Welcome! Exploring as ${guestName}...`);
      setTimeout(() => navigate(role === 'Owner' ? '/add-property' : '/search'), 800);
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Could not initialize guest session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fast demo auto-fill for testing
  const autoFillDemo = (type: 'owner' | 'renter') => {
    if (type === 'owner') {
      setEmail('priya.sharma@rentnest.demo');
      setPassword('DemoLandlord@2026');
    } else {
      setEmail('vikram.renter@rentnest.demo');
      setPassword('DemoRenter@2026');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 bg-slate-50">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 font-extrabold text-2xl tracking-tight mb-2">
            <Building2 className="w-7 h-7 stroke-[2.5]" />
            <span>RentNest</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign In to RentNest
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Direct owner listings with 100% zero brokerage
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8">
          {/* Interactive 3-Option Tab Switcher */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode('email');
                setErrorMessage('');
              }}
              className={`py-2.5 px-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                authMode === 'email'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('phone');
                setErrorMessage('');
              }}
              className={`py-2.5 px-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                authMode === 'phone'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone OTP</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('guest');
                setErrorMessage('');
              }}
              className={`py-2.5 px-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                authMode === 'guest'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Guest Demo</span>
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium flex items-start gap-2">
              <span className="shrink-0 font-bold">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* OPTION 1: EMAIL LOGIN */}
          {authMode === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Password
                  </label>
                  <span className="text-[11px] text-indigo-600 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
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

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-100 text-sm active:scale-[0.99]"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Sign In with Email</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Demo Quick Fill Helper */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Quick demo fill:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => autoFillDemo('owner')}
                    className="text-indigo-600 hover:underline font-semibold"
                  >
                    Landlord
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => autoFillDemo('renter')}
                    className="text-indigo-600 hover:underline font-semibold"
                  >
                    Renter
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* OPTION 2: PHONE NUMBER LOGIN WITH INTERACTIVE OTP */}
          {authMode === 'phone' && (
            <div className="space-y-4">
              {phoneStep === 'input' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      I want to sign in as:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPhoneRole('Seeker')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          phoneRole === 'Seeker'
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <KeyRound className="w-3.5 h-3.5" /> Rent Person
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhoneRole('Owner')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          phoneRole === 'Owner'
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5" /> House Owner
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Mobile Number
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-2 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+971">🇦🇪 +971</option>
                      </select>
                      <div className="relative flex-1">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="98765 43210"
                          maxLength={15}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-100 text-sm"
                  >
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* OTP Verification Screen */
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-xs text-slate-600">
                      Enter the 6-digit code sent to{' '}
                      <strong className="text-slate-900 font-bold">{countryCode} {phoneNumber}</strong>
                    </p>

                    {/* Instant Demo OTP Pill for easy review */}
                    <div className="mt-2 inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-800 px-3 py-1 rounded-full text-xs font-mono font-bold">
                      <span>Simulated OTP:</span>
                      <span className="text-indigo-600 tracking-wider font-extrabold">{generatedOtp}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const chars = generatedOtp.split('');
                          setOtpValues(chars);
                        }}
                        className="ml-1 text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full hover:bg-indigo-700"
                      >
                        Auto-fill
                      </button>
                    </div>
                  </div>

                  {/* 6 OTP Input Boxes */}
                  <div className="flex justify-between gap-1.5 sm:gap-2">
                    {otpValues.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-box-${i}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-11 h-12 text-center text-lg font-extrabold bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none text-slate-900 transition-all"
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyPhoneOtp}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-100 text-sm"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify & Sign In</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <button
                      type="button"
                      onClick={() => setPhoneStep('input')}
                      className="text-slate-500 hover:text-slate-800 font-medium"
                    >
                      ← Change number
                    </button>
                    {otpCountdown > 0 ? (
                      <span className="text-slate-400">Resend in {otpCountdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          const code = Math.floor(100000 + Math.random() * 900000).toString();
                          setGeneratedOtp(code);
                          setOtpCountdown(30);
                        }}
                        className="text-indigo-600 font-bold hover:underline"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* OPTION 3: GUEST LOGIN (1-CLICK INSTANT DEMO) */}
          {authMode === 'guest' && (
            <div className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-2xl text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-800">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Instant 1-Click Guest Mode</span>
                </div>
                <p className="text-amber-700/90 leading-relaxed text-[11px]">
                  No passwords or credentials required. Select how you want to experience RentNest right now:
                </p>
              </div>

              <div className="space-y-3">
                {/* Guest Seeker Card */}
                <div
                  onClick={() => handleGuestLogin('Seeker')}
                  className="p-4 rounded-2xl border-2 border-indigo-100 hover:border-indigo-600 bg-indigo-50/30 hover:bg-indigo-50/60 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                        Continue as Rent Person / Seeker
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Explore homes, calculate distances, and send direct enquiries
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Guest Owner Card */}
                <div
                  onClick={() => handleGuestLogin('Owner')}
                  className="p-4 rounded-2xl border-2 border-slate-200 hover:border-slate-800 bg-slate-50/50 hover:bg-slate-100/80 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                        Continue as House Owner / Landlord
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        List property, configure rent & specs, and track tenant requests
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-700 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          )}

          {/* Social Alternative: Google 1-Click */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={async () => {
                setErrorMessage('');
                try {
                  await signInWithGoogle();
                  if (user) {
                    navigate('/dashboard');
                  }
                } catch (e: any) {
                  if (e?.code !== 'auth/popup-closed-by-user') {
                    setErrorMessage('Google sign in was cancelled or interrupted.');
                  }
                }
              }}
              className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        </div>

        {/* Footer Link to Register */}
        <div className="text-center mt-6 text-xs text-slate-600">
          <span>Don't have an account yet? </span>
          <Link
            to="/register"
            className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Create an Account / Register →
          </Link>
        </div>
      </div>
    </div>
  );
}
