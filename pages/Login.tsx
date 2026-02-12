import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuthStore } from '../store/useAuthStore';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Automatically redirect when user is detected
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // No need to navigate here; the useEffect will handle it once the auth store updates.
      // This prevents race conditions where the router redirects before the global user state is ready.
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#FF6B35] opacity-[0.05] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#4ECDC4] opacity-[0.05] blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link to="/download" className="inline-flex items-center gap-2 text-[#A0A0B0] hover:text-white mb-8 transition-colors">
          <ChevronLeft size={20} /> Back to Home
        </Link>
        
        <GlassCard className="!p-8 md:!p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-[#A0A0B0]">Enter the universe</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && <div className="p-3 rounded bg-[#EF4444]/20 text-[#EF4444] text-sm">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-[#A0A0B0] mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="shinji@nerv.org"
                className="w-full bg-[#1A1A2E] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF6B35] transition-colors"
                required
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-[#A0A0B0]">Password</label>
                <a href="#" className="text-xs text-[#FF6B35] hover:underline">Forgot password?</a>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1A1A2E] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF6B35] transition-colors"
                required
              />
            </div>

            <Button className="w-full !rounded-xl" type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : 'Log In'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-[#A0A0B0] text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#FF6B35] font-bold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};