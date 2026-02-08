import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Separator } from '@/app/components/ui/separator';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Target, 
  Zap, 
  Award,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Activity,
  MapPin,
  Trophy,
  BarChart3,
  Shield,
  Dumbbell
} from 'lucide-react';

interface SignUpProps {
  onComplete: () => void;
}

export function SignUp({ onComplete }: SignUpProps) {
  const [view, setView] = useState<'landing' | 'signup' | 'signin'>('landing');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  // ---- LANDING PAGE ----
  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-card">
        {/* Navigation */}
        <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground tracking-tight">Sporgates</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
              <button className="hover:text-foreground transition-colors">Athletes</button>
              <button className="hover:text-foreground transition-colors">Organizers</button>
              <button className="hover:text-foreground transition-colors">Sponsors</button>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setView('signin')}
                className="text-muted-foreground hover:text-foreground"
              >
                Log in
              </Button>
              <Button 
                size="sm"
                onClick={() => setView('signup')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Sign up
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-medium mb-6">
              <Zap className="w-3.5 h-3.5" />
              AI-Powered Sports Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight leading-[1.1] text-balance">
              The complete platform for sports communities
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              Connect athletes, organizers, and sponsors. Create events, manage facilities, and grow your sports business -- all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <Button 
                size="lg"
                onClick={() => setView('signup')}
                className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Get started -- it's free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="h-12 px-6 border-border text-foreground hover:bg-accent"
              >
                See how it works
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="border-y border-border bg-muted/50">
          <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-foreground">50K+</p>
              <p className="text-sm text-muted-foreground mt-1">Active athletes</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-foreground">2.5K</p>
              <p className="text-sm text-muted-foreground mt-1">Events monthly</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-foreground">98%</p>
              <p className="text-sm text-muted-foreground mt-1">Organizer satisfaction</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-secondary font-bold">3x</p>
              <p className="text-sm text-muted-foreground mt-1">Faster event creation</p>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight text-balance">
              Built for everyone in sports
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-lg mx-auto">
              Whether you compete, organize, or sponsor -- Sporgates has the tools you need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Athletes */}
            <div className="group rounded-2xl border border-border bg-card p-7 hover:border-primary/30 transition-all hover:shadow-lg">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <Dumbbell className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">For Athletes</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Discover activities, join events, track your fitness goals with AI, and connect with your sports community.
              </p>
              <ul className="space-y-2.5">
                {['AI-powered goal tracking', 'Activities & facilities nearby', 'Squads & community events'].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Organizers */}
            <div className="group rounded-2xl border-2 border-primary bg-card p-7 shadow-lg relative">
              <div className="absolute -top-3 left-7 px-3 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                Most popular
              </div>
              <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center mb-5">
                <Calendar className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">For Organizers</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Create events, manage facilities, run sponsorship campaigns, and grow your sports business.
              </p>
              <ul className="space-y-2.5">
                {['Create & manage activities', 'Launch sponsorship campaigns', 'Team & resource management'].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Sponsors */}
            <div className="group rounded-2xl border border-border bg-card p-7 hover:border-primary/30 transition-all hover:shadow-lg">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">For Sponsors</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Connect with athletes, sponsor events, and maximize your brand impact with detailed analytics.
              </p>
              <ul className="space-y-2.5">
                {['Sponsorship opportunities', 'Real-time campaign analytics', 'Direct athlete collaboration'].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Platform Features Grid */}
        <section className="border-t border-border bg-muted/30">
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight text-balance">
                Everything you need, built in
              </h2>
              <p className="mt-4 text-muted-foreground text-lg max-w-lg mx-auto">
                Powered by AI and designed for the modern sports ecosystem.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
              {[
                { icon: Target, title: 'AI Goal Tracking', desc: 'Smart recommendations and personalized progress insights.' },
                { icon: MapPin, title: 'Nearby Discovery', desc: 'Find activities, facilities, and events close to you.' },
                { icon: Trophy, title: 'Sponsored Events', desc: 'Connect businesses with athletes seamlessly.' },
                { icon: BarChart3, title: 'Campaign Analytics', desc: 'Real-time metrics and ROI tracking for sponsors.' },
                { icon: Users, title: 'Squad System', desc: 'Create teams, manage rosters, and compete together.' },
                { icon: Shield, title: 'Secure Payments', desc: 'Built-in wallet for tickets, subscriptions, and more.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{title}</h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground tracking-tight">
                Ready to get started?
              </h2>
              <p className="mt-2 text-primary-foreground/70 text-lg">
                Join thousands of athletes and organizers on Sporgates.
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                size="lg"
                onClick={() => setView('signup')}
                className="h-12 px-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                Create free account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-card">
          <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Activity className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">Sporgates</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <button className="hover:text-foreground transition-colors">Privacy</button>
              <button className="hover:text-foreground transition-colors">Terms</button>
              <button className="hover:text-foreground transition-colors">Contact</button>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // ---- SIGN UP FORM ----
  if (view === 'signup') {
    return (
      <div className="min-h-screen bg-muted flex">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:w-[45%] bg-primary relative overflow-hidden flex-col justify-between p-10">
          <div>
            <div className="flex items-center gap-2.5 mb-20">
              <div className="w-9 h-9 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-primary-foreground tracking-tight">Sporgates</span>
            </div>
            <h2 className="text-3xl font-bold text-primary-foreground leading-tight tracking-tight">
              Your sports journey<br />starts here.
            </h2>
            <p className="mt-4 text-primary-foreground/70 text-base leading-relaxed max-w-sm">
              Join a growing community of athletes, organizers, and sponsors building the future of sports.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { stat: '50K+', label: 'Active athletes on the platform' },
              { stat: '2.5K', label: 'Events created every month' },
              { stat: '300+', label: 'Sponsorship campaigns running' },
            ].map(({ stat, label }) => (
              <div key={stat} className="flex items-center gap-4 text-primary-foreground/90">
                <span className="text-2xl font-bold text-secondary w-16">{stat}</span>
                <span className="text-sm text-primary-foreground/60">{label}</span>
              </div>
            ))}
          </div>

          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="flex items-center gap-2.5 mb-8 lg:hidden">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground tracking-tight">Sporgates</span>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Create your account</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Already have an account?{' '}
                <button 
                  onClick={() => setView('signin')}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <Button variant="outline" className="w-full h-11 border-border bg-card hover:bg-accent text-foreground justify-center gap-3" type="button">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
              <Button variant="outline" className="w-full h-11 border-border bg-card hover:bg-accent text-foreground justify-center gap-3" type="button">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                Continue with GitHub
              </Button>
            </div>

            <div className="relative mb-6">
              <Separator className="bg-border" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-muted px-3 text-xs text-muted-foreground uppercase tracking-wider">
                or
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm text-foreground">Full name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-11 bg-card border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="signup-email" className="text-sm text-foreground">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-11 bg-card border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="signup-password" className="text-sm text-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="h-11 bg-card border-border text-foreground placeholder:text-muted-foreground pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium mt-2"
              >
                Create account
              </Button>
            </form>

            <p className="text-xs text-muted-foreground mt-6 text-center">
              By signing up, you agree to our{' '}
              <button className="text-foreground hover:underline">Terms of Service</button>
              {' '}and{' '}
              <button className="text-foreground hover:underline">Privacy Policy</button>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---- SIGN IN FORM ----
  return (
    <div className="min-h-screen bg-muted flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-primary relative overflow-hidden flex-col justify-between p-10">
        <div>
          <div className="flex items-center gap-2.5 mb-20">
            <div className="w-9 h-9 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-primary-foreground tracking-tight">Sporgates</span>
          </div>
          <h2 className="text-3xl font-bold text-primary-foreground leading-tight tracking-tight">
            Welcome back.
          </h2>
          <p className="mt-4 text-primary-foreground/70 text-base leading-relaxed max-w-sm">
            Pick up right where you left off. Your events, your community, your goals -- all waiting for you.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-primary-foreground/10 p-5">
            <p className="text-sm text-primary-foreground/80 italic leading-relaxed">
              "Sporgates has completely changed how I organize local running events. The sponsorship tools alone saved us hours every week."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-bold">
                MR
              </div>
              <div>
                <p className="text-sm font-medium text-primary-foreground">Maria Rodriguez</p>
                <p className="text-xs text-primary-foreground/50">Event Organizer, RunClub NYC</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground tracking-tight">Sporgates</span>
          </div>

          <button
            onClick={() => setView('landing')}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </button>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Sign in to your account</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {"Don't have an account?"}{' '}
              <button 
                onClick={() => setView('signup')}
                className="text-primary hover:underline font-medium"
              >
                Create one
              </button>
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <Button variant="outline" className="w-full h-11 border-border bg-card hover:bg-accent text-foreground justify-center gap-3" type="button">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full h-11 border-border bg-card hover:bg-accent text-foreground justify-center gap-3" type="button">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              Continue with GitHub
            </Button>
          </div>

          <div className="relative mb-6">
            <Separator className="bg-border" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-muted px-3 text-xs text-muted-foreground uppercase tracking-wider">
              or
            </span>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="signin-email" className="text-sm text-foreground">Email</Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="john@example.com"
                required
                className="h-11 bg-card border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="signin-password" className="text-sm text-foreground">Password</Label>
                <button 
                  type="button"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  required
                  className="h-11 bg-card border-border text-foreground placeholder:text-muted-foreground pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium mt-2"
            >
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
