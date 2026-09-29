import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { loginSchema } from '@/features/auth/authSchemas';
import { useLoginMutation } from '@/features/auth/authApi';
import { setCredentials } from '@/features/auth/authSlice';
import { FiMail, FiLock } from 'react-icons/fi';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await login(data).unwrap();
      dispatch(setCredentials(response.data.user));
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 bg-card rounded-xl border border-border shadow-lg z-10 mx-4">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center text-accent-foreground text-xl font-bold mb-4 shadow-sm">
            P
          </div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Log in to your account</h2>
          <p className="text-muted-foreground text-sm mt-2 font-medium">Welcome back! Please enter your details.</p>
        </div>
        
        {/* Error Handling */}
        {error && (
          <div className="w-full bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3 rounded-md mb-6">
            {error.data?.message || 'Unable to connect to the server. Please try again.'}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                {...register('email')}
                type="email" 
                className="w-full bg-input border border-border rounded-md pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors placeholder:text-muted-foreground"
                placeholder="name@company.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-destructive font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                {...register('password')}
                type="password" 
                className="w-full bg-input border border-border rounded-md pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors placeholder:text-muted-foreground"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-destructive font-medium">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-md text-sm font-bold transition-colors disabled:opacity-70 mt-2 flex items-center justify-center shadow-sm"
          >
            {isLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
            ) : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground font-medium">
          Don't have an account? <Link to="/register" className="text-accent hover:text-accent/80 font-bold ml-1 transition-colors">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;